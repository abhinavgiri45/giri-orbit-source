package com.giricorporation.giriorbit;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Vibrator;
import android.os.VibrationEffect;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class WebAppInterface {
    private static final String TAG = "OrbitBridge";
    private final Activity activity;
    private final WebView webView;

    public WebAppInterface(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
    }

    @JavascriptInterface
    public boolean isAndroid() {
        return true;
    }

    @JavascriptInterface
    public String getPlatform() {
        return "android";
    }

    @JavascriptInterface
    public String getVersion() {
        return "1.0.2";
    }

    @JavascriptInterface
    public void checkForUpdates() {
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).checkForUpdates(true);
        }
    }

    @JavascriptInterface
    public void showToast(final String message) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void vibrate(final long milliseconds) {
        try {
            Vibrator vibrator = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(milliseconds > 0 ? milliseconds : 30, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    vibrator.vibrate(milliseconds > 0 ? milliseconds : 30);
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Vibration failed", e);
        }
    }

    @JavascriptInterface
    public boolean saveFile(final String filename, final String base64Data, final String mimeType) {
        try {
            String cleanBase64 = base64Data;
            if (cleanBase64.contains(",")) {
                cleanBase64 = cleanBase64.substring(cleanBase64.indexOf(",") + 1);
            }
            final byte[] bytes = Base64.decode(cleanBase64, Base64.DEFAULT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
                values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType != null && !mimeType.isEmpty() ? mimeType : "application/octet-stream");
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/GiriOrbit");

                Uri uri = activity.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri != null) {
                    OutputStream os = activity.getContentResolver().openOutputStream(uri);
                    if (os != null) {
                        os.write(bytes);
                        os.flush();
                        os.close();
                        showToast("Saved to Downloads/GiriOrbit: " + filename);
                        return true;
                    }
                }
            }

            // Fallback for older Android versions or direct filesystem
            File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File orbitDir = new File(downloadsDir, "GiriOrbit");
            if (!orbitDir.exists()) {
                orbitDir.mkdirs();
            }
            File destFile = new File(orbitDir, filename);
            FileOutputStream fos = new FileOutputStream(destFile);
            fos.write(bytes);
            fos.flush();
            fos.close();

            MediaScannerConnection.scanFile(activity, new String[]{destFile.getAbsolutePath()}, new String[]{mimeType}, null);
            showToast("Saved: " + destFile.getAbsolutePath());
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error saving file: " + filename, e);
            showToast("Save failed: " + e.getMessage());
            return false;
        }
    }

    @JavascriptInterface
    public boolean shareDocument(final String filename, final String base64Data, final String mimeType, final String title) {
        try {
            String cleanBase64 = base64Data;
            if (cleanBase64.contains(",")) {
                cleanBase64 = cleanBase64.substring(cleanBase64.indexOf(",") + 1);
            }
            byte[] bytes = Base64.decode(cleanBase64, Base64.DEFAULT);

            File cacheDir = activity.getCacheDir();
            File shareDir = new File(cacheDir, "shared_docs");
            if (!shareDir.exists()) shareDir.mkdirs();

            File outFile = new File(shareDir, filename);
            FileOutputStream fos = new FileOutputStream(outFile);
            fos.write(bytes);
            fos.flush();
            fos.close();

            Uri contentUri = OrbitFileProvider.getUriForFile(outFile);

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType(mimeType != null && !mimeType.isEmpty() ? mimeType : "application/octet-stream");
            shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, filename);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            String chooserTitle = title != null && !title.isEmpty() ? title : "Share Document via";
            Intent chooser = Intent.createChooser(shareIntent, chooserTitle);
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(chooser);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error sharing document: " + filename, e);
            showToast("Share failed: " + e.getMessage());
            return false;
        }
    }

    @JavascriptInterface
    public void printDocument() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    PrintManager printManager = (PrintManager) activity.getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null && webView != null) {
                        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter("GiriOrbit_Document");
                        printManager.print("Giri Orbit Document", printAdapter, new PrintAttributes.Builder().build());
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Print failed", e);
                }
            }
        });
    }

    @JavascriptInterface
    public void exitApp() {
        activity.finish();
    }
}

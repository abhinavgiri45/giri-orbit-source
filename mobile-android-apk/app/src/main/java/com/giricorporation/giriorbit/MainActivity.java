package com.giricorporation.giriorbit;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class MainActivity extends Activity {
    private static final String TAG = "GiriOrbit";
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final String PREFS_NAME = "GiriOrbitPrefs";
    private static final String PREF_BUILD_TIMESTAMP = "build_timestamp";

    private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> filePathCallback;
    private long lastBackPressTime = 0;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure modern dark system bars
        configureSystemBars();

        // Build UI programmatically: FrameLayout containing WebView + top ProgressBar
        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#090a0f"));
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // WebView configuration
        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        webView.setBackgroundColor(Color.parseColor("#090a0f"));
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Add Native JavaScript Bridge
        webView.addJavascriptInterface(new WebAppInterface(this, webView), "AndroidBridge");

        // Top thin loading progress bar
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                (int) (3 * getResources().getDisplayMetrics().density)
        );
        pbParams.gravity = Gravity.TOP;
        progressBar.setLayoutParams(pbParams);
        progressBar.setMax(100);
        ClipDrawable progressDrawable = new ClipDrawable(
                new ColorDrawable(Color.parseColor("#38bdf8")),
                Gravity.LEFT,
                ClipDrawable.HORIZONTAL
        );
        progressBar.setProgressDrawable(progressDrawable);

        rootLayout.addView(webView);
        rootLayout.addView(progressBar);
        setContentView(rootLayout);

        // ChromeClient for File Chooser, Progress, and Permissions
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;

                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");

                String[] mimes = {"*/*"};
                if (params != null && params.getAcceptTypes() != null && params.getAcceptTypes().length > 0) {
                    mimes = params.getAcceptTypes();
                }
                intent.putExtra(Intent.EXTRA_MIME_TYPES, mimes);

                try {
                    startActivityForResult(Intent.createChooser(intent, "Select Document or File"), FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception e) {
                    filePathCallback = null;
                    return false;
                }
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return super.onConsoleMessage(consoleMessage);
            }
        });

        // WebViewClient for navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    Uri uri = request.getUrl();
                    String scheme = uri.getScheme();
                    if ("file".equalsIgnoreCase(scheme) || "data".equalsIgnoreCase(scheme)) {
                        return false;
                    }
                    if ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme) || "mailto".equalsIgnoreCase(scheme)) {
                        try {
                            Intent browserIntent = new Intent(Intent.ACTION_VIEW, uri);
                            startActivity(browserIntent);
                            return true;
                        } catch (Exception ignored) {}
                    }
                }
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://") || url.startsWith("data:")) {
                    return false;
                }
                try {
                    Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(browserIntent);
                    return true;
                } catch (Exception ignored) {
                    return false;
                }
            }
        });

        // Ensure dynamic local web root directory exists
        ensureLocalAssets();

        File indexHtml = new File(getWebRootDir(), "index.html");
        if (indexHtml.exists()) {
            webView.loadUrl("file://" + indexHtml.getAbsolutePath());
        } else {
            webView.loadUrl("file:///android_asset/www/index.html");
        }

        // Background Auto-Update Check
        checkForUpdates(false);
    }

    private File getWebRootDir() {
        return new File(getFilesDir(), "www");
    }

    private void ensureLocalAssets() {
        File webRoot = getWebRootDir();
        File indexFile = new File(webRoot, "index.html");
        if (!indexFile.exists()) {
            try {
                copyAssetFolder(getAssets(), "www", webRoot);
                saveLocalBuildTimestamp(1793982000000L);
            } catch (Exception e) {
                Log.e(TAG, "Failed to extract APK bundled assets", e);
            }
        }
    }

    private static void copyAssetFolder(AssetManager assetManager, String fromAssetPath, File toDir) throws IOException {
        String[] files = assetManager.list(fromAssetPath);
        if (!toDir.exists()) {
            toDir.mkdirs();
        }
        if (files == null || files.length == 0) {
            // It is a file
            try (InputStream in = assetManager.open(fromAssetPath);
                 OutputStream out = new FileOutputStream(toDir)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
            }
        } else {
            // It is a directory
            for (String file : files) {
                String subFrom = fromAssetPath.isEmpty() ? file : fromAssetPath + "/" + file;
                File subTo = new File(toDir, file);
                copyAssetFolder(assetManager, subFrom, subTo);
            }
        }
    }

    private long getLocalBuildTimestamp() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        return prefs.getLong(PREF_BUILD_TIMESTAMP, 1793982000000L);
    }

    private void saveLocalBuildTimestamp(long ts) {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        prefs.edit().putLong(PREF_BUILD_TIMESTAMP, ts).apply();
    }

    public void checkForUpdates(final boolean isManual) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL("https://raw.githubusercontent.com/abhinavgiri45/giri-orbit/main/version.json");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(8000);
                    conn.setRequestProperty("User-Agent", "GiriOrbit-Android/1.0.2");

                    if (conn.getResponseCode() == 200) {
                        InputStream is = conn.getInputStream();
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buf = new byte[4096];
                        int n;
                        while ((n = is.read(buf)) != -1) {
                            baos.write(buf, 0, n);
                        }
                        is.close();

                        String json = baos.toString("UTF-8");
                        final String remoteVersion = extractJsonString(json, "version");
                        final String bundleUrl = extractJsonString(json, "assetsBundleUrl");
                        final long remoteTimestamp = extractJsonLong(json, "buildTimestamp");

                        long localTimestamp = getLocalBuildTimestamp();

                        if (remoteTimestamp > localTimestamp) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    new AlertDialog.Builder(MainActivity.this)
                                        .setTitle("⚡ Giri Orbit Update Available")
                                        .setMessage("A new update (v" + remoteVersion + ") is available with the latest office suite code.\n\nWould you like to download and apply the update now?")
                                        .setPositiveButton("Update Now", new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int which) {
                                                downloadAndApplyUpdate(bundleUrl, remoteVersion, remoteTimestamp);
                                            }
                                        })
                                        .setNegativeButton("Later", null)
                                        .show();
                                }
                            });
                        } else if (isManual) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(MainActivity.this, "✓ Giri Orbit is up to date (v" + remoteVersion + ")", Toast.LENGTH_SHORT).show();
                                }
                            });
                        }
                    } else if (isManual) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, "Could not check for updates (server offline)", Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                } catch (Exception e) {
                    Log.w(TAG, "Update check failed", e);
                    if (isManual) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, "Update check offline: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                }
            }
        }).start();
    }

    private void downloadAndApplyUpdate(final String bundleUrl, final String newVersion, final long newTimestamp) {
        Toast.makeText(this, "Downloading Giri Orbit update bundle...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    File tempZip = new File(getCacheDir(), "orbit_update.zip");
                    URL url = new URL(bundleUrl);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(15000);
                    conn.setReadTimeout(30000);

                    try (InputStream in = conn.getInputStream();
                         FileOutputStream out = new FileOutputStream(tempZip)) {
                        byte[] buf = new byte[8192];
                        int len;
                        while ((len = in.read(buf)) != -1) {
                            out.write(buf, 0, len);
                        }
                    }

                    File newWww = new File(getFilesDir(), "www_new");
                    if (newWww.exists()) deleteRecursively(newWww);
                    newWww.mkdirs();
                    unzipFile(tempZip, newWww);
                    tempZip.delete();

                    if (new File(newWww, "index.html").exists()) {
                        File currentWww = getWebRootDir();
                        File backupWww = new File(getFilesDir(), "www_backup");
                        if (backupWww.exists()) deleteRecursively(backupWww);
                        currentWww.renameTo(backupWww);
                        newWww.renameTo(currentWww);
                        deleteRecursively(backupWww);

                        saveLocalBuildTimestamp(newTimestamp);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, "🚀 Updated to v" + newVersion + "! Reloading...", Toast.LENGTH_LONG).show();
                                webView.reload();
                            }
                        });
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Failed to apply update", e);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Update failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private static void unzipFile(File zipFile, File targetDirectory) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            byte[] buffer = new byte[8192];
            while ((entry = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, entry.getName());
                if (entry.isDirectory()) {
                    file.mkdirs();
                } else {
                    File parent = file.getParentFile();
                    if (parent != null && !parent.exists()) {
                        parent.mkdirs();
                    }
                    try (FileOutputStream fos = new FileOutputStream(file)) {
                        int count;
                        while ((count = zis.read(buffer)) != -1) {
                            fos.write(buffer, 0, count);
                        }
                    }
                }
                zis.closeEntry();
            }
        }
    }

    private static void deleteRecursively(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            File[] files = fileOrDirectory.listFiles();
            if (files != null) {
                for (File child : files) {
                    deleteRecursively(child);
                }
            }
        }
        fileOrDirectory.delete();
    }

    private static String extractJsonString(String json, String key) {
        try {
            Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"");
            Matcher m = p.matcher(json);
            if (m.find()) return m.group(1);
        } catch (Exception ignored) {}
        return "";
    }

    private static long extractJsonLong(String json, String key) {
        try {
            Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*([0-9]+)");
            Matcher m = p.matcher(json);
            if (m.find()) return Long.parseLong(m.group(1));
        } catch (Exception ignored) {}
        return 0L;
    }

    private void configureSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#0d0f18"));
            window.setNavigationBarColor(Color.parseColor("#0d0f18"));
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    Uri uri = data.getData();
                    if (uri != null) {
                        results = new Uri[]{uri};
                    } else if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                "(function() { " +
                "  if (window.orbitHandleAndroidBack && typeof window.orbitHandleAndroidBack === 'function') { " +
                "    return window.orbitHandleAndroidBack(); " +
                "  } " +
                "  var activeModal = document.querySelector('.office-modal-backdrop[style*=\"display: flex\"], .office-modal-backdrop[style*=\"display: block\"], #downloads-corner-modal[style*=\"display: flex\"]'); " +
                "  if (activeModal) { " +
                "    activeModal.style.display = 'none'; " +
                "    return true; " +
                "  } " +
                "  return false; " +
                "})();",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if ("true".equals(value)) {
                            return;
                        }
                        handleSystemBack();
                    }
                }
            );
        } else {
            handleSystemBack();
        }
    }

    private void handleSystemBack() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        long now = System.currentTimeMillis();
        if (now - lastBackPressTime < 2000) {
            super.onBackPressed();
        } else {
            lastBackPressTime = now;
            Toast.makeText(this, "Press BACK again to exit Giri Orbit", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}

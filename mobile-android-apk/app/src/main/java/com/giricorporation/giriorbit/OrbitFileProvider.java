package com.giricorporation.giriorbit;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import android.webkit.MimeTypeMap;

import java.io.File;
import java.io.FileNotFoundException;

public class OrbitFileProvider extends ContentProvider {
    public static final String AUTHORITY = "com.giricorporation.giriorbit.fileprovider";

    @Override
    public boolean onCreate() {
        return true;
    }

    public static Uri getUriForFile(File file) {
        return Uri.parse("content://" + AUTHORITY + "/" + file.getName());
    }

    private File getFileForUri(Uri uri) throws FileNotFoundException {
        String path = uri.getPath();
        if (path == null) throw new FileNotFoundException("Invalid URI path");
        if (path.startsWith("/")) path = path.substring(1);
        File cacheDir = getContext().getCacheDir();
        File file = new File(cacheDir, path);
        if (!file.exists()) {
            File extCache = getContext().getExternalCacheDir();
            if (extCache != null) {
                file = new File(extCache, path);
            }
        }
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + path);
        }
        return file;
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        File file = getFileForUri(uri);
        return ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public String getType(Uri uri) {
        String path = uri.getPath();
        if (path == null) return "application/octet-stream";
        int lastDot = path.lastIndexOf('.');
        if (lastDot >= 0) {
            String ext = path.substring(lastDot + 1).toLowerCase();
            String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
            if (mime != null) return mime;
        }
        return "application/octet-stream";
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        try {
            File file = getFileForUri(uri);
            if (projection == null) {
                projection = new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE};
            }
            MatrixCursor cursor = new MatrixCursor(projection, 1);
            MatrixCursor.RowBuilder builder = cursor.newRow();
            for (String col : projection) {
                if (OpenableColumns.DISPLAY_NAME.equals(col)) {
                    builder.add(file.getName());
                } else if (OpenableColumns.SIZE.equals(col)) {
                    builder.add(file.length());
                } else {
                    builder.add(null);
                }
            }
            return cursor;
        } catch (FileNotFoundException e) {
            return null;
        }
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) { return null; }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) { return 0; }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) { return 0; }
}

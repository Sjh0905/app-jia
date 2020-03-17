package com.http;

import android.widget.ImageView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by fanqilong on 2017/4/26.
 */

public class OkHttpUtils {

    private ResultCallback resultCallback;
    public static OkHttpClient okHttpClient = new OkHttpClient();
    private static OkHttpUtils instance;

    public static OkHttpUtils getInstance() {
        if (instance == null) {
            synchronized (OkHttpUtils.class) {
                instance = new OkHttpUtils();
            }
        }
        return instance;
    }

    public void setResultCallback(ResultCallback resultCallback) {
        this.resultCallback = resultCallback;
    }

    public OkHttpUtils downloadFile(String url, final String destFileDir, final String destFileName) {

        Request request = new Request.Builder().url(url).build();
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                if (resultCallback != null) {
                    resultCallback.onFailure(call, e);
                }
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                InputStream is = null;
                byte[] buf = new byte[2048];
                int len = 0;
                FileOutputStream fos = null;
                try {
                    is = response.body().byteStream();
                    long total = response.body().contentLength();

                    File fileDir = new File(destFileDir);
                    if (!fileDir.exists()) {
                        fileDir.mkdirs();
                    }

                    File file = new File(destFileDir, destFileName);
                    fos = new FileOutputStream(file);
                    long sum = 0;
                    while ((len = is.read(buf)) != -1) {
                        fos.write(buf, 0, len);
                        sum += len;
                        float progress = (sum * 1.0f / total * 100);

                        if (resultCallback != null) {
                            resultCallback.inProgress(progress);
                        }

                    }
                    fos.flush();
                    if (resultCallback != null) {
                        resultCallback.onSuccess();
                    }
                } catch (Exception e) {
                    if (resultCallback != null) {
                        resultCallback.onError(e);
                    }
                } finally {
                    try {
                        if (is != null)
                            is.close();
                    } catch (IOException e) {
                    }
                    try {
                        if (fos != null)
                            fos.close();
                    } catch (IOException e) {
                    }
                }


            }
        });

        return this;
    }


    public interface ResultCallback {

        void onFailure(Call call, IOException e);

        void inProgress(float progress);

        void onSuccess();

        void onError(Exception e);
    }

    /**
     * @param tag         请求标记（建议使用页面及TAG）
     * @param url         url
     * @param view        图片控件
     * @param headerName  请求头的name
     * @param headerValue 请求头的value
     */
    public void loadImage(Object tag, String url, ImageView view, String headerName, String headerValue) {
        Request request = new Request.Builder().url(url).addHeader(headerName, headerValue).build();
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {

            }
        });
    }
}

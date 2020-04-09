package com.twentytwenty.exchange;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.http.OkHttpUtils;
import com.http.ToastUtil;
import com.tbruyelle.rxpermissions2.RxPermissions;
//import com.vondear.rxtools.RxAppTool;

import java.io.File;
import java.io.IOException;

import io.reactivex.functions.Consumer;
import okhttp3.Call;


public class GetAndroidUpdateModule extends ReactContextBaseJavaModule {
    private Context context;
    private ProgressDialog pBar;
    Handler handler = new Handler(Looper.getMainLooper());

    public GetAndroidUpdateModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "GetAndroidUpdate";
    }

    /**
     * 下载新的app
     *
     * @param updateUrl
     */
    @ReactMethod
    private void loadAndroidApk(final String updateUrl) {
        class MyThread implements Runnable {
            public void run() {
                //原来想要执行的代码
                RxPermissions rxPermissions = new RxPermissions(getReactApplicationContext().getCurrentActivity());
                rxPermissions.request(Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        .subscribe((Consumer<? super Boolean>) aBoolean -> {

                                    File file = new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME);
                                    if (file.exists()) {
                                        file.delete();
                                    }

                                    pBar = new ProgressDialog(getCurrentActivity());    //进度条，在下载的时候实时更新进度，提高用户友好度
                                    pBar.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                            pBar.setTitle(context.getString(R.string.downloading));
                            pBar.setMessage(context.getString(R.string.waiting));
                                    pBar.setProgress(0);
                                    pBar.setCancelable(false);
                                    pBar.show();


                                    OkHttpUtils.getInstance().downloadFile(updateUrl,
                                            AppConfig.UPDATE_APK_URL, AppConfig.UPDATE_APK_NAME).setResultCallback(new OkHttpUtils.ResultCallback() {

                                        @Override
                                        public void onFailure(Call call, IOException e) {
                                            //消失弹出框
                                            if (null != pBar && pBar.isShowing()) {
                                                pBar.dismiss();
                                            }
                                        }

                                        @Override
                                        public void inProgress(float progress) {
                                            pBar.setProgress((int) progress);
                                        }

                                        @Override
                                        public void onSuccess() {
                                            //消失弹出框
                                            if (null != pBar && pBar.isShowing()) {
                                                pBar.dismiss();
                                            }
                                            //准备安装应用
                                            installApk(new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME));
                                        }

                                        @Override
                                        public void onError(Exception e) {
                                            //消失弹出框
                                            if (null != pBar && pBar.isShowing()) {
                                                pBar.dismiss();
                                            }
//                                            Log.d("baobao", "onError: "+e.toString());
                                            Looper.prepare();
                                            ToastUtil.showShort(context, "文件加载失败");
                                            Looper.loop();
                                            File file = new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME);
                                            if (file.isFile()) {
                                                file.delete();
                                            }
                                        }
                                    });
                                }
                        );
            }
        }
        handler.post(new MyThread());
    }

    protected boolean isCompatible(int apiLevel) {
        return Build.VERSION.SDK_INT >= apiLevel;
    }

    /**
     * 下载完成后直接安装打开
     *
     * @param file
     */
    protected void installApk(File file) {
        Intent installAPKIntent = new Intent(Intent.ACTION_VIEW);
        installAPKIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);//安装完成后打开新的apk
        installAPKIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        if (isCompatible(Build.VERSION_CODES.N)) {
//            RxAppTool.installApp(context, file);
            Uri fileUri = FileProvider.getUriForFile(context, BuildConfig.APPLICATION_ID+".provider", file);
            installAPKIntent.setDataAndType(fileUri, "application/vnd.android.package-archive");
            context.startActivity(installAPKIntent);
        } else {
            installAPKIntent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
            context.startActivity(installAPKIntent);
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    @ReactMethod
    private void UpdateCamera(String fileName){
        // 发送广播，通知刷新图库的显示
        context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse(fileName)));
    }
}

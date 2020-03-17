package com.midautumnzhongqiu.exchange;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;
import android.webkit.CookieManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.geetest.gt3unbindsdk.Bind.GT3Geetest;
import com.geetest.gt3unbindsdk.Bind.GT3GeetestBindListener;
import com.geetest.gt3unbindsdk.Bind.GT3GeetestUtilsBind;
import com.http.ApiSubscriber;
import com.http.CxcHttp;
import com.http.GetGeetestRequest;
import com.http.MobileStrApi;
import com.http.OkHttpUtils;
import com.http.ToastUtil;
import com.tbruyelle.rxpermissions2.RxPermissions;
//import com.vondear.rxtools.RxAppTool;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import io.reactivex.functions.Consumer;
import okhttp3.Call;


public class GetGeetestModule extends ReactContextBaseJavaModule {
    private ProgressDialog pBar;
    private Context context;
    private GT3GeetestUtilsBind gt3GeetestUtils;
    private static final String OPTIONS_NAME = "name";
    private static final String OPTIONS_VALUE = "value";
    private static final String OPTIONS_DOMAIN = "domain";
    private static final String OPTIONS_ORIGIN = "origin";
    private static final String OPTIONS_PATH = "path";
    private static final String OPTIONS_EXPIRATION = "expiration";

    public GetGeetestModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "GetGeetestAndroid";
    }

    @ReactMethod
    public void tryCallBack(String name, String psw, Callback errorCallback, Callback successCallback){
        try{
            if(TextUtils.isEmpty(name)&&TextUtils.isEmpty(psw)){
                // 失败时回调
                errorCallback.invoke("user or psw  is empty");
            }
            // 成功时回调
            successCallback.invoke("add user success");
        }catch(IllegalViewOperationException e){
            // 失败时回调
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void tryPromise(String _domain, String API2, final Promise promise){
        try{
//            if(TextUtils.isEmpty(name)&&TextUtils.isEmpty(psw)){
//                promise.reject("0","user name  or psw is empty");
//            }
            final String[] geetestStr = {""};
            final String captchaURL = API2;
            final String domain = _domain;
//            'API1======', 'https://bw-test-aws.btcdo.org/user/pullGeetest?client_type=\'APP\''
//            'API2======', 'https://bw-test-aws.btcdo.org/user/checkGeetest'

            gt3GeetestUtils = new GT3GeetestUtilsBind(getReactApplicationContext());

            CxcHttp.with(context).setShowWaitingDialog(true)
                    .setObservable(MobileStrApi.getGeetest(new GetGeetestRequest()))
                    .subscriber(new ApiSubscriber<String>() {
                        @Override
                        public void onNext(String s) {
                            final String originCookies = CookieManager.getInstance().getCookie(domain);
//                        LogUtil.e(s);
//{"dataMap":{"resStr":"{\"success\":1,\"challenge\":\"60b6b25192f98fe336ada64b06eb7072\",\"gt\":\"353eb57b95c4f6530bd489f14c1af4b4\"}"},"errorCode":0,"result":"SUCCESS"}
                            try {
//                            String captchaURL = AppConfig.BASE_URL + "/user/getGeetest";

                                GT3Geetest captcha = new GT3Geetest(
                                        captchaURL, captchaURL, null
                                );

                                JSONObject jsonObject = new JSONObject(s);
                                //parmas格式"{\"success\":1,\"challenge\":\"4a5cef77243baa51b2090f7258bf1368\",\"gt\":\"019924a82c70bb123aae90d483087f94\",\"new_captcha\":true}"

                                JSONObject dataMap = jsonObject.optJSONObject("dataMap");
                                String resStr = dataMap.optString("resStr");
                                JSONObject resStrObj = new JSONObject(resStr);
                                String challenge = resStrObj.optString("challenge");
                                String gt = resStrObj.optString("gt");

                                JSONObject jsonObject1 = new JSONObject("{\"success\":1,\"challenge\":\"" + challenge + "\",\"gt\":\"" + gt + "\",\"new_captcha\":true}");
//                            Activity currentActivity = getCurrentActivity();
                                gt3GeetestUtils.gtSetApi1Json(jsonObject1);
                                gt3GeetestUtils.getGeetest(getCurrentActivity(), captchaURL, captchaURL, null, new GT3GeetestBindListener() {
                                    @Override
                                    public void gt3CloseDialog(int i) {
                                        super.gt3CloseDialog(i);
                                    }

                                    @Override
                                    public void gt3DialogReady() {
                                        super.gt3DialogReady();
                                        String[] cookies = originCookies.split(";");
                                        for(int i = 0; i< cookies.length;i++){
                                            if(!cookies[i].trim().equals("")){
                                                String oneCookie = cookies[i] + ";";
                                                CookieManager.getInstance().setCookie(domain,oneCookie);
                                            }
                                        }
                                    }

                                    @Override
                                    public void gt3FirstResult(JSONObject jsonObject) {
                                        super.gt3FirstResult(jsonObject);
                                    }

                                    @Override
                                    public Map<String, String> gt3CaptchaApi1() {
                                        return super.gt3CaptchaApi1();
                                    }

                                    /**
                                     * 设置是否自定义第二次验证ture为是 默认为false(不自定义)
                                     * 如果为false这边的的完成走gt3GetDialogResult(String result)
                                     * 如果为true这边的的完成走gt3GetDialogResult(boolean a, String result)
                                     * result为二次验证所需要的数据
                                     */
                                    @Override
                                    public boolean gt3SetIsCustom() {
                                        return true;
                                    }

                                    /**
                                     * 需要做验证统计的可以打印此处的JSON数据
                                     * JSON数据包含了极验每一步的运行状态和结果
                                     */
                                    @Override
                                    public void gt3GeetestStatisticsJson(JSONObject jsonObject) {
                                        super.gt3GeetestStatisticsJson(jsonObject);
                                        Log.e("meizu","gt3GeetestStatisticsJson"+jsonObject.toString());
                                    }

                                    @Override
                                    public void gt3GetDialogResult(String s) {
                                        super.gt3GetDialogResult(s);
                                        Log.e("meizu","gt3GetDialogResult"+s);
                                    }

                                    /**
                                     * 自定义二次验证，当gtSetIsCustom为ture时执行这里面的代码
                                     */
                                    @Override
                                    public void gt3GetDialogResult(boolean status, String result) {
                                        /**
                                         *  利用异步进行解析这result进行二次验证，结果成功后调用gt3GeetestUtils.gt3TestFinish()方法调用成功后的动画，然后在gt3DialogSuccess执行成功之后的结果
                                         * //                JSONObject res_json = new JSONObject(result);
                                         //
                                         //                Map<String, String> validateParams = new HashMap<>();
                                         //
                                         //                validateParams.put("geetest_challenge", res_json.getString("geetest_challenge"));
                                         //
                                         //                validateParams.put("geetest_validate", res_json.getString("geetest_validate"));
                                         //
                                         //                validateParams.put("geetest_seccode", res_json.getString("geetest_seccode"));
                                         //  二次验证成功调用 gt3GeetestUtils.gt3TestFinish();
                                         //  二次验证失败调用 gt3GeetestUtils.gt3TestClose();
                                         */
                                        Log.e("meizu","gt3GetDialogResult"+result);
//                                        {"geetest_challenge":"60b6b25192f98fe336ada64b06eb70727v","geetest_validate":"052657562b6dd5f2183a6efc8df46139","geetest_seccode":"052657562b6dd5f2183a6efc8df46139|jordan"}
//                                    Login(result);
//                                    Toast.makeText(context,"gt3GetDialogResult2 "+result,Toast.LENGTH_LONG).show();
//                                        geetestStr[0] = result.toString();
                                        WritableMap map = Arguments.createMap();

                                        map.putString("gtStr", result.toString());
//                                        String cookies = UserControl.getCookie();
////                                        Log.e("cookies",cookies);
////                                        map.putString("cookie", cookies);
//
//                                        String[] cookieList = cookies.split(";");
//
//                                        String expires = "";
//                                        String path = "";
//                                        String domain;
//                                        try{
//                                            domain = captchaURL.split("//")[1].split("/")[0];
//                                        }catch(Exception ex){
//                                            domain = "";
//                                        }
//
//                                        //此处写cookie
//                                        for(int i = 0; i < cookieList.length;i++){
//                                            String[] oneCookies = cookieList[i].split("=");
//                                            if(oneCookies.length == 2){
//                                                String key = oneCookies[0].trim();
//                                                String value = oneCookies[1].trim();
//                                                if(key.equals("Expires")){
//                                                    expires = oneCookies[1].trim();
//                                                }
//                                                if(key.equals("Path")){
//                                                    path = oneCookies[1].trim();
//                                                }
//
//                                            }
//                                        }
//
//                                        for(int i = 0; i < cookieList.length;i++){
//                                            String[] oneCookies = cookieList[i].split("=");
//                                            if(oneCookies.length == 2 && (!oneCookies[0].trim().equals("Expires")) && !oneCookies[0].trim().equals("Path") && !oneCookies[0].trim().equals("Max-Age")){
//                                                String key = oneCookies[0].trim();
//                                                String value = oneCookies[1].trim();
//                                                String cookieStr = key + "=" + value + ";"
//                                                        + OPTIONS_PATH + "=" + path + ";"
//                                                        + OPTIONS_EXPIRATION + "=" + expires + ";"
//                                                        + OPTIONS_DOMAIN + "=" + domain;
//                                                CookieManager.getInstance().setCookie(domain, cookieStr);
//                                            }
//                                        }

                                        gt3GeetestUtils.gt3Dismiss();
                                        promise.resolve(map);
                                    }

                                    @Override
                                    public Map<String, String> gt3SecondResult() {
                                        return super.gt3SecondResult();
                                    }

                                    @Override
                                    public void gt3DialogSuccessResult(String s) {
                                        super.gt3DialogSuccessResult(s);
                                    }

                                    @Override
                                    public void gt3DialogOnError(String s) {
                                        super.gt3DialogOnError(s);
                                    }
                                });
                                gt3GeetestUtils.setDialogTouch(true);
                            } catch (JSONException e) {
                                e.printStackTrace();
                                gt3GeetestUtils.gt3Dismiss();
                            }
                        }

                        @Override
                        public void onError(Throwable e) {
                            super.onError(e);
                        }
                    });




        }catch(IllegalViewOperationException e){
            promise.reject("2",e.getMessage());
        }
    }


//    Handler handler = new Handler(Looper.getMainLooper());
//    /**
//     * 下载新的app
//     *
//     * @param updateUrl
//     */
//    @ReactMethod
//    public void loadAndroidApk(final String updateUrl) {
//        class MyThread implements Runnable {
//            public void run() {
//                //原来想要执行的代码
//                RxPermissions rxPermissions = new RxPermissions(getReactApplicationContext().getCurrentActivity());
//                rxPermissions.request(Manifest.permission.READ_EXTERNAL_STORAGE,
//                        Manifest.permission.WRITE_EXTERNAL_STORAGE)
//                        .subscribe((Consumer<? super Boolean>) aBoolean -> {
//
//                                    File file = new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME);
//                                    if (file.exists()) {
//                                        file.delete();
//                                    }
//
//                                    pBar = new ProgressDialog(getCurrentActivity());    //进度条，在下载的时候实时更新进度，提高用户友好度
//                                    pBar.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
//                            pBar.setTitle(context.getString(R.string.downloading));
//                            pBar.setMessage(context.getString(R.string.waiting));
//                                    pBar.setProgress(0);
//                                    pBar.setCancelable(false);
//                                    pBar.show();
//
//
//                                    OkHttpUtils.getInstance().downloadFile(updateUrl,
//                                            AppConfig.UPDATE_APK_URL, AppConfig.UPDATE_APK_NAME).setResultCallback(new OkHttpUtils.ResultCallback() {
//
//                                        @Override
//                                        public void onFailure(Call call, IOException e) {
//                                            //消失弹出框
//                                            if (null != pBar && pBar.isShowing()) {
//                                                pBar.dismiss();
//                                            }
//                                        }
//
//                                        @Override
//                                        public void inProgress(float progress) {
//                                            pBar.setProgress((int) progress);
//                                        }
//
//                                        @Override
//                                        public void onSuccess() {
//                                            //消失弹出框
//                                            if (null != pBar && pBar.isShowing()) {
//                                                pBar.dismiss();
//                                            }
//                                            //准备安装应用
//                                            installApk(new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME));
//                                        }
//
//                                        @Override
//                                        public void onError(Exception e) {
//                                            //消失弹出框
//                                            if (null != pBar && pBar.isShowing()) {
//                                                pBar.dismiss();
//                                            }
//                                            ToastUtil.showShort(context, "文件加载失败");
//                                            File file = new File(AppConfig.UPDATE_APK_URL + File.separator + AppConfig.UPDATE_APK_NAME);
//                                            if (file.isFile()) {
//                                                file.delete();
//                                            }
//                                        }
//                                    });
//                                }
//                        );
//            }
//        }
//        handler.post(new MyThread());
//    }

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
//            Uri fileUri = FileProvider.getUriForFile(this, BuildConfig.APPLICATION_ID, file);
//            installAPKIntent.setDataAndType(fileUri, "application/vnd.android.package-archive");

        } else {
            installAPKIntent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
            context.startActivity(installAPKIntent);
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }



    @ReactMethod
    public String getChartUrl(){
        Toast.makeText(context,"file:///android_asset/chart/html.html ",Toast.LENGTH_LONG).show();
        String path = "file:///android_asset/chart/index.html";
        File file = new File(path);
        return path;
//        return "file:///android_asset/chart/index.html";
    }

//    @ReactMethod
//    public String getGeetest(){
//        final String[] geetestStr = {""};
//        final String captchaURL = "https://bw-test-aws.btcdo.org/apis/user/getGeetest";
////        Toast.makeText(context,"getGeetest= "+captchaURL,Toast.LENGTH_LONG).show();
//
//        gt3GeetestUtils = new GT3GeetestUtilsBind(getReactApplicationContext());
//
//        CxcHttp.with(context).setShowWaitingDialog(true)
//                .setObservable(MobileStrApi.getGeetest(new GetGeetestRequest()))
//                .subscriber(new ApiSubscriber<String>() {
//                    @Override
//                    public void onNext(String s) {
////                        LogUtil.e(s);
////{"dataMap":{"resStr":"{\"success\":1,\"challenge\":\"60b6b25192f98fe336ada64b06eb7072\",\"gt\":\"353eb57b95c4f6530bd489f14c1af4b4\"}"},"errorCode":0,"result":"SUCCESS"}
//                        try {
////                            String captchaURL = AppConfig.BASE_URL + "/user/getGeetest";
//
//                            GT3Geetest captcha = new GT3Geetest(
//                                    captchaURL, captchaURL, null
//                            );
//
//                            JSONObject jsonObject = new JSONObject(s);
//                            //parmas格式"{\"success\":1,\"challenge\":\"4a5cef77243baa51b2090f7258bf1368\",\"gt\":\"019924a82c70bb123aae90d483087f94\",\"new_captcha\":true}"
//
//                            JSONObject dataMap = jsonObject.optJSONObject("dataMap");
//                            String resStr = dataMap.optString("resStr");
//                            JSONObject resStrObj = new JSONObject(resStr);
//                            String challenge = resStrObj.optString("challenge");
//                            String gt = resStrObj.optString("gt");
//
//                            JSONObject jsonObject1 = new JSONObject("{\"success\":1,\"challenge\":\"" + challenge + "\",\"gt\":\"" + gt + "\",\"new_captcha\":true}");
////                            Activity currentActivity = getCurrentActivity();
//                            gt3GeetestUtils.gtSetApi1Json(jsonObject1);
//                            gt3GeetestUtils.getGeetest(getCurrentActivity(), captchaURL, captchaURL, null, new GT3GeetestBindListener() {
//                                @Override
//                                public void gt3CloseDialog(int i) {
//                                    super.gt3CloseDialog(i);
//                                }
//
//                                @Override
//                                public void gt3DialogReady() {
//                                    super.gt3DialogReady();
//                                }
//
//                                @Override
//                                public void gt3FirstResult(JSONObject jsonObject) {
//                                    super.gt3FirstResult(jsonObject);
//                                }
//
//                                @Override
//                                public Map<String, String> gt3CaptchaApi1() {
//                                    return super.gt3CaptchaApi1();
//                                }
//
//                                /**
//                                 * 设置是否自定义第二次验证ture为是 默认为false(不自定义)
//                                 * 如果为false这边的的完成走gt3GetDialogResult(String result)
//                                 * 如果为true这边的的完成走gt3GetDialogResult(boolean a, String result)
//                                 * result为二次验证所需要的数据
//                                 */
//                                @Override
//                                public boolean gt3SetIsCustom() {
//                                    return true;
//                                }
//
//                                /**
//                                 * 需要做验证统计的可以打印此处的JSON数据
//                                 * JSON数据包含了极验每一步的运行状态和结果
//                                 */
//                                @Override
//                                public void gt3GeetestStatisticsJson(JSONObject jsonObject) {
//                                    super.gt3GeetestStatisticsJson(jsonObject);
//                                    Log.e("meizu","gt3GeetestStatisticsJson"+jsonObject.toString());
//                                }
//
//                                @Override
//                                public void gt3GetDialogResult(String s) {
//                                    super.gt3GetDialogResult(s);
//                                    Log.e("meizu","gt3GetDialogResult"+s);
//                                }
//
//                                /**
//                                 * 自定义二次验证，当gtSetIsCustom为ture时执行这里面的代码
//                                 */
//                                @Override
//                                public void gt3GetDialogResult(boolean status, String result) {
//                                    /**
//                                     *  利用异步进行解析这result进行二次验证，结果成功后调用gt3GeetestUtils.gt3TestFinish()方法调用成功后的动画，然后在gt3DialogSuccess执行成功之后的结果
//                                     * //                JSONObject res_json = new JSONObject(result);
//                                     //
//                                     //                Map<String, String> validateParams = new HashMap<>();
//                                     //
//                                     //                validateParams.put("geetest_challenge", res_json.getString("geetest_challenge"));
//                                     //
//                                     //                validateParams.put("geetest_validate", res_json.getString("geetest_validate"));
//                                     //
//                                     //                validateParams.put("geetest_seccode", res_json.getString("geetest_seccode"));
//                                     //  二次验证成功调用 gt3GeetestUtils.gt3TestFinish();
//                                     //  二次验证失败调用 gt3GeetestUtils.gt3TestClose();
//                                     */
//                                    Log.e("meizu","gt3GetDialogResult"+result);
////                                        {"geetest_challenge":"60b6b25192f98fe336ada64b06eb70727v","geetest_validate":"052657562b6dd5f2183a6efc8df46139","geetest_seccode":"052657562b6dd5f2183a6efc8df46139|jordan"}
////                                    Login(result);
////                                    Toast.makeText(context,"gt3GetDialogResult2 "+result,Toast.LENGTH_LONG).show();
//                                    geetestStr[0] = result.toString();
//                                    gt3GeetestUtils.gt3Dismiss();
//
//                                }
//
//                                @Override
//                                public Map<String, String> gt3SecondResult() {
//                                    return super.gt3SecondResult();
//                                }
//
//                                @Override
//                                public void gt3DialogSuccessResult(String s) {
//                                    super.gt3DialogSuccessResult(s);
//                                }
//
//                                @Override
//                                public void gt3DialogOnError(String s) {
//                                    super.gt3DialogOnError(s);
//                                }
//                            });
//                            gt3GeetestUtils.setDialogTouch(true);
//                        } catch (JSONException e) {
//                            e.printStackTrace();
//                            gt3GeetestUtils.gt3Dismiss();
//                        }
//                    }
//                });
//        return geetestStr.toString();
//    }


}

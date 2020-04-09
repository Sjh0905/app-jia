package com.twentytwenty.exchange;

import android.os.Build;
import android.webkit.CookieManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class AndroidModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;

    public AndroidModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "AndroidModule";
    }

    @ReactMethod
    private void openAndroidPermission() {
        new PermissionPageUtils(context).jumpPermissionPage();
    }

    @ReactMethod
    public void onRNStart(String mPageName) {

    }
    @ReactMethod
    public void getCookies(String domain, Callback callback){
        String cookies = CookieManager.getInstance().getCookie(domain);
        callback.invoke(cookies);
    }

    @ReactMethod
    public void cookieFlush(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().flush();
        }
    }


}

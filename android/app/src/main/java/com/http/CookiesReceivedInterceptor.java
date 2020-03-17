package com.http;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.util.Log;
import android.webkit.CookieManager;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Response;
import rx.Observable;
import rx.functions.Action1;
import rx.functions.Func1;

/**
 * Created by MIT on 2018/1/18.
 * 实现Interceptor器，将Http返回的cookie存储到本地
 */

public class CookiesReceivedInterceptor implements Interceptor {

    private Context context;
    SharedPreferences sharedPreferences;


    public CookiesReceivedInterceptor(Context context) {
        super();
        this.context = context;
        sharedPreferences = context.getSharedPreferences("cookie", Context.MODE_PRIVATE);
    }

    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {

        final Response originalResponse = chain.proceed(chain.request());
        Log.d("http", "originalResponse intercept " + originalResponse.toString());


        if (!originalResponse.headers("set-cookie").isEmpty()) {
            final StringBuffer cookieBuffer = new StringBuffer();
            Observable.from(originalResponse.headers("set-cookie"))
                    .map(new Func1<String, String>() {
                        @Override
                        public String call(String s) {
                            String[] cookieArray = s.split(";");
//                            userId=9160040577; Max-Age=2147483647; Expires=Mon, 05-Aug-2086 11:29:57 GMT; Path=/; HttpOnly
                            Log.i("http", "CookiesReceivedInterceptor call= " + s.toString());
                            return s;
                        }
                    })
                    .subscribe(new Action1<String>() {
                        @Override
                        public void call(String cookie) {
//                            String cookies = cookieBuffer.toString();
//                            CookieManager.getInstance().setCookie(originalResponse.request().url().host(),cookie);
                            String domain = originalResponse.request().url().scheme() + "://" + chain.request().url().host();
                            Log.e("meizu",originalResponse.request().url().scheme()+" =new Action1 = "+chain.request().url().host());
//                            String cookies = cookieBuffer.toString();
                            String[] cookieList = cookie.split(";");
                            for(int i = 0; i < cookieList.length; i++){
                                if(!cookieList[i].trim().equals("")){
                                    CookieManager.getInstance().setCookie(domain, cookieList[i]);
                                }
                            }
//                            cookieBuffer.append(cookie).append(";");
                        }
                    });

//                UserControl.saveCookie(cookieBuffer.toString());
//                gt_server_status=1;userId=8431045108;
//                Log.i("http", "CookiesReceivedInterceptor " + cookieBuffer.toString());

        }

        return originalResponse;
    }

}

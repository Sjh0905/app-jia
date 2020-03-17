package com.http;

import android.content.Context;
import android.util.Log;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import rx.Observable;
import rx.functions.Action1;
import android.webkit.CookieManager;

/**
 * Created by MIT on 2018/1/18.
 * 实现Interceptor器，用来将本地的cookie追加到http请求头中
 */
public class CookiesAddInterceptor implements Interceptor {
    private Context context;
    private String lang;

    public CookiesAddInterceptor(Context context) {
        super();
        this.context = context;
//        this.lang = lang;
    }

    public CookiesAddInterceptor(Context context, String lang) {
        super();
        this.context = context;
        this.lang = lang;

    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        if (chain == null)
            Log.d("meizu", "Addchain == null");
        final Request.Builder builder = chain.request().newBuilder();
//        String cookie = UserControl.getCookie();

        String domain = chain.request().url().scheme() + "://" + chain.request().url().host();
        Log.e("meizu",chain.request().url().scheme()+" =domain intercept= "+chain.request().url().host());
        String cookie = CookieManager.getInstance().getCookie(domain);
        Log.d("meizu", "CookiesAddInterceptor cookie= " + cookie);

        if(cookie == null){
            cookie = "";
        }
        Observable.just(cookie)
                .subscribe(new Action1<String>() {
                    @Override
                    public void call(String cookie) {
                        //添加cookie
                        Log.d("meizu", "CookiesAddInterceptor UserControl.getCookie() " + cookie);
//                        gt_server_status=1;userId=8431045108;
//                        if (!cookie.contains("-deleted-")) {
                            builder.addHeader("cookie", cookie);
//                        }
                    }
                });
        return chain.proceed(builder.build());
    }
}

package com.http;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.twentytwenty.exchange.AppConfig;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.lang.ref.WeakReference;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;
import retrofit2.Converter;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava.RxJavaCallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;
import rx.Observable;

/**
 * Created by fanqilong on 2017/4/21.
 * 封装新的链式结构的网络请求
 */

public class CxcHttp {
    public static final String TAG = "RtHttp";
    public static CxcHttp instance = new CxcHttp();
    private Observable observable;
    private static WeakReference<Context> wrContext;
    private boolean isShowWaitingDialog;

    /**
     * 设置Context,使用弱引用
     *
     * @param ct
     * @return
     */
    public static CxcHttp with(Context ct) {
        wrContext = new WeakReference<Context>(ct);
        return instance;
    }

    /**
     * 设置是否显示加载动画
     *
     * @param showWaitingDialog
     * @return
     */
    public CxcHttp setShowWaitingDialog(boolean showWaitingDialog) {
        isShowWaitingDialog = showWaitingDialog;
        return instance;
    }

    /**
     * 设置observable
     *
     * @param observable
     * @return
     */
    public CxcHttp setObservable(Observable observable) {
        this.observable = observable;
        return instance;
    }

    /**
     * 设置ApiSubscriber
     *
     * @param subscriber
     * @return
     */
    public CxcHttp subscriber(ApiSubscriber subscriber) {
        subscriber.setContext(wrContext.get());  //给subscriber设置Context，用于显示网络加载动画
        subscriber.setShowWaitDialog(isShowWaitingDialog); //控制是否显示动画
        observable.subscribe(subscriber); //RxJava 方法
        return instance;
    }


    /**
     * 使用Retrofit.Builder和OkHttpClient.Builder构建NetworkApi
     */
    public static class ApiServiceBuild {
        private String baseUrl;  //根地址
        private Retrofit.Builder rtBuilder;
        private OkHttpClient.Builder okBuild;
        private Converter.Factory convertFactory;
        private Converter.Factory convertFactory2;

        public ApiServiceBuild setConvertFactory(Converter.Factory convertFactory) {
            this.convertFactory = convertFactory;
            return this;
        }

        public ApiServiceBuild setConvertFactory2(Converter.Factory convertFactory2) {
            this.convertFactory2 = convertFactory2;
            return this;
        }

        public ApiServiceBuild setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
            return this;
        }


        public ApiService build() {
            rtBuilder = new Retrofit.Builder();
            okBuild = new OkHttpClient().newBuilder();
            //链接超时
            okBuild.connectTimeout(60, TimeUnit.SECONDS);
            //读取超时
            okBuild.readTimeout(60, TimeUnit.SECONDS);
            //设置log拦截器
//            if (BuildConfig.DEBUG) {
//                HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor(new HttpLoggingInterceptor.Logger() {
//                    @Override
//                    public void log(@NonNull String message) {
//                        Log.e("zzz", "===============log拦截器===================");
//                        Log.e("zzz", message);
//                        Log.e("zzz", "==========================================");
//                    }
//                });
//                loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
//                okBuild.addInterceptor(loggingInterceptor);
//            }
            okBuild.interceptors().add(new CookiesReceivedInterceptor(wrContext.get()));
            okBuild.interceptors().add(new CookiesAddInterceptor(wrContext.get()));//, "_bitsession_"
            okBuild.sslSocketFactory(createSSLSocketFactory());
            okBuild.hostnameVerifier(new TrustAllHostnameVerifier());

            if (!TextUtils.isEmpty(baseUrl)) {
                rtBuilder.baseUrl(baseUrl);
            } else {
                rtBuilder.baseUrl(AppConfig.BASE_URL);
            }
            Log.e("meizu",baseUrl+" =baseUrl AppConfig.BASE_URL= "+AppConfig.BASE_URL);

            if (convertFactory != null) {
                rtBuilder.addConverterFactory(convertFactory);
            } else {
                Gson gson = new GsonBuilder().setLenient().create();
                rtBuilder.addConverterFactory(GsonConverterFactory.create(gson));
            }
            if (convertFactory2 != null) {
                rtBuilder.addConverterFactory(convertFactory2);
            }
            rtBuilder.addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                    .client(okBuild.build());
            return rtBuilder.build().create(ApiService.class);
        }
    }

    private static SSLSocketFactory createSSLSocketFactory() {
        SSLSocketFactory ssfFactory = null;

        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, new TrustManager[]{new TrustAllCerts()}, new SecureRandom());

            ssfFactory = sc.getSocketFactory();
        } catch (Exception e) {
        }

        return ssfFactory;
    }

    private static class TrustAllCerts implements X509TrustManager {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    }

    private static class TrustAllHostnameVerifier implements HostnameVerifier {
        @Override
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    }
}

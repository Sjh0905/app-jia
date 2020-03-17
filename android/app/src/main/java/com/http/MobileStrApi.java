package com.http;

import retrofit2.converter.scalars.ScalarsConverterFactory;
import rx.Observable;

/**
 * Created by MIT on 2018/1/11.
 */
public class MobileStrApi extends BaseApi {
    private static ApiService apiService;

    private static ApiService getApiService() { //使用NetworkApiBuilder创建networkApi
        if (apiService == null) {
            apiService = new CxcHttp.ApiServiceBuild().setConvertFactory2(ScalarsConverterFactory.create()).build();
        }
        return apiService;
    }

    private static Observable getObservable(Observable observable) {
        observable = new ObservableBuilder(observable)
                .build();
        return observable;
    }

    /**
     * 验证
     * @param request
     * @return
     */
    public static Observable getGeetest(GetGeetestRequest request) {
        return getObservable(getApiService().getGeetest(request));
    }

    public static Observable pullGeetest() {
        return getObservable(getApiService().pullGeetest());
    }

}

package com.http;

import com.google.gson.JsonObject;

import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import rx.Observable;

/**
 * Created by fanqilong on 2017/4/21.
 * api接口
 */
public interface ApiService {

    /**
     * 验证
     * @param request
     * @return
     */
    @POST("/user/getGeetest")
    Observable<String> getGeetest(@Body GetGeetestRequest request);

    @GET("/user/pullGeetest?client_type='APP'")
    Observable<JsonObject> pullGeetest();

}

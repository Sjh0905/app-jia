package com.http;

import com.twentytwenty.exchange.MainApplication;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by MIT on 2018/1/15.
 */
public final class UserControl {
    private UserControl() {
    }

    // 用户信息
    public static final String USER_INFO = "userInfo";

    public static final String COOKIE = "cookie";

    public static boolean isBlank(String str) {
        return null == str || "".equals(str.trim());
    }
    
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    public static void saveCookie(String cookie) {
        // 将 cookie 介个 存在 map 中

        Map<String, String> cookie2Update = getCookie2Update();
        if (cookie2Update == null) {
            cookie2Update = new HashMap<>();
        }
        
        String[] splitCookie = cookie.split(";");
        for (String s : splitCookie) {
            if (s.contains("_bitsession_")) {
                String replace = s.replace("_bitsession_=", "").replace(";", "");
                if (isNotBlank(replace) && !"-deleted-".equals(replace)) {
                    cookie2Update.put("_bitsession_", replace);
//                    saveBitsession(replace);
                } else {
                    cookie2Update.remove("_bitsession_");
                }
            }else if (s.contains("gt_server_status")) {
                String replace = s.replace("gt_server_status=", "").replace(";", "");
                if (isNotBlank(replace)) {
                    cookie2Update.put("gt_server_status", replace);
                } else {
                    cookie2Update.remove("gt_server_status");
                }
            } else if (s.contains("userId")) {
                String replace = s.replace("userId=", "").replace(";", "");
                if (isNotBlank(replace)) {
                    cookie2Update.put("userId", replace);
                } else {
                    cookie2Update.remove("userId");
                }
            }else if (s.contains("userCode")) {
                String replace = s.replace("userCode=", "").replace(";", "");
                if (isNotBlank(replace)) {
                    cookie2Update.put("userCode", replace);
                } else {
                    cookie2Update.remove("userCode");
                }
            } else if (s.contains("withdrawCode")) {
                String replace = s.replace("withdrawCode=", "").replace(";", "");
                if (isNotBlank(replace)) {
                    cookie2Update.put("withdrawCode", replace);
                } else {
                    cookie2Update.remove("withdrawCode");
                }
            } else {
                String[] split = s.split("=");

                if (split.length == 2 && isNotBlank(split[1])) {
                    cookie2Update.put(split[0], split[1]);
                } else {
                    cookie2Update.remove(split[0]);
                }
            }

        }
        Gson gson = new Gson();
        String cookieString = gson.toJson(cookie2Update);
        SavePreferences.setData(MainApplication.appContext, COOKIE, cookieString);

    }

    public static String getCookie() {
        Map<String, String> cookie2Update = getCookie2Update();
        if (null != cookie2Update) {
            StringBuilder stringBuilder = new StringBuilder();
            Set<String> strings = cookie2Update.keySet();
            for (String string : strings) {
                stringBuilder.append(string).append("=").append(cookie2Update.get(string)).append(";");
            }
            return stringBuilder.toString();
        }
        return "";
    }

    public static Map<String, String> getCookie2Update() {
        String string = SavePreferences.getString(MainApplication.appContext, COOKIE);
        if (isNotBlank(string)) {
            try {
                Gson gson = new Gson();
                return gson.fromJson(string, new TypeToken<Map<String, String>>() {
                }.getType());
            } catch (Exception e) {
                removeCookie();
            }
        }
        return null;
    }

    public static void removeCookie() {
        SavePreferences.removeSharedPreference(MainApplication.appContext, COOKIE);
    }

    public static void userLogout() {
        SavePreferences.removeSharedPreference(MainApplication.appContext, USER_INFO);
//        AgentWebConfig.removeAllCookies();
        removeCookie();
//        removeUserFeeBDB();
    }

}

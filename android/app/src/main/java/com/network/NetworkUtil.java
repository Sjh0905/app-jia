package com.network;

import android.content.Context;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.twentytwenty.exchange.MainApplication;

import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.util.Enumeration;
import java.util.List;


/**
 * Description:网络相关
 *
 * @author: guoyongping
 * @date: 2016/5/10 20:26
 */
public class NetworkUtil {

    /**
     * wifi环境
     */
    public static final int TYPE_WIFI = 1;
    /**
     * 移动网络环境
     */
    public static final int TYPE_MOBILE = 2;
    /**
     * 未知网络
     */
    public static final int TYPE_NOT_CONNECTED = 0;

    /**
     * 网络类型：无网络.
     */
    public static final int NETWORK_CLASS_NOT = -1;
    /**
     * 网络类型：未知.
     */
    public static final int NETWORK_CLASS_UNKNOWN = 0;
    /**
     * 网络类型：WIFI.
     */
    public static final int NETWORK_CLASS_WIFI = 1;
    /**
     * 网络类型：2G.
     */
    public static final int NETWORK_CLASS_2_G = 2;
    /**
     * 网络类型：3G.
     */
    public static final int NETWORK_CLASS_3_G = 3;
    /**
     * 网络类型：4G.
     */
    public static final int NETWORK_CLASS_4_G = 4;

    private static final String TAG = "NetUtil";

    /**
     * 1、判断网络是否链接
     *
     * @return
     */
    public static boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) MainApplication.appContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            // 如果仅仅是用来判断网络连接，则可以使用cm.getActiveNetworkInfo().isAvailable();
            NetworkInfo networkInfo = cm.getActiveNetworkInfo();
            if (networkInfo == null) {
                return false;
            } else {
                return networkInfo.isAvailable();
            }
        }
        return false;
    }

    /**
     * 判断手机连接的网络类型(wifi,2G,3G,4G)
     * 联通的3G为UMTS或HSDPA，移动和联通的2G为GPRS或EGDE，电信的2G为CDMA，电信的3G为EVDO
     *
     * @return id
     */
    public static int getNetWorkType() {
        int netWorkType = NETWORK_CLASS_NOT;
        if (!isNetworkAvailable()) {
            return NETWORK_CLASS_NOT;
        }
        ConnectivityManager connectivityManager = (ConnectivityManager) MainApplication.appContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isConnected()) {
            int type = networkInfo.getType();
            if (type == ConnectivityManager.TYPE_WIFI) {
                netWorkType = NETWORK_CLASS_WIFI;
            } else if (type == ConnectivityManager.TYPE_MOBILE) {
                TelephonyManager telephonyManager = (TelephonyManager) MainApplication.appContext.getSystemService(Context.TELEPHONY_SERVICE);
                switch (telephonyManager.getNetworkType()) {
                    case TelephonyManager.NETWORK_TYPE_GPRS:
                    case TelephonyManager.NETWORK_TYPE_EDGE:
                    case TelephonyManager.NETWORK_TYPE_CDMA:
                    case TelephonyManager.NETWORK_TYPE_1xRTT:
                    case TelephonyManager.NETWORK_TYPE_IDEN:
                        return NETWORK_CLASS_2_G;
                    case TelephonyManager.NETWORK_TYPE_UMTS:
                    case TelephonyManager.NETWORK_TYPE_EVDO_0:
                    case TelephonyManager.NETWORK_TYPE_EVDO_A:
                    case TelephonyManager.NETWORK_TYPE_HSDPA:
                    case TelephonyManager.NETWORK_TYPE_HSUPA:
                    case TelephonyManager.NETWORK_TYPE_HSPA:
                    case TelephonyManager.NETWORK_TYPE_EVDO_B:
                    case TelephonyManager.NETWORK_TYPE_EHRPD:
                    case TelephonyManager.NETWORK_TYPE_HSPAP:
                        return NETWORK_CLASS_3_G;

                    case TelephonyManager.NETWORK_TYPE_LTE:
                        return NETWORK_CLASS_4_G;
                    default:
                        return NETWORK_CLASS_UNKNOWN;
                }
            }
        }
        return netWorkType;
    }

    /**
     * 5、判断WIFI是否打开
     *
     * @param context
     * @return
     */
    public static boolean isWifiEnabled(Context context) {
        ConnectivityManager mgrConn = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        TelephonyManager mgrTel = (TelephonyManager) context
                .getSystemService(Context.TELEPHONY_SERVICE);
        return ((mgrConn.getActiveNetworkInfo() != null && mgrConn
                .getActiveNetworkInfo().getState() == NetworkInfo.State.CONNECTED) || mgrTel
                .getNetworkType() == TelephonyManager.NETWORK_TYPE_UMTS);
    }

    /**
     * 6、判断GPS是否打开
     *
     * @param context
     * @return
     */
    public static boolean isGpsEnabled(Context context) {
        LocationManager lm = ((LocationManager) context
                .getSystemService(Context.LOCATION_SERVICE));
        List<String> accessibleProviders = lm.getProviders(true);
        return accessibleProviders != null && accessibleProviders.size() > 0;
    }

    /**
     * 7、判断是wifi还是3g网络,用户的体现性在这里了，wifi就可以建议下载或者在线播放。
     *
     * @param context
     * @return
     */
    public static boolean isWifi(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkINfo = cm.getActiveNetworkInfo();
        return networkINfo != null
                && networkINfo.getType() == ConnectivityManager.TYPE_WIFI;
    }

    /**
     * 4、获取手机ip
     *
     * @param context
     * @return
     */
    public static String getIp(Context context) {
        String ipStr = "";
        if (isWifiEnabled(context)
                || isGpsEnabled(context)) {
            if (isNetworkAvailable()) {
                if (isWifi(context)) {
                    ipStr = getIpForWifi(context);
                } else {
                    ipStr = getLocalIpAddress();
                }
            }
        }
        return ipStr;
    }


    /**
     * 8、wifi状态下获取手机ip ,需要以下权限 <uses-permission
     * android:name="android.permission.ACCESS_WIFI_STATE"></uses-permission>
     * <uses-permission
     * android:name="android.permission.CHANGE_WIFI_STATE"></uses-permission>
     * <uses-permission
     * android:name="android.permission.WAKE_LOCK"></uses-permission>
     *
     * @param context
     * @return
     */
    private static String getIpForWifi(Context context) {
        // 获取wifi服务
        WifiManager wifiManager = (WifiManager) MainApplication.appContext.getApplicationContext()
                .getSystemService(Context.WIFI_SERVICE);
        // 判断wifi是否开启
        if (!wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(true);
        }
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int ipAddress = wifiInfo.getIpAddress();
        String ip = intToIp(ipAddress);
        return ip;
    }

    private static String intToIp(int i) {
        return (i & 0xFF) + "." + ((i >> 8) & 0xFF) + "." + ((i >> 16) & 0xFF)
                + "." + (i >> 24 & 0xFF);
    }

    /**
     * 9、3g网络下获取手机ip
     *
     * @return
     */
    public static String getLocalIpAddress() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf
                        .getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress().toString();
                    }
                }
            }
        } catch (SocketException ex) {
            Log.e("IpAddress", ex.toString());
        }
        return null;
    }


    /**
     * 判断网络连接是否正常
     *
     * @param urlPath 网络地址
     * @return boolean
     */
    public static boolean isConnect(final String urlPath) {
        final boolean[] isConnect = new boolean[1];
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlPath);
                    // 返回一个 URLConnection 对象，它表示到 URL 所引用的远程对象的连接。
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    int state = connection.getResponseCode();
                    isConnect[0] = state == 200;

                } catch (Exception e) {
                    isConnect[0] = false;
                }
            }
        });


        return isConnect[0];
    }

    /**
     * 获取网络环境(WiFi或移动网络)
     *
     * @param context 上下文
     * @return 网络类型对应的id
     */
    public static int getConnectivityStatus(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        if (null != activeNetwork) {
            if (activeNetwork.getType() == ConnectivityManager.TYPE_WIFI) {
                return TYPE_WIFI;
            }

            if (activeNetwork.getType() == ConnectivityManager.TYPE_MOBILE) {
                return TYPE_MOBILE;
            }
        }
        return TYPE_NOT_CONNECTED;
    }

    /**
     * 获取网络环境(WiFi或移动网络)
     *
     * @param context 上下文
     * @return 网络类型
     */
    public static String getConnectivityStatusString(Context context) {
        int conn = NetworkUtil.getConnectivityStatus(context);
        String status = null;
        if (conn == NetworkUtil.TYPE_WIFI) {
            status = "Wifi enabled";
        } else if (conn == NetworkUtil.TYPE_MOBILE) {
            status = "Mobile data enabled";
        } else if (conn == NetworkUtil.TYPE_NOT_CONNECTED) {
            status = "Not connected to Internet";
        }
        return status;
    }


}

package com.twentytwenty.exchange;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.game.UMGameAgent;
import com.umeng.commonsdk.UMConfigure;

/**
 * Created by wangfei on 17/8/28.
 */
public class AnalyticsModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    private boolean isGameInited = false;

    public AnalyticsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "UMAnalyticsModule";
    }

    @ReactMethod
    private void initGame() {
//        UMGameAgent.init(context);
//        UMGameAgent.setPlayerLevel(1);
//        MobclickAgent.setScenarioType(context, MobclickAgent.EScenarioType.E_UM_GAME);

        /**
         * 设置组件化的Log开关
         * 参数: boolean 默认为false，如需查看LOG设置为true
         */
        UMConfigure.setLogEnabled(true);
        // 必须在调用任何统计SDK接口之前调用初始化函数
//        参数1:上下文，不能为空
//        参数2:友盟 app key
//        参数3:友盟 channel
//        参数4:设备类型，UMConfigure.DEVICE_TYPE_PHONE为手机、UMConfigure.DEVICE_TYPE_BOX为盒子，默认为手机
//        参数5:Push推送业务的secret
        UMConfigure.init(context, "5e8c42c80cafb2ad5e0003ec", "H5", UMConfigure.DEVICE_TYPE_PHONE,"");//,
//        UMConfigure.init(this, 0, null);
        UMConfigure.setEncryptEnabled(true);
//        MobclickAgent.enableEncrypt(true);
        MobclickAgent.setScenarioType(context, MobclickAgent.EScenarioType.E_DUM_NORMAL);

        isGameInited = true;
    }

    @ReactMethod
    public void onRNStart(String mPageName) {
        MobclickAgent.onPageStart(mPageName);
    }


}

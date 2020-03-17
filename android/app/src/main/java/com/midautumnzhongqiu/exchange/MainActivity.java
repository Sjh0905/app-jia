package com.midautumnzhongqiu.exchange;

import android.os.Bundle;
import android.webkit.CookieSyncManager;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import com.umeng.message.PushAgent;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity{

    public static int taskId;
    /***
     * 控制启动白屏的方法
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
        taskId = this.getTaskId();
        CookieSyncManager.createInstance(this);
//        设置统计的场景，以及发送间隔
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);

        /*PushModule.initPushSDK(this);
        PushAgent.getInstance(this).onAppStart();*/

    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "btcdoApp";
    }

    @Override
    public void onResume() {
        super.onResume();
        android.util.Log.e("xxxxxx","onResume=");
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

}

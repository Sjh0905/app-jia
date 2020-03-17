package com.midautumnzhongqiu.exchange;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.os.Bundle;
import android.support.multidex.MultiDexApplication;
import android.util.Log;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.facebook.react.ReactApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;
import com.umeng.message.UmengNotificationClickHandler;
import com.umeng.message.entity.UMessage;

import org.android.agoo.huawei.HuaWeiRegister;
import org.android.agoo.mezu.MeizuRegister;
import org.android.agoo.xiaomi.MiPushRegistar;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    public static Context appContext;
    //定义上下文对象
    public static ReactContext myContext;

    public static String UMessage;
    public static int pushModuleExit;

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private DplusReactPackage reactPackage;
    private static int i = 0;
    public static boolean PushFlag = false;
    /* 可见的activity组件数量 */
    private static int visibleActivity = 0;


    //判断应用是否在前台
    public static boolean isForeground(){
        return visibleActivity > 0;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CookieManagerPackage(),
            new RNCameraPackage(),
            new PickerPackage(),
//            new PickerPackage(),
            new RNFSPackage(),
            new ExtraDimensionsPackage(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new CodePush("W3B4QJ8fPQpPqDWzDPdDqRgnSeJ54ksvOXqog", getApplicationContext(), BuildConfig.DEBUG, "http://192.168.3.104:3000"),
            new RNI18nPackage(),
            new DplusReactPackage(),
            new WebViewReactPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

//        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(this);
//        mPreferences.edit().putString("debug_http_host", "localhost:18081").apply();

        SoLoader.init(this, /* native exopackage */ false);
        appContext = getApplicationContext();
        registerActivityLifecycleCallbacks(callbacks);
//        myContext = ReactApplicationContext.CONTEXT_IGNORE_SECURITY;

//        mReactRootView = new ReactRootView(this);
//        reactPackage = new DplusReactPackage();
//        mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(this)
//                .setBundleAssetName("index.android.bundle")
////                .setJSMainModuleName("index")
//                .setJSMainModulePath("index")
//                .addPackage(new MainReactPackage())
//                .addPackage(reactPackage)   //添加  本地 moudel
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//
//        mReactRootView.startReactApplication(mReactInstanceManager, "btcdoApp", null);

        /**
         * 设置组件化的Log开关
         * 参数: boolean 默认为false，如需查看LOG设置为true
         */
        UMConfigure.setLogEnabled(true);
        // 必须在调用任何统计SDK接口之前调用初始化函数
        RNUMConfigure.init(this, "5dae806c3fc195f378000ba8", "H5", UMConfigure.DEVICE_TYPE_PHONE,"");//,
        UMConfigure.setEncryptEnabled(true);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);

        PushAgent mPushAgent = PushAgent.getInstance(this);
        //注册推送服务，每次调用register方法都会回调该接口
        /*mPushAgent.register(new IUmengRegisterCallback() {
            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回device token
                Log.d("meizu", "deviceToken "+deviceToken);
                Log.d("meizu", mPushAgent.getRegistrationId()+"=getRegistrationId onSuccess ");
            }

            @Override
            public void onFailure(String s, String s1) {
                Log.d("meizu", "s="+s+" s1="+s);
            }
        });*/

        Log.d("meizu", mPushAgent.getRegistrationId()+"=getRegistrationId"+" thread:"+Thread.currentThread().toString()+" "+Thread.currentThread().getName());

        /**
         * 自定义行为的回调处理，参考文档：高级功能-通知的展示及提醒-自定义通知打开动作
         * UmengNotificationClickHandler是在BroadcastReceiver中被调用，故
         * 如果需启动Activity，需添加Intent.FLAG_ACTIVITY_NEW_TASK
         * */
        UmengNotificationClickHandler notificationClickHandler = new UmengNotificationClickHandler() {

            @Override
            public void launchApp(Context context, UMessage msg) {
                super.launchApp(context, msg);
                Log.d("meizu", "launchApp: "+msg.extra.toString());
//                UMessage = msg.extra.toString();


//                reactContext
//                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit(eventName,params);
//                new Thread(new Runnable() {
//                    @Override
//                    public void run() {
//                        try {
//                            Thread.sleep(10000);
//                        } catch (InterruptedException e) {
//                            e.printStackTrace();
//                        }
                        Log.d("meizu", "it is to send");
                PushFlag = true;
                //发送事件,事件名为eventPush
                WritableMap wp = Arguments.createMap();
                if(isForeground()){
                    Log.d("shengmingzhouqi", "当前处于前台");
                    wp.putString("foreground","TRUE");
                }else{
                    Log.d("shengmingzhouqi", "当前处于后台");
                    wp.putString("foreground","FALSE");
                }
                wp.putString("title",msg.title.toString());
                wp.putString("ticker",msg.ticker.toString());
                wp.putString("toPage","");
                if(msg.extra != null && msg.extra.get("url") != null){
                    wp.putString("toPage",msg.extra.get("url").toString());
                }
                PushModule.sendEvent(PushModule.myContext,"eventPush",wp);
//                    }
//                }).start();

            }

            @Override
            public void openUrl(Context context, UMessage msg) {
                super.openUrl(context, msg);
                Log.d("meizu", msg.extra+" openUrl: "+msg.url.toString());
//                UMessage = msg.url.toString();

//                new Thread(new Runnable() {
//                    @Override
//                    public void run() {
//                        try {
//                            Thread.sleep(10000);
//                        } catch (InterruptedException e) {
//                            e.printStackTrace();
//                        }
                        Log.d("meizu", "it is to send");
                        //发送事件,事件名为eventPush
                        WritableMap wp= Arguments.createMap();
                        wp.putString("toPage",msg.url.toString());
//                        PushModule.sendEvent(PushModule.myContext,"eventPush",wp);
//                    }
//                }).start();

            }

            @Override
            public void openActivity(Context context, UMessage msg) {
                super.openActivity(context, msg);
                Log.d("meizu", "openActivity: "+msg.toString());
//                UMessage = msg.toString();

            }

            @Override
            public void dealWithCustomAction(Context context, UMessage msg) {

                if(isForeground()){
                    Log.d("shengmingzhouqi", "当前处于前台");
                }else{
                    Log.d("shengmingzhouqi", "当前处于后台");

                    ActivityManager am = (ActivityManager) myContext.getSystemService(Context.ACTIVITY_SERVICE) ;
                    am.moveTaskToFront(MainActivity.taskId, ActivityManager.MOVE_TASK_WITH_HOME);

//                    Intent intent = new Intent(myContext, MainActivity.class);
//                    intent.addCategory(Intent.CATEGORY_LAUNCHER);
//                    intent.setAction(Intent.ACTION_MAIN);
//                    intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                }

                Log.d("meizu", msg.custom+" dealWithCustomAction: "+msg.toString()+" thread:"+Thread.currentThread().toString()+" "+Thread.currentThread().getName());
//                WritableMap parmas = Arguments.createMap();
//                parmas.putString("UMessage", msg.custom);
//        parmas.putString("id", "1992");
//                sendEvent(mContext, "eventPush", parmas);

//                new Thread(new Runnable() {
//                    @Override
//                    public void run() {
//                        try {
//                            Thread.sleep(10000);
//                        } catch (InterruptedException e) {
//                            e.printStackTrace();
//                        }
                        Log.d("meizu", "it is to send"+" thread:"+Thread.currentThread().toString()+" "+Thread.currentThread().getName());
                        //发送事件,事件名为eventPush
                        WritableMap wp = Arguments.createMap();
                        String custom = msg.custom.toString();
                        wp.putString("title",msg.title.toString());
                        wp.putString("ticker",msg.ticker.toString());
                        wp.putString("toPage",custom);
                        if(!"".equals(msg.custom.toString()) && !msg.custom.toString().contains("http") && msg.extra != null && msg.extra.get(custom) != null){
                            wp.putString("toPage",msg.extra.get(custom).toString());
                        }
//                        PushModule.sendEvent(PushModule.myContext,"eventPush",wp);
//                    }
//                }).start();
            }
        };
        //使用自定义的NotificationHandler
        mPushAgent.setNotificationClickHandler(notificationClickHandler);

//     设置通知栏最多显示两条通知（当通知栏已经有两条通知，此时若第三条通知到达，则会把第一条通知隐藏）
//     当参数为0时，表示不合并通知。
        mPushAgent.setDisplayNotificationNumber(0);

//        HuaWeiRegister.register(this);
//        MiPushRegistar.register(this, "2882303761517856608", "5551785657608");
//        MeizuRegister.register(this, "115423", "b18b8cb874d5451f88b0fefebd5ca281");

    }

    /*应用生命周期监听*/
    private ActivityLifecycleCallbacks callbacks = new ActivityLifecycleCallbacks() {

        @Override
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
            Log.d("shengmingzhouqi", "onActivityCreated");
        }

        @Override
        public void onActivityStarted(Activity activity) {
            Log.d("shengmingzhouqi", "onActivityStarted");
            visibleActivity += 1;
        }

        @Override
        public void onActivityResumed(Activity activity) {
            if(PushFlag){
                PushModule.sendEvent(PushModule.myContext,"onActivityResumed",null);
            }
//            pushModule = new PushModule(PushModule.myContext);

            if(pushModuleExit > 0)
            {
//              PushModule.sendEvent(PushModule.myContext,"onResumedClearInterval",null);
                try {

                    PushModule.sendEvent(PushModule.myContext,"onResumedClearInterval",null);

                }catch (Exception ex){
                    Log.d("shengmingzhouqi", "onActivityPausedError");
                }

            }

            pushModuleExit++;



            Log.d("shengmingzhouqi", "onActivityResumed");
        }

        @Override
        public void onActivityPaused(Activity activity) {
            Log.d("shengmingzhouqi", "onActivityPaused");
            PushModule.sendEvent(PushModule.myContext,"onActivityPaused",null);
        }

        @Override
        public void onActivityStopped(Activity activity) {
            Log.d("shengmingzhouqi", "onActivityStopped");
            visibleActivity -= 1;
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
            Log.d("shengmingzhouqi", "onActivitySaveInstanceState");
        }

        @Override
        public void onActivityDestroyed(Activity activity) {
            Log.d("shengmingzhouqi", "onActivityDestroyed");

        }
    };

}

package com.http;

import android.content.Context;
import android.content.DialogInterface;

import com.google.gson.JsonSyntaxException;
import com.network.NetStatusUtil;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import retrofit2.HttpException;
import rx.Subscriber;

/**
 * Created by fanqilong on 2017/4/21.
 * 扩展订阅
 */
public abstract class ApiSubscriber<T> extends Subscriber<T> implements DialogInterface.OnCancelListener {

    private Context mContext;
    private HttpLoadingDialog waitingDialog;  //加载dialog
    private boolean isShowWaitDialog;

    public void setShowWaitDialog(boolean showWaitDialog) {
        isShowWaitDialog = showWaitDialog;
    }


    @Override
    public void onStart() {
        super.onStart();
        if (isShowWaitDialog) {
//            showWaitDialog();
        }
    }

    public void setContext(Context context) {
        this.mContext = context;
    }

    @Override
    public void onCompleted() {
        if (isShowWaitDialog) {
            dismissDialog();
        }
    }

    /**
     * 对 onError进行处理
     *
     * @param e
     */
    @Override
    public void onError(Throwable e) {
        if (isShowWaitDialog) {
            dismissDialog();
        }
        //在异常之前，首先判断网络状态，如果有网络连接，那么再进行异常判断
        if (!isConnected(mContext)) {
//            ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_no_net));
        } else if (e instanceof SocketTimeoutException) {
//            ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_chaoshi));
        } else if (e instanceof ConnectException) {
//            ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_lianjie_yichang));
        } else if (e instanceof UnknownHostException) {
//            if (BuildConfig.DEBUG)
//                ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_no_weizhizhuji));
        } else if (e instanceof HttpException) {
            if (((HttpException) e).response().code() == 401) {

                //ToastUtil.showShort(mContext, "授权过期，请重新登录");
            } else if (((HttpException) e).response().code() == 404) {
//                ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_wixiao_way));
            } else if (((HttpException) e).response().code() == 500) {

                UserControl.userLogout();
//                ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_500));

            } else if (((HttpException) e).response().code() == 400) {
                // 秦楚用户信息
                UserControl.userLogout();
            } else {
//                ToastUtil.showShort(mContext, mContext.getString(R.string.http_tip_ex));
            }
        } else if (e instanceof JsonSyntaxException) {
//            if (BuildConfig.DEBUG) {
//                ToastUtil.showShort(mContext, "解析异常");
//            }
        } else {
//            if (BuildConfig.DEBUG) {
//                Toast.makeText(mContext, "" + e.getMessage(), Toast.LENGTH_SHORT).show();
//            }

        }

    }


    /**
     * 判断网络是否连接
     */
    private static boolean isConnected(Context context) {

        return NetStatusUtil.isConnected(context);
    }

    private void dismissDialog() {
        if (waitingDialog != null) {
            if (waitingDialog.isShowing()) {
                waitingDialog.dismiss();
            }
        }
    }

    private void showWaitDialog() {
        if (waitingDialog == null) {
            waitingDialog = new HttpLoadingDialog(mContext);
            waitingDialog.setOnCancelListener(this);
            waitingDialog.setCanceledOnTouchOutside(false);
        }
        waitingDialog.show();
    }


    @Override
    public void onCancel(DialogInterface dialog) {
        if (!this.isUnsubscribed()) {
            this.unsubscribe();
        }
    }


}

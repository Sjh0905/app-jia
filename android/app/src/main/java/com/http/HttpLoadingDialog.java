package com.http;

import android.app.Dialog;
import android.content.Context;
import android.widget.ImageView;

import com.midautumnzhongqiu.exchange.R;

public class HttpLoadingDialog extends Dialog {
    private ImageView imageView;

    public HttpLoadingDialog(Context context) {
        super(context, R.style.AppTheme);
//        View view = initView(context);
        setCancelable(true);
//        setContentView(view, new LinearLayout.LayoutParams(
//                LinearLayout.LayoutParams.MATCH_PARENT,
//                LinearLayout.LayoutParams.MATCH_PARENT));
    }

//    private View initView(Context context) {
//        int layoutId = R.layout.comm_http_loading_dialog;
//        View layout = LayoutInflater.from(context).inflate(layoutId, null);
//        imageView = ((ImageView) layout.findViewById(R.id.animation_img));
//        Glide.with(context)
//                .load(R.drawable.loading).asGif().diskCacheStrategy(DiskCacheStrategy.SOURCE)
//                .centerCrop()
//                .into(imageView);
//        return layout;
//    }

}

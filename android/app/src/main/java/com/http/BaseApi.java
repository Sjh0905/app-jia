package com.http;

import rx.Observable;
import rx.Scheduler;
import rx.android.schedulers.AndroidSchedulers;
import rx.schedulers.Schedulers;

/**
 * Created by fanqilong on 2017/4/21.
 */
public abstract class BaseApi {

    public static class ObservableBuilder {

        private Observable observable;
        private boolean apiException;
        private boolean toJSONJbject;
        private boolean isWeb;
        private Scheduler subscribeScheduler;
        private Scheduler observeScheduler;

        public ObservableBuilder setObserveScheduler(Scheduler observeScheduler) {
            this.observeScheduler = observeScheduler;
            return this;
        }

        public ObservableBuilder setSubscribeScheduler(Scheduler subscribeScheduler) {
            this.subscribeScheduler = subscribeScheduler;
            return this;
        }

        public ObservableBuilder(Observable observable) {
            this.observable = observable;
        }

        public ObservableBuilder addApiException() {
            apiException = true;
            return this;
        }

        public ObservableBuilder addToJSONObject() {
            toJSONJbject = true;
            return this;
        }

        public ObservableBuilder isWeb() {
            isWeb = true;
            return this;
        }

        public Observable build() {

            if (subscribeScheduler != null) {
                observable = observable.subscribeOn(subscribeScheduler);
            } else {
                observable = observable.subscribeOn(Schedulers.io());
                observable = observable.unsubscribeOn(Schedulers.io());
            }

            if (observeScheduler != null) {
                observable = observable.observeOn(observeScheduler);
            } else {
                observable = observable.observeOn(AndroidSchedulers.mainThread());
            }
            return observable;

        }
    }
}

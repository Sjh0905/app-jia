/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
//#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "RNSplashScreen.h"
#import "../RNUMConfigure.h"
#import <UMAnalytics/MobClick.h>
#import "UMPushModule.h"
//#import <UMPush/UMessage.h>

//@interface AppDelegate ()
//<UNUserNotificationCenterDelegate>
//@end

//@interface RCTSurface ()
//<RCTSurfaceRootShadowViewDelegate>
//@end


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  

  //友盟初始化以及统计
  [MobClick setScenarioType:E_UM_NORMAL];
  [RNUMConfigure initWithAppkey:@"5dae8048570df37d69000346" channel:@"H5"];

////友盟推送
//  UMessageRegisterEntity * entity = [[UMessageRegisterEntity alloc] init];
////  type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标
//  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionAlert|UMessageAuthorizationOptionSound;
//  [UNUserNotificationCenter currentNotificationCenter].delegate=self;
//
//  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity completionHandler:^(BOOL granted, NSError * _Nullable error) {
//    if (granted) {
//    } else {
//    }
//  }];
  


  NSURL *jsCodeLocation;


    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"btcdoApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNSplashScreen show];
  //[NSThread sleepForTimeInterval:3.0]; //启动页3s停顿
  return YES;
}
- (void)applicationDidBecomeActive:(UIApplication * )application
{
  NSLog(@"进入前台---applicationDidBecomeActive----");
  //通过桥接文件向RN发送通知
  [UMPushModule sendAppBecomeActive];
}
- (void)applicationDidEnterBackground:(UIApplication * )application
{
  NSLog(@"进入后台---applicationDidEnterBackground----");
  //通过桥接文件向RN发送通知
  [UMPushModule sendAppEnterBackground];
}
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//{
//
//  //关闭友盟自带的弹出框
//  [UMessage setAutoAlert:NO];
//  [UMessage didReceiveRemoteNotification:userInfo];
//
//  //    self.userInfo = userInfo;
//  //    //定制自定的的弹出框
//  //    if([UIApplication sharedApplication].applicationState == UIApplicationStateActive)
//  //    {
//  //        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"标题"
//  //                                                            message:@"Test On ApplicationStateActive"
//  //                                                           delegate:self
//  //                                                  cancelButtonTitle:@"确定"
//  //                                                  otherButtonTitles:nil];
//  //
//  //        [alertView show];
//  //
//  //    }
//}

////iOS10新增：处理前台收到通知的代理方法
//-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
//  NSDictionary * userInfo = notification.request.content.userInfo;
//  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//
//    //应用处于前台时的远程推送接受
//    //关闭友盟自带的弹出框
//    [UMessage setAutoAlert:NO];
//    //必须加这句代码
//    [UMessage didReceiveRemoteNotification:userInfo];
//
////    NSLog(@"%@",userInfo[@"aps"][@"bd"]);
////    NSDictionary *props = @{@"userInfo" : userInfo};
//
//
//  }else{
//    //应用处于前台时的本地推送接受
//  }
//  completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
//}
//
////iOS10新增：处理后台点击通知的代理方法
//-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
//  NSDictionary * userInfo = response.notification.request.content.userInfo;
//
//  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//
//    //应用处于后台时的远程推送接受
//    //必须加这句代码
//    [UMessage didReceiveRemoteNotification:userInfo];
//
//    NSLog(@"---发送通知---000");
//
//    // 1.添加字典, 将数据包到字典中
//
////    NSDictionary *dict =[[NSDictionary alloc] initWithObjectsAndKeys:@"小明",@"name",@"111401",@"number", nil];
//
//    // 2.创建通知
//
//    NSNotification *notification =[NSNotification notificationWithName:@"InfoNotification" object:nil userInfo:userInfo];
//
//    // 3.通过 通知中心 发送 通知
//
//    [[NSNotificationCenter defaultCenter] postNotification:notification];
//
//
//
//  }else{
//    //应用处于后台时的本地推送接受
//  }
//}


@end

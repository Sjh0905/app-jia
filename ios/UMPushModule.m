//
//  PushModule.m
//  UMComponent
//
//  Created by wyq.Cloudayc on 11/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "UMPushModule.h"
#import <UMPush/UMessage.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>



static NSString * const EnterBackground = @"EnterBackground";
static NSString * const BecomeActive = @"BecomeActive";
static UMPushModule * _instance = nil;
@interface UMPushModule ()
@property (nonatomic, copy) NSString *deviceToken;
@end
@implementation UMPushModule
{
  RCTPromiseResolveBlock _resolveBlock;
  RCTPromiseRejectBlock _rejectBlock;
}
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();
+ (instancetype)sharedInstance {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if(_instance == nil) {
      _instance = [[self alloc] init];
    }
  });
  return _instance;
}
+ (instancetype)allocWithZone:(struct _NSZone *)zone {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if(_instance == nil) {
      _instance = [super allocWithZone:zone];
    }
  });
  return _instance;
}
//  /**未知错误*/
//  kUMessageErrorUnknown = 0,
//  /**响应出错*/
//  kUMessageErrorResponseErr = 1,
//  /**操作失败*/
//  kUMessageErrorOperateErr = 2,
//  /**参数非法*/
//  kUMessageErrorParamErr = 3,
//  /**条件不足(如:还未获取device_token，添加tag是不成功的)*/
//  kUMessageErrorDependsErr = 4,
//  /**服务器限定操作*/
//  kUMessageErrorServerSetErr = 5,
- (NSString *)checkErrorMessage:(NSInteger)code
{
  switch (code) {
    case 1:
      return @"响应出错";
      break;
    case 2:
      return @"操作失败";
      break;
    case 3:
      return @"参数非法";
      break;
    case 4:
      return @"条件不足(如:还未获取device_token，添加tag是不成功的)";
      break;
    case 5:
      return @"服务器限定操作";
      break;
    default:
      break;
  }
  return nil;
}

- (void)handleResponse:(id  _Nonnull)responseObject remain:(NSInteger)remain error:(NSError * _Nonnull)error completion:(RCTResponseSenderBlock)completion
{
  if (completion) {
    if (error) {
      NSString *msg = [self checkErrorMessage:error.code];
      if (msg.length == 0) {
        msg = error.localizedDescription;
      }
      completion(@[@(error.code), @(remain)]);
    } else {
      if ([responseObject isKindOfClass:[NSDictionary class]]) {
        NSDictionary *retDict = responseObject;
        if ([retDict[@"success"] isEqualToString:@"ok"]) {
          completion(@[@200, @(remain)]);
        } else {
          completion(@[@(-1), @(remain)]);
        }
      } else {
        completion(@[@(-1), @(remain)]);
      }
      
    }
  }
}

- (void)handleGetTagResponse:(NSSet * _Nonnull)responseTags remain:(NSInteger)remain error:(NSError * _Nonnull)error completion:(RCTResponseSenderBlock)completion
{
  if (completion) {
    if (error) {
      NSString *msg = [self checkErrorMessage:error.code];
      if (msg.length == 0) {
        msg = error.localizedDescription;
      }
      completion(@[@(error.code), @(remain), @[]]);
    } else {
      if ([responseTags isKindOfClass:[NSSet class]]) {
        NSArray *retList = responseTags.allObjects;
        completion(@[@200, @(remain), retList]);
      } else {
        completion(@[@(-1), @(remain), @[]]);
      }
    }
  }
}
- (void)handleAliasResponse:(id  _Nonnull)responseObject error:(NSError * _Nonnull)error completion:(RCTResponseSenderBlock)completion
{
  if (completion) {
    if (error) {
      NSString *msg = [self checkErrorMessage:error.code];
      if (msg.length == 0) {
        msg = error.localizedDescription;
      }
      completion(@[@(error.code)]);
    } else {
      if ([responseObject isKindOfClass:[NSDictionary class]]) {
        NSDictionary *retDict = responseObject;
        if ([retDict[@"success"] isEqualToString:@"ok"]) {
          completion(@[@200]);
        } else {
          completion(@[@(-1)]);
        }
      } else {
        completion(@[@(-1)]);
      }
      
    }
  }
}
//暴露给JS事件名称
- (NSDictionary<NSString *, id> *)constantsToExport {
  return @{
           BecomeActive:BecomeActive,
           EnterBackground: EnterBackground
           };
}
//告诉RN切换到前台
 - (void)sendAppBecomeActive {

      [_bridge.eventDispatcher sendAppEventWithName:BecomeActive body:nil];

      NSLog(@"进入前台---sendAppBecomeActive----");
 }
 + (void)sendAppBecomeActive{
   //send event
   [[UMPushModule sharedInstance] sendAppBecomeActive];
 }
 //告诉RN切换到后台
 - (void)sendAppEnterBackground {

      [_bridge.eventDispatcher sendAppEventWithName:EnterBackground body:nil];
      NSLog(@"进入后台---sendAppEnterBackground----");

   //  NSLog(@"UMPushModule修改后的值是");
   //  NSLog(@"%@",@[@"EnterBackground",userInfo]);
 }
 + (void)sendAppEnterBackground{
   //send event
   [[UMPushModule sharedInstance] sendAppEnterBackground];
 }
//注册DeviceToken并向RN发送通知供测试复制
//- (void)didRegisterDeviceToken:(NSData *)deviceToken {
//
//  [UMPushModule sharedInstance].deviceToken = [[[[deviceToken description] stringByReplacingOccurrencesOfString: @"<" withString: @""]
//                                                stringByReplacingOccurrencesOfString: @">" withString: @""]
//                                               stringByReplacingOccurrencesOfString: @" " withString: @""];
//
//  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//    [_bridge.eventDispatcher sendAppEventWithName:RegisterDeviceToken body:self.deviceToken];
//  });
//  NSLog(@"UMPushModule转化后的数据");
//  NSLog(@"%@",self.deviceToken);
//
//  //  [UMessage registerDeviceToken:deviceToken];
//
//}
//+ (void)didRegisterDeviceToken:(NSData *)deviceToken {
//  [[UMPushModule sharedInstance] didRegisterDeviceToken:deviceToken];
//}


RCT_EXPORT_METHOD(addTag:(NSString *)tag response:(RCTResponseSenderBlock)completion)
{
  [UMessage addTags:tag response:^(id  _Nonnull responseObject, NSInteger remain, NSError * _Nonnull error) {
    [self handleResponse:responseObject remain:remain error:error completion:completion];
  }];
}

RCT_EXPORT_METHOD(deleteTag:(NSString *)tag response:(RCTResponseSenderBlock)completion)
{
  [UMessage deleteTags:tag response:^(id  _Nonnull responseObject, NSInteger remain, NSError * _Nonnull error) {
    [self handleResponse:responseObject remain:remain error:error completion:completion];
  }];
}

RCT_EXPORT_METHOD(listTag:(RCTResponseSenderBlock)completion)
{
  [UMessage getTags:^(NSSet * _Nonnull responseTags, NSInteger remain, NSError * _Nonnull error) {
    [self handleGetTagResponse:responseTags remain:remain error:error completion:completion];
  }];
}

RCT_EXPORT_METHOD(addAlias:(NSString *)name type:(NSString *)type response:(RCTResponseSenderBlock)completion)
{
  [UMessage addAlias:name type:type response:^(id  _Nonnull responseObject, NSError * _Nonnull error) {
    [self handleAliasResponse:responseObject error:error completion:completion];
  }];
}

RCT_EXPORT_METHOD(addExclusiveAlias:(NSString *)name type:(NSString *)type response:(RCTResponseSenderBlock)completion)
{
  [UMessage setAlias:name type:type response:^(id  _Nonnull responseObject, NSError * _Nonnull error) {
    [self handleAliasResponse:responseObject error:error completion:completion];
  }];
}

RCT_EXPORT_METHOD(deleteAlias:(NSString *)name type:(NSString *)type response:(RCTResponseSenderBlock)completion)
{
  [UMessage removeAlias:name type:type response:^(id  _Nonnull responseObject, NSError * _Nonnull error) {
    [self handleAliasResponse:responseObject error:error completion:completion];
  }];
}


RCT_EXPORT_METHOD(getUparas:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  //    NSString*idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  NSError * error=[NSError errorWithDomain:@"test" code:0 userInfo:@{@"code":@(0)}];
  if(1){
    resolver(@"resolver正确返回");
  }else{
    reject(@"0",@"参数不完整",error);
  }
}



- (void)viewDidLoad {
  
  // 1.注册通知
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(InfoNotificationAction:) name:@"InfoNotification" object:nil];
  
}

// 2.实现收到通知触发的方法

- (void)InfoNotificationAction:(NSNotification *)notification{
  
  NSLog(@"%@",notification.userInfo);
  
  NSLog(@"---接收到通知---");
  
}
@end

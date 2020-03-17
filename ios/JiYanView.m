//
//  JiYanView.m
//  jiyan
//
//  Created by 张作华 on 2018/4/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JiYanView.h"
#import <GT3Captcha/GT3Captcha.h>
#import <WebKit/WebKit.h>
#import "CustomButton.h"
#import "TipsView.h"
#import "NSAttributedString+AttributedString.h"

//网站主部署的用于验证登录的接口 (api_1)
//#define api_1 @"http://ui.btcdo.org/user/getGeetest"//http://www.geetest.com/demo/gt/register-slide"
//网站主部署的二次验证的接口 (api_2)
//#define api_2 @"http://www.geetest.com/demo/gt/validate-slide"//"http://ui.btcdo.org/user/getGeetest"//"http://www.geetest.com/demo/gt/validate-slide"

@interface JiYanView () <GT3CaptchaManagerDelegate, CaptchaButtonDelegate>
@property (nonatomic, strong) GT3CaptchaButton *captchaButton;
@end


@implementation JiYanView

//RCT_EXPORT_MODULE()

//RCT_EXPORT_METHOD(startCaptcha)
//{
//  NSLog(@"doSomething");
//  //[self.captchaButton startCaptcha];
//}


- (GT3CaptchaButton *)captchaButton {
  if (!_captchaButton) {
    //创建验证管理器实例
    GT3CaptchaManager *captchaManager = [[GT3CaptchaManager alloc] initWithAPI1:_API1 API2:_API2 timeout:5.0];
    captchaManager.delegate = self;
    captchaManager.maskColor = [UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.6];
    
    //debug mode
    //        [captchaManager enableDebugMode:YES];
    //创建验证视图的实例
    _captchaButton = [[GT3CaptchaButton alloc] initWithFrame:CGRectMake(0, 0, 260, 40) captchaManager:captchaManager];
  }
  return _captchaButton;
}

- (void) setAPI1: (NSString *)API1
{
  _API1 =API1;
//  [self tryInit];
}

- (void) setAPI2: (NSString *)API2
{
  _API2 =API2;
//  [self tryInit];
}

//非正规写法,待改为rn的初始化完成的生命周期
- (void) tryInit
{
  if(_API1==nil||_API2==nil)
    return ;
  [self.captchaButton startCaptcha];
  [self addSubview:self.captchaButton];
}

- (void) startCaptcha
{
  NSLog(@"doSomething");
//  self.onJiYanResult(@{@"result": @"fail",@"code":@("a'd'da'j'j'f")});
  [self tryInit];
  [self.captchaButton startCaptcha];
}


//- (void) setAPI_2: (NSString)v
//{
//  API_2 = v;
//}

- (instancetype)initWithFrame:(CGRect)frame{
 
  if (self = [super initWithFrame:frame]){
    //添加验证按钮到父视图上
   // self.captchaButton.center = CGPointMake(self.center.x , self.center.y );
    //推荐直接开启验证
    //[self.captchaButton startCaptcha];
    //[self addSubview:self.captchaButton];
  }
  return self;
}
#pragma MARK - CaptchaButtonDelegate

//- (BOOL)captchaButtonShouldBeginTapAction:(CustomButton *)button {
//  return YES;
//}

//- (void)captcha:(GT3CaptchaManager *)manager didReceiveSecondaryCaptchaData:(NSData *)data response:(NSURLResponse *)response error:(GT3Error *)error {
//  //演示中全部默认为成功, 不对返回做判断
//  [TipsView showTipOnKeyWindow:@"DEMO: 登录成功"];
//}

#pragma MARK - GT3CaptchaManagerDelegate

- (void)gtCaptcha:(GT3CaptchaManager *)manager errorHandler:(GT3Error *)error {
  //处理验证中返回的错误
  if (error.code == -999) {
    // 请求被意外中断, 一般由用户进行取消操作导致, 可忽略错误
    self.onJiYanResult(@{@"result": @"fail",@"code":@(-999)});
  }
  else if (error.code == -10) {
    // 预判断时被封禁, 不会再进行图形验证
     self.onJiYanResult(@{@"result": @"fail",@"code":@(-10)});
  }
  else if (error.code == -20) {
    // 尝试过多
     self.onJiYanResult(@{@"result": @"fail",@"code":@(-20)});
  }
  else {
    // 网络问题或解析失败, 更多错误码参考开发文档
     self.onJiYanResult(@{@"result": @"fail",@"code":@(error.code)});
  }
  
  // 极验错误提示码 在这里去掉了 由JS处理
  // [TipsView showTipOnKeyWindow:error.error_code fontSize:12.0];
}

- (void)gtCaptchaUserDidCloseGTView:(GT3CaptchaManager *)manager {
  NSLog(@"User Did Close GTView.");
}

- (void)gtCaptcha:(GT3CaptchaManager *)manager didReceiveSecondaryCaptchaData:(NSData *)data response:(NSURLResponse *)response error:(GT3Error *)error decisionHandler:(void (^)(GT3SecondaryCaptchaPolicy))decisionHandler {
  if (!error) {
    //处理你的验证结果
    NSLog(@"\ndata: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
    //成功请调用decisionHandler(GT3SecondaryCaptchaPolicyAllow)
    decisionHandler(GT3SecondaryCaptchaPolicyAllow);
    //self.onJiYanResult(@{@"result": @"success"});
    self.onJiYanResult(@{@"result": [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]});
    //失败请调用decisionHandler(GT3SecondaryCaptchaPolicyForbidden)
    //decisionHandler(GT3SecondaryCaptchaPolicyForbidden);
     // [TipsView showTipOnKeyWindow:@"DEMO: 登入成功"];
   // self.JiYanResult(@{@"result": @"success"});
 
  }
  else {
    //二次验证发生错误
    decisionHandler(GT3SecondaryCaptchaPolicyForbidden);
    
    // 极验错误提示码 在这里去掉了 由JS处理
    //[TipsView showTipOnKeyWindow:error.error_code fontSize:12.0];
  }
}

/** 修改API2的请求
 - (void)gtCaptcha:(GT3CaptchaManager *)manager willSendSecondaryCaptchaRequest:(NSURLRequest *)originalRequest withReplacedRequest:(void (^)(NSMutableURLRequest *))replacedRequest {
 
 }
 */

/** 不使用默认的二次验证接口
 - (void)gtCaptcha:(GT3CaptchaManager *)manager didReceiveCaptchaCode:(NSString *)code result:(NSDictionary *)result message:(NSString *)message {
 
 __block NSMutableString *postResult = [[NSMutableString alloc] init];
 [result enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL * stop) {
 [postResult appendFormat:@"%@=%@&",key,obj];
 }];
 
 NSDictionary *headerFields = @{@"Content-Type":@"application/x-www-form-urlencoded;charset=UTF-8"};
 NSMutableURLRequest *secondaryRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:api_2] cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:15.0];
 secondaryRequest.HTTPMethod = @"POST";
 secondaryRequest.allHTTPHeaderFields = headerFields;
 secondaryRequest.HTTPBody = [postResult dataUsingEncoding:NSUTF8StringEncoding];
 
 NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
 NSURLSession *session = [NSURLSession sessionWithConfiguration:config];
 NSURLSessionDataTask *task = [session dataTaskWithRequest:secondaryRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
 
 [manager closeGTViewIfIsOpen];
 
 NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
 if (!error && httpResponse.statusCode == 200) {
 NSError *err;
 NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&err];
 if (!err) {
 NSString *status = [dict objectForKey:@"status"];
 if ([status isEqualToString:@"success"]) {
 NSLog(@"通过业务流程");
 }
 else {
 NSLog(@"无法通过业务流程");
 }
 }
 }
 }];
 
 [task resume];
 }
 
 - (BOOL)shouldUseDefaultSecondaryValidate:(GT3CaptchaManager *)manager {
 return NO;
 }
 */

/** 处理API1返回的数据并将验证初始化数据解析给管理器
 - (NSDictionary *)gtCaptcha:(GT3CaptchaManager *)manager didReceiveDataFromAPI1:(NSDictionary *)dictionary withError:(GT3Error *)error {
 
 }
 */

/** 修改API1的请求 */
- (void)gtCaptcha:(GT3CaptchaManager *)manager willSendRequestAPI1:(NSURLRequest *)originalRequest withReplacedHandler:(void (^)(NSURLRequest *))replacedHandler {
  NSMutableURLRequest *mRequest = [originalRequest mutableCopy];
  NSString *newURL = [NSString stringWithFormat:@"%@?t=%.0f", originalRequest.URL.absoluteString, [[[NSDate alloc] init]timeIntervalSince1970]];
  mRequest.URL = [NSURL URLWithString:newURL];
  
  replacedHandler(mRequest);
}

@end

//
//  JiYanViewManager.m
//  jiyan
//
//  Created by 张作华 on 2018/4/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JiYanViewManager.h"
#import "JiYanView.h"

@interface JiYanViewManager ()
@property (nonatomic, strong) JiYanView *jiYanView;
@end


@implementation JiYanViewManager
RCT_EXPORT_MODULE()
//  事件的导出，onClickBanner对应view中扩展的属性
RCT_EXPORT_VIEW_PROPERTY(onJiYanResult, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(API1, NSString)
RCT_EXPORT_VIEW_PROPERTY(API2, NSString)

RCT_EXPORT_METHOD(startCaptcha){
  [self.jiYanView startCaptcha];
}

-(UIView *)view{
  JiYanView *view = [[JiYanView alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  self.jiYanView =view;
  return view;
}

@end

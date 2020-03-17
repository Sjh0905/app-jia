//
//  JiYanView.h
//  jiyan
//
//  Created by 张作华 on 2018/4/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
//#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>

@interface JiYanView : UIView
@property (nonatomic, copy) RCTBubblingEventBlock onJiYanResult;
@property (nonatomic, copy) NSString * API1;
@property (nonatomic, copy) NSString * API2;
-(void) startCaptcha;

@end

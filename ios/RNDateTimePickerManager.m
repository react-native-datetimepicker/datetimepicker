/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNDateTimePickerManager.h"

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNDateTimePicker.h"
#import <React/UIView+React.h>

#if __IPHONE_OS_VERSION_MAX_ALLOWED < 130000
@interface UIColor (Xcode10)
+ (instancetype) labelColor;
@end
#endif

@implementation RCTConvert(UIDatePicker)

RCT_ENUM_CONVERTER(UIDatePickerMode, (@{
  @"time": @(UIDatePickerModeTime),
  @"date": @(UIDatePickerModeDate),
  @"datetime": @(UIDatePickerModeDateAndTime),
}), UIDatePickerModeTime, integerValue)

@end

@implementation RNDateTimePickerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNDateTimePicker new];
}

RCT_EXPORT_METHOD(measure:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIDatePicker* view = [RNDateTimePicker new];

        view.datePickerMode = UIDatePickerModeDate;
        view.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
        [view layoutIfNeeded];
        CGFloat autoHeightForDatePicker = CGRectGetHeight(view.frame);
        
        view.datePickerMode = UIDatePickerModeTime;
        view.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
        [view layoutIfNeeded];
        CGFloat autoHeightForTimePicker = CGRectGetHeight(view.frame);

        resolve(@{
                 @"autoHeightForDatePicker": @(autoHeightForDatePicker),
                 @"autoHeightForTimePicker": @(autoHeightForTimePicker),
                });
    });
}

RCT_EXPORT_VIEW_PROPERTY(date, NSDate)
RCT_EXPORT_VIEW_PROPERTY(locale, NSLocale)
RCT_EXPORT_VIEW_PROPERTY(minimumDate, NSDate)
RCT_EXPORT_VIEW_PROPERTY(maximumDate, NSDate)
RCT_EXPORT_VIEW_PROPERTY(minuteInterval, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_REMAP_VIEW_PROPERTY(mode, datePickerMode, UIDatePickerMode)
RCT_REMAP_VIEW_PROPERTY(timeZoneOffsetInMinutes, timeZone, NSTimeZone)

RCT_CUSTOM_VIEW_PROPERTY(textColor, UIColor, RNDateTimePicker)
{
  if (json) {
    [view setValue:[RCTConvert UIColor:json] forKey:@"textColor"];
    [view setValue:@(NO) forKey:@"highlightsToday"];
  } else {
    UIColor* defaultColor;
    if (@available(iOS 13.0, *)) {
        defaultColor = [UIColor labelColor];
    } else {
        defaultColor = [UIColor blackColor];
    }
    [view setValue:defaultColor forKey:@"textColor"];
    [view setValue:@(YES) forKey:@"highlightsToday"];
  }
}

// TODO vonovak setting preferredDatePickerStyle invalidates minuteinterval
RCT_CUSTOM_VIEW_PROPERTY(displayIOS, NSString, RNDateTimePicker)
{
    if (@available(iOS 13.4, *)) {
        if (json) {
            NSString* propValue = [RCTConvert NSString:json];
            if ([propValue isEqualToString:@"compact"]) {
                view.preferredDatePickerStyle = UIDatePickerStyleCompact;
            } else if ([propValue isEqualToString:@"spinner"]) {
                view.preferredDatePickerStyle = UIDatePickerStyleWheels;
            } else if ([propValue isEqualToString:@"inline"]) {
                #if __IPHONE_OS_VERSION_MAX_ALLOWED >= 140000
                if (@available(iOS 14.0, *)) {
                    view.preferredDatePickerStyle = UIDatePickerStyleInline;
                }
                #endif
            } else {
                // propValue is "default"
                view.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
            }
        } else {
            view.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
        }
    }
}

@end

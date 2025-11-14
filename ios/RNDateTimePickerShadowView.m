#import "RNDateTimePickerShadowView.h"

@implementation RNDateTimePickerShadowView

- (instancetype)init
{
  if (self = [super init]) {
    YGNodeSetMeasureFunc(self.yogaNode, RNDateTimePickerShadowViewMeasure);
  }
  return self;
}

- (void)setDate:(NSDate *)date {
  _date = date;
  YGNodeMarkDirty(self.yogaNode);
}

- (void)setLocale:(NSLocale *)locale {
  _locale = locale;
  YGNodeMarkDirty(self.yogaNode);
}

- (void)setMode:(UIDatePickerMode)mode {
  _mode = mode;
  YGNodeMarkDirty(self.yogaNode);
}


- (void)setDisplayIOS:(UIDatePickerStyle)displayIOS {
  _displayIOS = displayIOS;
  YGNodeMarkDirty(self.yogaNode);
}

- (void)setTimeZoneOffsetInMinutes:(NSInteger)timeZoneOffsetInMinutes {
  _timeZoneOffsetInMinutes = timeZoneOffsetInMinutes;
  YGNodeMarkDirty(self.yogaNode);
}

- (void)setTimeZoneName:(NSString *)timeZoneName {
  _timeZoneName = timeZoneName;
  YGNodeMarkDirty(self.yogaNode);
}

static YGSize RNDateTimePickerShadowViewMeasure(YGNodeConstRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
{
  RNDateTimePickerShadowView *shadowPickerView = (__bridge RNDateTimePickerShadowView *)YGNodeGetContext(node);

  __block CGSize size;
  dispatch_sync(dispatch_get_main_queue(), ^{
    [shadowPickerView.picker setDate:shadowPickerView.date];
    [shadowPickerView.picker setDatePickerMode:shadowPickerView.mode];
    [shadowPickerView.picker setLocale:shadowPickerView.locale];
    [shadowPickerView.picker setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:shadowPickerView.timeZoneOffsetInMinutes * 60]];

    if (shadowPickerView.timeZoneName) {
      NSTimeZone *timeZone = [NSTimeZone timeZoneWithName:shadowPickerView.timeZoneName];
      if (timeZone != nil) {
        [shadowPickerView.picker setTimeZone:timeZone];
      } else {
        RCTLogWarn(@"'%@' does not exist in NSTimeZone.knownTimeZoneNames. Falling back to localTimeZone=%@", shadowPickerView.timeZoneName, NSTimeZone.localTimeZone.name);
        [shadowPickerView.picker setTimeZone:NSTimeZone.localTimeZone];
      }
    } else {
      [shadowPickerView.picker setTimeZone:NSTimeZone.localTimeZone];
    }

    if (@available(iOS 14.0, *)) {
      [shadowPickerView.picker setPreferredDatePickerStyle:shadowPickerView.displayIOS];
    }

    size = [shadowPickerView.picker sizeThatFits:UILayoutFittingCompressedSize];
    
    // Check if we're using inline/calendar style
    BOOL isInlineStyle = NO;
    if (@available(iOS 14.0, *)) {
      isInlineStyle = shadowPickerView.picker.preferredDatePickerStyle == UIDatePickerStyleInline;
    }
    
    // iOS DatePicker requires a minimum width of 280 points for proper display
    // UICalendarView (inline) requires a minimum height of 330 points
    // See: https://github.com/react-native-datetimepicker/datetimepicker/issues/1014
    size.width = MAX(size.width, 280);
    if (isInlineStyle) {
      size.height = MAX(size.height, 330);
    }
    
    // Handle width constraints
    if (widthMode == YGMeasureModeExactly) {
      size.width = width;
    } else if (widthMode == YGMeasureModeAtMost) {
      // For inline/calendar style, use the full available width
      if (isInlineStyle) {
        size.width = MAX(280, MIN(width, 500)); // Use available width, max 500pt
      } else {
        size.width = MIN(size.width + 10, width);
      }
    } else {
      // For undefined mode with inline style, suggest a larger width
      if (isInlineStyle) {
        size.width = MAX(size.width, 375);
      } else {
        size.width += 10;
      }
    }
    
    // Handle height constraints for inline style
    if (isInlineStyle) {
      if (heightMode == YGMeasureModeExactly) {
        size.height = MAX(height, 280); // Enforce reasonable minimum even for exact mode
      } else if (heightMode == YGMeasureModeAtMost) {
        size.height = MIN(size.height, height);
      }
    }
  });

  return (YGSize){
    RCTYogaFloatFromCoreGraphicsFloat(size.width),
    RCTYogaFloatFromCoreGraphicsFloat(size.height)
  };
}

@end

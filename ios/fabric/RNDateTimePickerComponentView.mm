#import "RNDateTimePickerComponentView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/RNDateTimePicker/ComponentDescriptors.h>
#import <react/renderer/components/RNDateTimePicker/EventEmitters.h>
#import <react/renderer/components/RNDateTimePicker/Props.h>
#import <react/renderer/components/RNDateTimePicker/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RNDateTimePicker.h"

using namespace facebook::react;

@interface RNDateTimePickerComponentView () <RCTRNDateTimePickerViewProtocol>
@end

@implementation RNDateTimePickerComponentView {
    UIDatePicker *_datePickerView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RNDateTimePickerProps>();
        _props = defaultProps;
        
        _datePickerView = [[RNDateTimePicker alloc] initWithFrame:self.bounds];
        
        [_datePickerView addTarget:self action:@selector(onChange:) forControlEvents:UIControlEventValueChanged];
        
        // Default Picker mode
        _datePickerView.datePickerMode = UIDatePickerModeDate;
        
        self.contentView = _datePickerView;
    }
    
    return self;
}

-(void)onChange:(RNDateTimePicker *)sender
{
    if (!_eventEmitter) {
        return;
    }
    
    NSTimeInterval timestamp = [sender.date timeIntervalSince1970];
    RNDateTimePickerEventEmitter::OnChange event = {
        // Sending time in milliseconds
        .timestamp = timestamp * 1000
    };
    
    std::dynamic_pointer_cast<const RNDateTimePickerEventEmitter>(_eventEmitter)
    ->onChange(event);
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNDateTimePickerComponentDescriptor>();
}

// JS Standard for time is milliseconds
NSDate* convertJSTimeToDate (double jsTime) {
    double time = jsTime/1000.0;
    return [NSDate dateWithTimeIntervalSince1970: time];
}

-(void)updateTextColor:(UIColor *)color
{
    if (@available(iOS 14.0, *)) {
        if (_datePickerView.datePickerStyle != UIDatePickerStyleWheels) {
            // prevents #247
            return;
        }
    }
    
    if (color == nil) {
        // Default Text color
        if (@available(iOS 13.0, *)) {
            color = [UIColor labelColor];
        } else {
            color = [UIColor blackColor];
        }
    }
    
    [_datePickerView setValue:color forKey:@"textColor"];
    [_datePickerView setValue:@(NO) forKey:@"highlightsToday"];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldPickerProps = *std::static_pointer_cast<const RNDateTimePickerProps>(_props);
    const auto &newPickerProps = *std::static_pointer_cast<const RNDateTimePickerProps>(props);
    
    if (oldPickerProps.date != newPickerProps.date) {
        _datePickerView.date = convertJSTimeToDate(newPickerProps.date);
    }
    
    if (oldPickerProps.minimumDate != newPickerProps.minimumDate) {
        _datePickerView.minimumDate = convertJSTimeToDate(newPickerProps.minimumDate);
    }
    
    if (oldPickerProps.maximumDate != newPickerProps.maximumDate) {
        _datePickerView.maximumDate = convertJSTimeToDate(newPickerProps.maximumDate);
    }
    
    if (oldPickerProps.locale != newPickerProps.locale) {
        NSString *convertedLocale = RCTNSStringFromString(newPickerProps.locale);
        NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:convertedLocale];
        
        _datePickerView.locale = locale;
    }
    
    if (oldPickerProps.mode != newPickerProps.mode) {
        switch(newPickerProps.mode) {
            case RNDateTimePickerMode::Time:
                _datePickerView.datePickerMode = UIDatePickerModeTime;
                break;
            case RNDateTimePickerMode::Datetime:
                _datePickerView.datePickerMode = UIDatePickerModeDateAndTime;
                break;
            case RNDateTimePickerMode::Countdown:
                _datePickerView.datePickerMode = UIDatePickerModeCountDownTimer;
                break;
            default:
                _datePickerView.datePickerMode = UIDatePickerModeDate;
        }
    }
    
    if (@available(iOS 14.0, *)) {
        if (oldPickerProps.displayIOS != newPickerProps.displayIOS) {
            switch(newPickerProps.displayIOS) {
                case RNDateTimePickerDisplayIOS::Compact:
                    _datePickerView.preferredDatePickerStyle = UIDatePickerStyleCompact;
                    break;
                case RNDateTimePickerDisplayIOS::Inline:
                    _datePickerView.preferredDatePickerStyle = UIDatePickerStyleInline;
                    break;
                case RNDateTimePickerDisplayIOS::Spinner:
                    _datePickerView.preferredDatePickerStyle = UIDatePickerStyleWheels;
                    break;
                default:
                    _datePickerView.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
            }
        }
    }
    
    if (oldPickerProps.minuteInterval != newPickerProps.minuteInterval) {
        _datePickerView.minuteInterval = newPickerProps.minuteInterval;
    }
    
    if (oldPickerProps.timeZoneOffsetInMinutes != newPickerProps.timeZoneOffsetInMinutes) {
        // JS standard for time zones is minutes.
        _datePickerView.timeZone = [NSTimeZone timeZoneForSecondsFromGMT:newPickerProps.timeZoneOffsetInMinutes * 60.0];
    }
    
    if (oldPickerProps.accentColor != newPickerProps.accentColor) {
        UIColor *color = RCTUIColorFromSharedColor(newPickerProps.accentColor);
        
        if (color != nil) {
            [_datePickerView setTintColor:color];
        } else {
            if (@available(iOS 15.0, *)) {
                [_datePickerView setTintColor:[UIColor tintColor]];
            } else {
                [_datePickerView setTintColor:[UIColor systemBlueColor]];
            }
        }
    }
    
    if (oldPickerProps.textColor != newPickerProps.textColor) {
        [self updateTextColor:RCTUIColorFromSharedColor(newPickerProps.textColor)];
    }
    
    if (@available(iOS 13.0, *)) {
        if (oldPickerProps.themeVariant != newPickerProps.themeVariant) {
            switch (newPickerProps.themeVariant) {
                case RNDateTimePickerThemeVariant::Light:
                    _datePickerView.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
                    break;
                case RNDateTimePickerThemeVariant::Dark:
                    _datePickerView.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
                    break;
                default:
                    _datePickerView.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
            }
        }
    }
    
    if (oldPickerProps.enabled != newPickerProps.enabled) {
        _datePickerView.enabled = newPickerProps.enabled;
    }
    
    
    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNDateTimePickerCls(void)
{
    return RNDateTimePickerComponentView.class;
}


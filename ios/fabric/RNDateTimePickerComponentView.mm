/**
 * RNDateTimePickerComponentView is only be available when fabric is enabled.
 */

#import "RNDateTimePickerComponentView.h"
#import <React/RCTConversions.h>

#import "cpp/react/renderer/components/RNDateTimePicker/ComponentDescriptors.h"
#import <react/renderer/components/RNDateTimePickerCGen/EventEmitters.h>
#import <react/renderer/components/RNDateTimePickerCGen/Props.h>
#import <react/renderer/components/RNDateTimePickerCGen/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RNDateTimePicker.h"

using namespace facebook::react;

// JS Standard for time is milliseconds
NSDate* convertJSTimeToDate (double jsTime) {
    double time = jsTime/1000.0;
    return [NSDate dateWithTimeIntervalSince1970: time];
}

@interface RNDateTimePickerComponentView () <RCTRNDateTimePickerViewProtocol>
@end

@implementation RNDateTimePickerComponentView {
    UIDatePicker *_picker;
    // Dummy picker to apply prop changes and calculate/update the size before the actual picker gets updated
    UIDatePicker *_dummyPicker;
    RNDateTimePickerShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RNDateTimePickerProps>();
        _props = defaultProps;
        
        _picker = [RNDateTimePicker new];
        _dummyPicker = [RNDateTimePicker new];
        
        [_picker addTarget:self action:@selector(onChange:) forControlEvents:UIControlEventValueChanged];
        [_picker addTarget:self action:@selector(onDismiss:) forControlEvents:UIControlEventEditingDidEnd];
        
        // Default Picker mode
        _picker.datePickerMode = UIDatePickerModeDate;
        _dummyPicker.datePickerMode = UIDatePickerModeDate;
        
        self.contentView = _picker;
    }
    
    return self;
}

-(void)onDismiss:(RNDateTimePicker *)sender
{
    if (!_eventEmitter) {
        return;
    }
    RNDateTimePickerEventEmitter::OnPickerDismiss event = {};
    std::dynamic_pointer_cast<const RNDateTimePickerEventEmitter>(_eventEmitter)
    ->onPickerDismiss(event);
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

/**
 * Updates the shadow node state with the dummyPicker size. This will update the shadow node size.
 * (see adopt method in ComponentDescriptors.h)
 */
- (void) updateMeasurements {
    if (_state == nullptr) {
        return;
    }
    CGSize size = [_dummyPicker sizeThatFits:UILayoutFittingCompressedSize];
    size.width += 10;
    auto newState = RNDateTimePickerState{RCTSizeFromCGSize(size)};
    _state->updateState(std::move(newState));
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNDateTimePickerComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _state.reset();
}

-(void)updateTextColorForPicker:(UIDatePicker *)picker color:(UIColor *)color
{
    if (@available(iOS 14.0, *)) {
        if (picker.datePickerStyle != UIDatePickerStyleWheels) {
            // prevents #247
            return;
        }
    }

    if (color) {
        [picker setValue:color forKey:@"textColor"];
        [picker setValue:@(NO) forKey:@"highlightsToday"];
    } else {
        // Default Text color
        if (@available(iOS 13.0, *)) {
            color = [UIColor labelColor];
        } else {
            color = [UIColor blackColor];
        }
        [picker setValue:color forKey:@"textColor"];
        [picker setValue:@(YES) forKey:@"highlightsToday"];
    }
}

/**
 * override update state to update shadow node size once the state is available
 */
- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState {
    _state = std::static_pointer_cast<const RNDateTimePickerShadowNode::ConcreteState>(state);
    
    if (oldState == nullptr) {
        // Calculate the initial picker measurements
        [self updateMeasurements];
    }
}

/**
 * Updates picker properties based on prop changes and returns a boolean that indicates if the shadow node size needs
 * to be updated. This boolean helpful when we update the dummy picker to know if we need to update the shadow node
 * size before updating the actual picker.
 * Props that will to update measurements: date, locale, mode, displayIOS.
 */
- (Boolean)updatePropsForPicker:(UIDatePicker *)picker props:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
    
    const auto &oldPickerProps = *std::static_pointer_cast<const RNDateTimePickerProps>(_props);
    const auto &newPickerProps = *std::static_pointer_cast<const RNDateTimePickerProps>(props);
    Boolean needsToUpdateMeasurements = false;
    
    if (oldPickerProps.date != newPickerProps.date) {
        picker.date = convertJSTimeToDate(newPickerProps.date);
        needsToUpdateMeasurements = true;
    }
    
    if (oldPickerProps.minimumDate != newPickerProps.minimumDate) {
        picker.minimumDate = convertJSTimeToDate(newPickerProps.minimumDate);
    }
    
    if (oldPickerProps.maximumDate != newPickerProps.maximumDate) {
        picker.maximumDate = convertJSTimeToDate(newPickerProps.maximumDate);
    }
    
    if (oldPickerProps.locale != newPickerProps.locale) {
        NSString *convertedLocale = RCTNSStringFromString(newPickerProps.locale);
        NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:convertedLocale];

        picker.locale = locale;
        needsToUpdateMeasurements = true;
    }
    
    if (oldPickerProps.mode != newPickerProps.mode) {
        switch(newPickerProps.mode) {
            case RNDateTimePickerMode::Time:
                picker.datePickerMode = UIDatePickerModeTime;
                break;
            case RNDateTimePickerMode::Datetime:
                picker.datePickerMode = UIDatePickerModeDateAndTime;
                break;
            case RNDateTimePickerMode::Countdown:
                picker.datePickerMode = UIDatePickerModeCountDownTimer;
                break;
            default:
                picker.datePickerMode = UIDatePickerModeDate;
        }
        needsToUpdateMeasurements = true;
    }
    
    if (@available(iOS 14.0, *)) {
        if (oldPickerProps.displayIOS != newPickerProps.displayIOS) {
            switch(newPickerProps.displayIOS) {
                case RNDateTimePickerDisplayIOS::Compact:
                    picker.preferredDatePickerStyle = UIDatePickerStyleCompact;
                    break;
                case RNDateTimePickerDisplayIOS::Inline:
                    picker.preferredDatePickerStyle = UIDatePickerStyleInline;
                    break;
                case RNDateTimePickerDisplayIOS::Spinner:
                    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
                    break;
                default:
                    picker.preferredDatePickerStyle = UIDatePickerStyleAutomatic;
            }
            needsToUpdateMeasurements = true;
        }
    }
    
    if (oldPickerProps.minuteInterval != newPickerProps.minuteInterval) {
        picker.minuteInterval = newPickerProps.minuteInterval;
    }
    
    if (oldPickerProps.timeZoneOffsetInMinutes != newPickerProps.timeZoneOffsetInMinutes) {
        // JS standard for time zones is minutes.
        picker.timeZone = [NSTimeZone timeZoneForSecondsFromGMT:newPickerProps.timeZoneOffsetInMinutes * 60.0];
    }
    
    if (oldPickerProps.accentColor != newPickerProps.accentColor) {
        UIColor *color = RCTUIColorFromSharedColor(newPickerProps.accentColor);
        
        if (color != nil) {
            [picker setTintColor:color];
        } else {
            if (@available(iOS 15.0, *)) {
                [picker setTintColor:[UIColor tintColor]];
            } else {
                [picker setTintColor:[UIColor systemBlueColor]];
            }
        }
    }
    
    if (oldPickerProps.textColor != newPickerProps.textColor) {
        [self updateTextColorForPicker:picker color:RCTUIColorFromSharedColor(newPickerProps.textColor)];
    }
    
    if (@available(iOS 13.0, *)) {
        if (oldPickerProps.themeVariant != newPickerProps.themeVariant) {
            switch (newPickerProps.themeVariant) {
                case RNDateTimePickerThemeVariant::Light:
                    picker.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
                    break;
                case RNDateTimePickerThemeVariant::Dark:
                    picker.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
                    break;
                default:
                    picker.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
            }
        }
    }
    
    if (oldPickerProps.enabled != newPickerProps.enabled) {
        picker.enabled = newPickerProps.enabled;
    }
    
    return needsToUpdateMeasurements;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    // Updating the dummy first to check if we need to update measurements
    Boolean needsToUpdateMeasurements = [self updatePropsForPicker:_dummyPicker props:props oldProps:oldProps];
    
    if (needsToUpdateMeasurements) {
        [self updateMeasurements];
    }
    
    [self updatePropsForPicker:_picker props:props oldProps:oldProps];
    
    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNDateTimePickerCls(void)
{
    return RNDateTimePickerComponentView.class;
}


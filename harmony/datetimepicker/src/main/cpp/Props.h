/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANT KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/graphics/Color.h>

namespace facebook {
namespace react {

enum class RNDateTimePickerMode { Date, Time, Datetime, Countdown};

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNDateTimePickerMode &result) {
    auto string = (std::string)value;
    if(string == "date") { result = RNDateTimePickerMode::Date; return;}
    if(string == "time") { result = RNDateTimePickerMode::Time; return;}
    if(string == "datetime") { result = RNDateTimePickerMode::Datetime; return;}
    if(string == "countdown") { result = RNDateTimePickerMode::Countdown; return; }
    abort();
}

static inline std::string toString(const RNDateTimePickerMode &value){
    switch (value) {
        case RNDateTimePickerMode::Date: return "date";
        case RNDateTimePickerMode::Time: return "time";
        case RNDateTimePickerMode::Datetime: return "datetime";
        case RNDateTimePickerMode::Countdown: return "countdown";
    }
}

enum class RNDateTimePickerThemeVariant { Dark, Light, Unspecified};

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNDateTimePickerThemeVariant &result) {
      auto string = (std::string)value;
        if(string == "dark") { result = RNDateTimePickerThemeVariant::Dark; return;}
        if(string == "light") { result = RNDateTimePickerThemeVariant::Light; return;}
        if(string == "unspecified") { result = RNDateTimePickerThemeVariant::Unspecified; return; }
        abort();
}

static inline std::string toString(const RNDateTimePickerThemeVariant &value){
    switch (value) {
        case RNDateTimePickerThemeVariant::Dark: return "dark";
        case RNDateTimePickerThemeVariant::Light: return "light";
        case RNDateTimePickerThemeVariant::Unspecified: return "unspecified";
    }
}
enum class RNDateTimePickerDisplayIOS { Default, Spinner, Compact, Inline};

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNDateTimePickerDisplayIOS &result) {
      auto string = (std::string)value;
        if(string == "default") { result = RNDateTimePickerDisplayIOS::Default; return;}
        if(string == "spinner") { result = RNDateTimePickerDisplayIOS::Spinner; return;}
        if(string == "compact") { result = RNDateTimePickerDisplayIOS::Compact; return; }
        if(string == "inline") { result = RNDateTimePickerDisplayIOS::Inline; return; }
        abort();
}

static inline std::string toString(const RNDateTimePickerDisplayIOS &value){
    switch (value) {
        case RNDateTimePickerDisplayIOS::Default: return "default";
        case RNDateTimePickerDisplayIOS::Spinner: return "spinner";
        case RNDateTimePickerDisplayIOS::Compact: return "compact";
        case RNDateTimePickerDisplayIOS::Inline: return "inline";
    }
}

class JSI_EXPORT RNDateTimePickerProps final : public ViewProps {
    public:
        RNDateTimePickerProps() = default;
        RNDateTimePickerProps(const PropsParserContext& context, const RNDateTimePickerProps &sourceProps, const RawProps &rawProps);

#pragma mark - Props

    int64_t maximumDate{0};
    int64_t minimumDate{0};
    int64_t date{0};
    std::string locale{};
    int minuteInterval{0};
    std::string mode{ toString(RNDateTimePickerMode::Date)};
    facebook::react::Float timeZoneOffsetInMinutes{0.0};
    std::string timeZoneName{};
    std::string textColor{};
    std::string accentColor{};
    std::string themeVariant{toString(RNDateTimePickerThemeVariant::Unspecified)};
    std::string displayIOS{toString(RNDateTimePickerDisplayIOS::Default)};
    bool enabled{true};
    bool is24Hour{true};
};

} // namespace react    
} // namespace facebook

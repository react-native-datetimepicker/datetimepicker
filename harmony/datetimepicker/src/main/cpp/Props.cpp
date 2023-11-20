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

#include "Props.h"
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>

namespace facebook {
namespace react {
    
RNDateTimePickerProps::RNDateTimePickerProps(
    const PropsParserContext &context,
    const RNDateTimePickerProps &sourceProps,
    const RawProps &rawProps): ViewProps(context,sourceProps,rawProps),

    maximumDate(convertRawProp(context,rawProps,"maximumDate",sourceProps.maximumDate,{0})),
    minimumDate(convertRawProp(context,rawProps,"minimumDate",sourceProps.minimumDate,{0})),
    date(convertRawProp(context,rawProps,"date",sourceProps.date, {0})),
    locale(convertRawProp(context,rawProps,"locale",sourceProps.locale,{})),
    minuteInterval(convertRawProp(context,rawProps,"minuteInterval",sourceProps.minuteInterval,{0})),
    mode(convertRawProp(context,rawProps,"mode",sourceProps.mode,{"date"})),
    timeZoneOffsetInMinutes(convertRawProp(context,rawProps,"timeZoneOffsetInMinutes",sourceProps.timeZoneOffsetInMinutes,{0.0})),
    timeZoneName(convertRawProp(context,rawProps,"timeZoneName",sourceProps.timeZoneName,{})),
    textColor(convertRawProp(context,rawProps,"textColor",sourceProps.textColor,{})),
    accentColor(convertRawProp(context,rawProps,"accentColor",sourceProps.accentColor,{})),
    themeVariant(convertRawProp(context,rawProps,"themeVariant",sourceProps.themeVariant,{"unspecified"})),
    displayIOS(convertRawProp(context,rawProps,"displayIOS",sourceProps.displayIOS,{"default"})),
    is24Hour(convertRawProp(context,rawProps,"is24Hour",sourceProps.is24Hour,{true})),
    enabled(convertRawProp(context,rawProps,"enabled",sourceProps.enabled,{true}))
    {}

} // namespace react
} // namespace facebook
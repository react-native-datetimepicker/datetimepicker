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
#include "RNOHCorePackage/ComponentBinders/ViewComponentJSIBinder.h"

namespace rnoh{
class DateTimePickerJSIBinder : public ViewComponentJSIBinder {
    facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override
    {
        auto object = ViewComponentJSIBinder::createNativeProps(rt);
        object.setProperty(rt,"maximumDate","string");
        object.setProperty(rt,"minimumDate","string");
//        object.setProperty(rt,"date","double"); ////luoxf
        object.setProperty(rt,"date","string");////luoxf
        object.setProperty(rt,"locale","string");
        object.setProperty(rt,"minuteInterval","number");
        
        object.setProperty(rt,"mode","string");//枚举
        object.setProperty(rt,"timeZoneOffsetInMinutes","number");
        object.setProperty(rt,"timeZoneName","string");
        object.setProperty(rt,"textColor","string");//SharedColor
        object.setProperty(rt,"accentColor","string");//SharedColor
        
        object.setProperty(rt,"themeVariant","string");//枚举
        object.setProperty(rt,"displayIOS","string");//枚举
        object.setProperty(rt,"enabled","boolean");
        object.setProperty(rt,"is24Hour","boolean");
        
        return object;
    }
    
        facebook::jsi::Object createBubblingEventTypes(facebook::jsi::Runtime &rt) override
        {
           // LOG(INFO) << "RNOH　datetimepicker:createBubblingEventTypes";
            facebook::jsi::Object events(rt);
            events.setProperty(rt,"topChange",createBubblingCapturedEvent(rt,"onChange"));
            events.setProperty(rt,"topPickerDismiss",createBubblingCapturedEvent(rt,"onPickerDismiss"));
            return events;
        }
    
        facebook::jsi::Object createDirectEventTypes(facebook::jsi::Runtime &rt) override
        {
             facebook::jsi::Object events(rt);
            //createDirectEvent
             return events;
        }
};
}// namespace rnoh
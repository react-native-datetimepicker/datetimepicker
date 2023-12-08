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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#ifndef HEADER_FILE_CPP_D_N_DER_H
#define HEADER_FILE_CPP_D_N_DER_H

#include "RNOHCorePackage/ComponentBinders/ViewComponentNapiBinder.h"
#include "Props.h"
#include "States.h"
#include <sstream>
namespace rnoh{

class DateTimePickerNapiBinder : public ViewComponentNapiBinder {
public:
    std::string toDateStr(int64_t date){
        std::stringstream ss;
        std::string strRes;
        ss << date;
        ss >> strRes;
        return strRes;
    }
    napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override
    {
       napi_value napiViewProps = ViewComponentNapiBinder::createProps(env,shadowView);
        if(auto props = std::dynamic_pointer_cast<const facebook::react::RNDateTimePickerProps>(shadowView.props) ){
            
            return ArkJS(env)
            .getObjectBuilder(napiViewProps)
            .addProperty("maximumDate", toDateStr(props->maximumDate))
            .addProperty("minimumDate", toDateStr(props->minimumDate))
//            .addProperty("date", props->date)
//            .addProperty("date", "stringluoxf:100000")
            .addProperty("date", toDateStr(props->date))
            .addProperty("locale",props->locale)
            .addProperty("minuteInterval",props->minuteInterval)
            .addProperty("mode",props->mode)
            .addProperty("timeZoneOffsetInMinutes",props->timeZoneOffsetInMinutes)
            .addProperty("textColor",props->textColor)
            .addProperty("accentColor",props->accentColor)
            
            .addProperty("themeVariant",props->themeVariant)
            .addProperty("displayIOS",props->displayIOS)
            .addProperty("enabled",props->enabled)
            .addProperty("is24Hour",props->is24Hour)
            .build();
        }
        return napiViewProps;
    };
};

}// namespace rnoh
#endif
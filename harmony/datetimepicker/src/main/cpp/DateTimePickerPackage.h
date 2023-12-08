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

#ifndef HARMONY_DATETIME_SRC_MAIN_CPP_D_P_AGE_H
#define HARMONY_DATETIME_SRC_MAIN_CPP_D_P_AGE_H

#include "RNOH/Package.h"
#include "ComponentDescriptors.h"
#include "DateTimePickerJSIBinder.h"
#include "DateTimePickerNapiBinder.h"
#include "DateTimePickerEventEmitRequestHandler.h"


using namespace rnoh;
using namespace facebook;
namespace rnoh {
    
class DateTimePickerPackage : public Package {
    public:
    DateTimePickerPackage(Package::Context ctx) : Package(ctx){}
    
    std::vector<facebook::react::ComponentDescriptorProvider> createComponentDescriptorProviders() override
    {
        return {
            facebook::react::concreteComponentDescriptorProvider<facebook::react::RNDateTimePickerComponentDescriptor>(),
        };
    }
    
    ComponentJSIBinderByString createComponentJSIBinderByName() override
    {
        return {{"RNDateTimePicker", std::make_shared<DateTimePickerJSIBinder>()}};
    };
    
    ComponentNapiBinderByString createComponentNapiBinderByName() override
    {
        return {{"RNDateTimePicker", std::make_shared<DateTimePickerNapiBinder>()}};
    };
    
    EventEmitRequestHandlers createEventEmitRequestHandlers() override
    {
        return {std::make_shared<DateTimePickerEventEmitRequestHandler>()};
    }
};
} //namespace rnoh
#endif

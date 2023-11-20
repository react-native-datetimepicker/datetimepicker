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
#include <napi/native_api.h>
#include <glog/logging.h>
#include "RNOH/ArkJS.h"
#include "RNOH/EventEmitRequestHandler.h"
#include "EventEmitters.h"

using namespace facebook;
namespace rnoh {

enum DateEventType {
    DATETIME_CHANGE = 0,
    DATETIME_PICKERDISMISS = 1
};

DateEventType getDateEventType(ArkJS &arkJs,napi_value eventObject)
{
    auto eventType = arkJs.getString(arkJs.getObjectProperty(eventObject,"type"));
    if(eventType == "onChange"){
        return DateEventType::DATETIME_CHANGE;
    }else if(eventType == "onPickerDismiss"){
            return DateEventType::DATETIME_PICKERDISMISS;
    }else {
            throw std::runtime_error("Unknown Page event type");
    }
}

class DateTimePickerEventEmitRequestHandler : public EventEmitRequestHandler{
    public:
    void handleEvent(EventEmitRequestHandler::Context const &ctx) override
    {
        if(ctx.eventName != "RNDateTimePicker"){
            return;
        }
        ArkJS arkJs(ctx.env);
        auto eventEmitter = ctx.shadowViewRegistry->getEventEmitter<react::RNDateTimePickerEventEmitter>(ctx.tag);
        if(eventEmitter == nullptr){
            return;
        }
        switch (getDateEventType(arkJs,ctx.payload)){
            case DateEventType::DATETIME_CHANGE:{
                double positionIn = arkJs.getDouble(arkJs.getObjectProperty(ctx.payload,"timestamp"));
                double offsetIn = arkJs.getDouble(arkJs.getObjectProperty(ctx.payload,"utcOffset"));
                react::RNDateTimePickerEventEmitter::OnChange event = {.timestamp=positionIn, .utcOffset=(int)offsetIn};
                eventEmitter->onChange(event);
                break;
            }
            case DateEventType::DATETIME_PICKERDISMISS:{
//            double pageIndex = arkJs.getDouble(arkJs.getObjectProperty(ctx.payload,"pageIndex"));
                react::RNDateTimePickerEventEmitter::OnPickerDismiss event={};
                eventEmitter->onPickerDismiss(event);
                break;
            }
            default:
                break;
        }
    };
};
} // namespace rnoh



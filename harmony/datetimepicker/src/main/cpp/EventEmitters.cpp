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

#include "EventEmitters.h"

namespace facebook{
    namespace react {

void RNDateTimePickerEventEmitter::onChange(OnChange event) const {
    dispatchEvent("change",[event=std::move(event)](jsi::Runtime &runtime){
        auto payload = jsi::Object(runtime);
        payload.setProperty(runtime,"timestamp",event.timestamp);
        payload.setProperty(runtime,"utcOffset",event.utcOffset);
        return payload;
    });
}
void RNDateTimePickerEventEmitter::onPickerDismiss(OnPickerDismiss event) const{
    dispatchEvent("pickerDismiss",[event=std::move(event)](jsi::Runtime &runtime) {
        auto payload = jsi::Object(runtime);
        return payload;
    });
}

    } //namespace react
} //namespace facebook

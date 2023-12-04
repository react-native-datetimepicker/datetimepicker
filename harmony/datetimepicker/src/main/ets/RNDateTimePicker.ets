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
import {
  Descriptor,
  RNOHContext,
  ViewBaseProps,
  RNViewBase,
  ComponentBuilderContext,
  RNComponentFactory
} from 'rnoh'
import inputMethod from '@ohos.inputMethod';
import Logger from './Logger';

export const DATETIME_PICKER_VIEW_TYPE = "RNDateTimePicker"

export interface  ViewPagerProps extends ViewBaseProps {
  maximumDate: string
  minimumDate: string
  date: string
  locale: string
  minuteInterval: number //
  mode: string
  timeZoneOffsetInMinutes: number //
  timeZoneName: string //
  textColor: string //
  accentColor: string //
  themeVariant: string //
  displayIOS: string 
  enabled: boolean //
  is24Hour: boolean //add 0926
}

export type PickerDescriptor = Descriptor<"RNDateTimePicker", ViewPagerProps>

const TAG:string = "RNDateTimePicker"

@Component
export struct RNDateTimePicker {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (componentBuilderContext: ComponentBuilderContext) => void
  @State descriptor: PickerDescriptor = {} as PickerDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  @State selectDate: Date = new Date()
  @State isMilitaryTime: boolean = false //true=24h制
  @State isLunar: boolean = false //true=显示农历

  aboutToAppear() {

    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<PickerDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as PickerDescriptor)
        Logger.debug(TAG,`[RNOH]: in RNDateTimePicker,descriptor change :${JSON.stringify(this.descriptor.props)}`)
        this.isMilitaryTime = this.descriptor.props.is24Hour
        this.selectDate = new Date(Number.parseInt(this.descriptor.props.date));
      }
    )
    Logger.info(TAG,`[RNOH]: in RNDateTimePicker,propsout :${JSON.stringify(this.descriptor.props)}`)
    this.selectDate = new Date(Number.parseInt(this.descriptor.props.date));
    Logger.debug(TAG,`[RNOH]: RNDateTimePicker,out selectDate :${this.selectDate}`)
    this.isMilitaryTime = this.descriptor.props.is24Hour

  }
  onPageHide() {
    Logger.debug(TAG,`[RNOH]: in RNDateTimePicker,onPageHide`)

  }

  aboutToDisappear() {
    Logger.debug(TAG,`[RNOH]: in RNDateTimePicker,aboutToDisappear`)
    this.onPickerDismiss()
    this.unregisterDescriptorChangesListener?.()
  }

  onDateChange(dateIn: Date) {
    Logger.debug(TAG,`RNOH in PickerView onChange,${JSON.stringify(dateIn)}`)
    let unit = 1000 * 60
    let time = dateIn.getTime()

    //It is the offset in minutes between the selected date and UTC time.
    let offset = time / unit;
    this.ctx.rnInstanceManager.emitComponentEvent(
      this.descriptor.tag,
      DATETIME_PICKER_VIEW_TYPE,
      {
        type: "onChange",
        utcOffset: offset,
        timestamp: time
      }
    );
  }

  onPickerDismiss() {
    Logger.debug(TAG,`RNOH in PickerView onPickerDismiss`)
    this.ctx.rnInstanceManager.emitComponentEvent(
      this.descriptor.tag,
      DATETIME_PICKER_VIEW_TYPE,
      {
        type: "onPickerDismiss"
      }
    );
  }
  //"default" - Automatically pick the best style available for the current platform & mode.
  //"spinner" - the usual pre-iOS 14 appearance with a wheel from which you choose values
  //"compact" - Affects only iOS 14 and later. Will fall back to "spinner" if not supported.
  //"inline"
  build() {
    RNViewBase({ ctx: this.ctx, tag: this.tag }) {
      // RNComponentFactory({ctx:this.ctx,tag:this.tag,buildCustomComponent:this.buildCustomComponent})
      if (this.descriptor.props.mode === "date" || this.descriptor.props.mode === "default") {
        if (this.descriptor.props.displayIOS === "compact" || this.descriptor.props.displayIOS === "inline") {

          CalendarPicker({ hintRadius: 17, selected: this.selectDate })

            .edgeAlign(CalendarAlign.END)
              // .textStyle({color:this.descriptor.props.textColor,font:{size:16,weight:FontWeight.Normal}})
            .textStyle({ color: this.descriptor.props.textColor })
            .enabled(this.descriptor.props.enabled)
            .width("100%").height("100%")
            .onChange((newDate:Date) => {
              Logger.debug(TAG,"CalendarPicker onChange:" + JSON.stringify(newDate))
              //0927验证发现 没有执行回调
              this.selectDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDay())
              this.onDateChange(this.selectDate)
            })
        } else if (this.descriptor.props.displayIOS === "spinner" || this.descriptor.props.displayIOS === "default") {
          DatePicker({
            start: Number.parseInt(this.descriptor.props.minimumDate) != 0 ? new Date(Number.parseInt(this.descriptor.props.minimumDate)) : new Date(1970, 0, 0),
            end:  Number.parseInt(this.descriptor.props.maximumDate) != 0 ? new Date(Number.parseInt(this.descriptor.props.maximumDate)) : new Date(2100, 0, 0),
            selected: this.selectDate
          })
            // .disappearTextStyle({color:Color.Gray,font:{size:'16fp',weight:FontWeight.Bold}})
            // .textStyle({color:'#ff182431',font:{size:'18fp',weight:FontWeight.Normal}})
            // .selectedTextStyle({color:'#ff0000FF',font:{size:'26fp',weight:FontWeight.Regular}})
            .lunar(this.isLunar)
            .enabled(this.descriptor.props.enabled)
            .width("100%").height("100%")
            .onChange((value: DatePickerResult) => {
              this.selectDate.setFullYear(value.year, value.month, value.day)
              Logger.debug(TAG,"DatePicker,select current date is: "+ JSON.stringify(value))
              this.onDateChange(this.selectDate)
            })
        }
      } else if (this.descriptor.props.mode === "time") {
        TimePicker({
          selected: this.selectDate,
        })
          .useMilitaryTime(this.isMilitaryTime)
          .enabled(this.descriptor.props.enabled)
          .onChange((value: TimePickerResult) => {
            this.selectDate.setHours(value.hour, value.minute)
            Logger.debug(TAG,'TimePicker,select current date is: ' + JSON.stringify(value))
            this.onDateChange(this.selectDate)
          })
            // .disappearTextStyle({color:Color.Red,font:{size:15,weight:FontWeight.Lighter}})
            // .textStyle({color:Color.Black,font: {size:20,weight:FontWeight.Normal}})
            // .selectedTextStyle({color:Color.Blue,font:{size:30,weight:FontWeight.Bolder}})
          .width("100%").height("100%")
      }
          // .position({y:this.descriptor.layoutMetrics.frame.origin.y, x:this.descriptor.layoutMetrics.frame.origin.x})

    }
  }
}
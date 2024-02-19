> 模板版本：v0.0.1

<p align="center">
  <h1 align="center"> <code>@react-native-community/datetimepicker</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/react-native-datetimepicker/datetimepicker">
         <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20windows%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
       <a href="https://github.com/react-native-datetimepicker/datetimepicker/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
</p>

## 安装与使用

进入到工程目录并输入以下命令：

<!-- tabs:start -->

**正在 npm 发布中，当前请先从仓库[Release](https://github.com/react-native-oh-library/datetimepicker/releases)中获取库 tgz，通过使用本地依赖来安装本库。**

#### **yarn**

```bash
yarn add xxx
```

#### **npm**

```bash
npm install xxx
```

<!-- tabs:end -->

下面的代码展示了这个库的基本使用场景：

```js
import DateTimePicker from '@react-native-community/datetimepicker';

export const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
     </SafeAreaView>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      <Text>selected: {date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};
```

## Link

目前鸿蒙暂不支持 AutoLink，所以 Link 步骤需要手动配置。

首先需要使用 DevEco Studio 打开项目里的鸿蒙工程 `harmony`

### 引入原生端代码

目前有两种方法：

1. 通过 har 包引入（在 IDE 完善相关功能后该方法会被遗弃，目前首选此方法）；
2. 直接链接源码。

方法一：通过 har 包引入
打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "rnoh": "file:../rnoh",
    "rnoh-datetimepicker": "file:../../node_modules/@react-native-community/datetimepicker/harmony/datetimepicker.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码
打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "rnoh": "file:../rnoh",
   "rnoh-datetimepicker": "file:../../node_modules/@react-native-community/datetimepicker/harmony/datetimepicker"
  }
```

打开终端，执行：

```bash
cd entry
ohpm install --no-link
```

### 配置 CMakeLists 和引入 datetimepicker

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(OH_MODULE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: add_package_subdirectories
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
+ add_subdirectory("${OH_MODULE_DIR}/rnoh-datetimepicker/src/main/cpp" ./datetimepicker)
# RNOH_END: add_package_subdirectories

add_library(rnoh_app SHARED
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)

target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: link_packages
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
+ target_link_libraries(rnoh_app PUBLIC rnoh_datetime_picker)
# RNOH_END: link_packages
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "SamplePackage.h"
+ #include "DateTimePickerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<SamplePackage>(ctx),
+     std::make_shared<DateTimePickerPackage>(ctx)
    };
}
```

### 在 ArkTs 侧引入 DateTimePicker 组件

打开 `entry/src/main/ets/pages/index.ets`，添加：

```diff
import {
  RNApp,
  ComponentBuilderContext,
  RNAbility,
  AnyJSBundleProvider,
  MetroJSBundleProvider,
  ResourceJSBundleProvider,
} from 'rnoh'
import { SampleView, SAMPLE_VIEW_TYPE, PropsDisplayer } from "rnoh-sample-package"
import { createRNPackages } from '../RNPackagesFactory'
+ import { RNDateTimePicker, DATETIME_PICKER_VIEW_TYPE } from "rnoh-datetimepicker"

@Builder
function CustomComponentBuilder(ctx: ComponentBuilderContext) {
  if (ctx.descriptor.type === SAMPLE_VIEW_TYPE) {
    SampleView({
      ctx: ctx.rnohContext,
      tag: ctx.descriptor.tag,
      buildCustomComponent: CustomComponentBuilder
    })
  }
+ else if (ctx.descriptor.type === DATETIME_PICKER_VIEW_TYPE) {
+   RNDateTimePicker({
+     ctx: ctx.rnohContext,
+     tag: ctx.descriptor.tag,
+     buildCustomComponent: CustomComponentBuilder
+   })
+ }
 ...
}
...
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[<@react-native-oh-library/datetimepicker> Releases](https://github.com/react-native-oh-library/datetimepicker/releases/tag/7.6.2-0.0.2)

## 属性

| 名称        | 说明                                                                      | 类型     | 是否必填 | 原库平台                 | 鸿蒙支持                                                   |
| ----------- | ------------------------------------------------------------------------- | -------- | -------- | ------------------------ | ---------------------------------------------------------- |
| mode        | Defines the type of the picker                                            | string   | 否       | All                      | partially (仅支持 date/time 模式)                          |
| style       | Sets style directly on picker component.                                  | object   | 否       | IOS only                 | yes                                                        |
| display     | Defines the visual display of the picker. The default value is "default". | string   | 否       | All                      | partially (支持"default"，"spinner"，"compact"，"inline")  |
| onChange    | Date change handler.                                                      | function | 否       | All                      | partially (仅支持 type 为 set 类型)                        |
| value       | Defines the date or time value used in the component.                     | Date     | 是       | All                      | partially (仅 mode=date 且 display=spinner 时支持动态设置) |
| is24Hour    | Allows changing of the time picker to a 24-hour format.                   | bool     | 否       | Windows and Android only | yes                                                        |
| maximumDate | Defines the maximum date that can be selected                             | Date     | 否       | All                      | partially (仅支持在 mode=date 且 display=spinner 时设置)   |
| minimumDate | Defines the minimum date that can be selected.                            | Date     | 否       | All                      | partially (仅支持在 mode=date 且 display=spinner 时设置)   |
| disabled    | If true, the user won't be able to interact with the view.                | bool     | 否       | IOS only                 | yes                                                        |
| textColor   | Allows changing of the textColor of the date picker.                      | string   | 否       | IOS only                 | partially (仅支持在 mode=date 且 display=compact 时设置)   |

## 遗留问题

- [ ] 部分接口，未适配

## 其他

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/react-native-oh-library/datetimepicker/blob/harmony/LICENSE) ，请自由地享受和参与开源。

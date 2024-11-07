package com.reactcommunity.rndatetimepicker;

import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.annotations.ReactModuleList;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ReactModuleList(
  nativeModules = {
    DatePickerModule.class,
    TimePickerModule.class,
  }
)
public class RNDateTimePickerPackage extends TurboReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(
      new DatePickerModule(reactContext),
      new TimePickerModule(reactContext)
    );
  }

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    switch (name) {
      case DatePickerModule.NAME:
        return new DatePickerModule(reactContext);
      case TimePickerModule.NAME:
        return new TimePickerModule(reactContext);
      default:
        return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();
        Class<? extends NativeModule>[] moduleList = new Class[] {
          DatePickerModule.class,
          TimePickerModule.class,
        };

        for (Class<? extends NativeModule> moduleClass : moduleList) {
          ReactModule reactModule = moduleClass.getAnnotation(ReactModule.class);

          reactModuleInfoMap.put(
            reactModule.name(),
            new ReactModuleInfo(
              reactModule.name(),
              moduleClass.getName(),
              reactModule.canOverrideExistingModule(),
              reactModule.needsEagerInit(),
              reactModule.hasConstants(),
              reactModule.isCxxModule(),
              TurboModule.class.isAssignableFrom(moduleClass)
            )
          );
        }
        return reactModuleInfoMap;
      }
    };
  }
}

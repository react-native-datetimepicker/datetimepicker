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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ReactModuleList(
        nativeModules = {
                DatePickerModule.class,
                TimePickerModule.class,
        })
public class RNDateTimePickerPackage extends TurboReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(DatePickerModule.NAME)) {
      return new DatePickerModule(reactContext);
    } else if (name.equals(TimePickerModule.NAME)) {
      return new TimePickerModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    try {
      Class<?> reactModuleInfoProviderClass =
              Class.forName("com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage$$ReactModuleInfoProvider");
      return (ReactModuleInfoProvider) reactModuleInfoProviderClass.newInstance();
    } catch (ClassNotFoundException e) {
      // ReactModuleSpecProcessor does not run at build-time. Create this ReactModuleInfoProvider by
      // hand.
      return new ReactModuleInfoProvider() {
        @Override
        public Map<String, ReactModuleInfo> getReactModuleInfos() {
          final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();

          Class<? extends NativeModule>[] moduleList =
                  new Class[] {
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
                            TurboModule.class.isAssignableFrom(moduleClass)));
          }

          return reactModuleInfoMap;
        }
      };
    } catch (InstantiationException | IllegalAccessException e) {
      throw new RuntimeException(
              "No ReactModuleInfoProvider for com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage$$ReactModuleInfoProvider", e);
    }
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new DatePickerModule(reactContext));
    modules.add(new TimePickerModule(reactContext));

    return modules;
  }
}

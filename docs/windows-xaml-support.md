# Windows XAML Support for React Native DateTimePicker

## Overview

This document describes the XAML-based implementation for Windows platform using React Native's new architecture (Fabric + TurboModules).

## Implementation Details

### Architecture

The Windows implementation now supports both:
1. **Legacy Architecture**: Using ViewManagers (`DateTimePickerViewManager`, `TimePickerViewManager`)
2. **New Architecture (Fabric + TurboModules)**: 
   - **Fabric Components**: Using XAML Islands with `CalendarDatePicker` control for declarative UI
   - **TurboModules**: Using imperative API similar to Android (`DateTimePickerWindows.open()`)

The implementation automatically selects the appropriate architecture based on the `RNW_NEW_ARCH` compile-time flag.

### Key Components

#### 1. Native Component Spec
- **File**: `src/specs/DateTimePickerNativeComponent.js` (existing cross-platform spec)
- Defines the component interface using React Native's codegen
- Specifies props and events for the component

#### 2. TurboModule Specs
- **DatePicker**: `src/specs/NativeModuleDatePickerWindows.js`
- **TimePicker**: `src/specs/NativeModuleTimePickerWindows.js`
- Follow the same pattern as Android TurboModules
- Provide imperative API for opening pickers programmatically

#### 3. Codegen Headers

**Fabric Component (New Architecture)**:
- **File**: `windows/DateTimePickerWindows/codegen/react/components/DateTimePicker/DateTimePicker.g.h`
- Auto-generated-style header following React Native Windows codegen patterns
- Defines:
  - `DateTimePickerProps`: Component properties
  - `DateTimePickerEventEmitter`: Event handling
  - `BaseDateTimePicker<T>`: Base template class for the component view
  - `RegisterDateTimePickerNativeComponent<T>`: Registration helper

**TurboModules (New Architecture)**:
- **File**: `windows/DateTimePickerWindows/NativeModulesWindows.g.h`
- Defines specs for both DatePicker and TimePicker TurboModules
- Includes parameter structs and result structs
- Follows React Native TurboModule patterns

#### 4. Fabric Implementation
- **Header**: `windows/DateTimePickerWindows/DateTimePickerFabric.h`
- **Implementation**: `windows/DateTimePickerWindows/DateTimePickerFabric.cpp`
- **Component**: `DateTimePickerComponentView`
  - Implements `BaseDateTimePicker<DateTimePickerComponentView>`
  - Uses `Microsoft.UI.Xaml.XamlIsland` to host XAML content
  - Uses `Microsoft.UI.Xaml.Controls.CalendarDatePicker` as the actual picker control

#### 5. TurboModule Implementations

**DatePicker TurboModule**:
- **Header**: `windows/DateTimePickerWindows/DatePickerModuleWindows.h`
- **Implementation**: `windows/DateTimePickerWindows/DatePickerModuleWindows.cpp`
- Provides imperative `open()` and `dismiss()` methods
- Returns promises with selected date or dismissal action

**TimePicker TurboModule**:
- **Header**: `windows/DateTimePickerWindows/TimePickerModuleWindows.h`
- **Implementation**: `windows/DateTimePickerWindows/TimePickerModuleWindows.cpp`
- Provides imperative `open()` and `dismiss()` methods
- Returns promises with selected time or dismissal action

#### 6. Package Provider
- **File**: `windows/DateTimePickerWindows/ReactPackageProvider.cpp`
- Updated to:
  - Register Fabric component when `RNW_NEW_ARCH` is defined
  - Register TurboModules using `AddAttributedModules()` for auto-discovery
  - Register legacy ViewManagers otherwise

#### 7. JavaScript API
- **File**: `src/DateTimePickerWindows.windows.js`
- Provides `DateTimePickerWindows.open()` and `DateTimePickerWindows.dismiss()` methods
- Similar to `DateTimePickerAndroid` API
- Exported from main `index.js` for easy access

### XAML Integration

The Fabric implementation uses **XAML Islands** to host native XAML controls within the Composition-based Fabric renderer:

```cpp
// Initialize XAML Application
winrt::Microsoft::ReactNative::Xaml::implementation::XamlApplication::EnsureCreated();

// Create XamlIsland
m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};

// Create and set XAML control
m_calendarDatePicker = winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker{};
m_xamlIsland.Content(m_calendarDatePicker);

// Connect to Fabric's ContentIsland
islandView.Connect(m_xamlIsland.ContentIsland());
```

### Usage

#### Declarative Component (Fabric)

```javascript
import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker
  value={new Date()}
  mode="date"
  onChange={handleDateChange}
/>
```

#### Imperative API (TurboModules)

```javascript
import {DateTimePickerWindows} from '@react-native-community/datetimepicker';

// Open date picker
DateTimePickerWindows.open({
  value: new Date(),
  mode: 'date',
  minimumDate: new Date(2020, 0, 1),
  maximumDate: new Date(2025, 11, 31),
  onChange: (event, date) => {
    if (event.type === 'set') {
      console.log('Selected date:', date);
    }
  },
  onError: (error) => {
    console.error('Picker error:', error);
  }
});

// Dismiss picker
DateTimePickerWindows.dismiss();
```

### Supported Properties

**Fabric Component** supports:
- `selectedDate`: Current date (milliseconds timestamp)
- `minimumDate`: Minimum selectable date
- `maximumDate`: Maximum selectable date
- `timeZoneOffsetInSeconds`: Timezone offset for date calculations
- `dayOfWeekFormat`: Format string for day of week display
- `dateFormat`: Format string for date display
- `firstDayOfWeek`: First day of the week (0-6)
- `placeholderText`: Placeholder text when no date is selected
- `accessibilityLabel`: Accessibility label for the control

**TurboModule API** supports:
- All the above properties via the `open()` method parameters
- Returns promises with action results (`dateSetAction`, `dismissedAction`)

### Events

**Fabric Component**:
- `onChange`: Fired when the date changes
  - Event payload: `{ newDate: number }` (milliseconds timestamp)

**TurboModule API**:
- Promise-based: Resolves with `{action, timestamp, utcOffset}` for dates
- Or `{action, hour, minute}` for times

### Date/Time Conversion

The implementation includes helper functions to convert between JavaScript timestamps (milliseconds) and Windows `DateTime`:

- `DateTimeFrom(milliseconds, timezoneOffset)`: Converts JS timestamp to Windows DateTime
- `DateTimeToMilliseconds(dateTime, timezoneOffset)`: Converts Windows DateTime to JS timestamp

### Build Configuration

To build with XAML/Fabric/TurboModule support:
1. Ensure `RNW_NEW_ARCH` is defined in your build configuration
2. Include the new Fabric and TurboModule implementation files in your project
3. Link against required XAML libraries

## Comparison with Reference Implementation

This implementation follows the pattern established in the `xaml-calendar-view` sample from the React Native Windows repository (PR #15368), but extends it with TurboModules:

**Similarities**:
- Uses `XamlIsland` for hosting XAML content
- Implements codegen-based component registration
- Uses `ContentIslandComponentView` initializer pattern
- Follows the `BaseXXXX<T>` template pattern

**Extensions**:
- **TurboModule Support**: Added imperative API similar to Android
- **Promise-based API**: Modern async/await pattern for picker operations
- **Comprehensive property set**: Supports all date/time picker scenarios
- **Dual architecture**: Works with both legacy and new architecture

**Differences from Android**:
- Windows uses XAML Islands instead of native Android dialogs
- Different property names for some platform-specific features
- Windows TurboModules registered via `AddAttributedModules()`

## Testing

To test the implementation:

**Legacy Architecture**:
```javascript
import DateTimePicker from '@react-native-community/datetimepicker';
// Use as normal component
```

**New Architecture (Fabric Component)**:
1. Build with `RNW_NEW_ARCH` enabled
2. Use the component declaratively as shown above

**New Architecture (TurboModule API)**:
1. Build with `RNW_NEW_ARCH` enabled
2. Use `DateTimePickerWindows.open()` imperatively

## Future Enhancements

Potential improvements:
- Implement ContentDialog/Flyout for better picker presentation
- Add support for date range pickers
- Implement state management for complex scenarios
- Add more XAML-specific styling properties
- Performance optimizations for rapid prop updates
- Custom themes and styling support

## References

- [React Native Windows New Architecture](https://microsoft.github.io/react-native-windows/docs/new-architecture)
- [React Native TurboModules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [XAML Islands Overview](https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/xaml-islands)
- [Sample CalendarView PR #15368](https://github.com/microsoft/react-native-windows/pull/15368)

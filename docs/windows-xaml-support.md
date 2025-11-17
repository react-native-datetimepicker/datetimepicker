# Windows XAML Support for React Native DateTimePicker

## Overview

This document describes the XAML-based implementation for Windows platform using React Native's new architecture (Fabric).

## Implementation Details

### Architecture

The Windows implementation now supports both:
1. **Legacy Architecture**: Using ViewManagers (`DateTimePickerViewManager`, `TimePickerViewManager`)
2. **New Architecture (Fabric)**: Using XAML Islands with `CalendarDatePicker` control

The implementation automatically selects the appropriate architecture based on the `RNW_NEW_ARCH` compile-time flag.

### Key Components

#### 1. Native Component Spec
- **File**: `src/specs/DateTimePickerNativeComponent.js` (existing cross-platform spec)
- Defines the component interface using React Native's codegen
- Specifies props and events for the component

#### 2. Codegen Header (New Architecture)
- **File**: `windows/DateTimePickerWindows/codegen/react/components/DateTimePicker/DateTimePicker.g.h`
- Auto-generated-style header following React Native Windows codegen patterns
- Defines:
  - `DateTimePickerProps`: Component properties
  - `DateTimePickerEventEmitter`: Event handling
  - `BaseDateTimePicker<T>`: Base template class for the component view
  - `RegisterDateTimePickerNativeComponent<T>`: Registration helper

#### 3. Fabric Implementation
- **Header**: `windows/DateTimePickerWindows/DateTimePickerFabric.h`
- **Implementation**: `windows/DateTimePickerWindows/DateTimePickerFabric.cpp`
- **Component**: `DateTimePickerComponentView`
  - Implements `BaseDateTimePicker<DateTimePickerComponentView>`
  - Uses `Microsoft.UI.Xaml.XamlIsland` to host XAML content
  - Uses `Microsoft.UI.Xaml.Controls.CalendarDatePicker` as the actual picker control

#### 4. Package Provider
- **File**: `windows/DateTimePickerWindows/ReactPackageProvider.cpp`
- Updated to:
  - Register Fabric component when `RNW_NEW_ARCH` is defined
  - Register legacy ViewManagers otherwise

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

### Supported Properties

The XAML-based implementation supports:
- `selectedDate`: Current date (milliseconds timestamp)
- `minimumDate`: Minimum selectable date
- `maximumDate`: Maximum selectable date
- `timeZoneOffsetInSeconds`: Timezone offset for date calculations
- `dayOfWeekFormat`: Format string for day of week display
- `dateFormat`: Format string for date display
- `firstDayOfWeek`: First day of the week (0-6)
- `placeholderText`: Placeholder text when no date is selected
- `accessibilityLabel`: Accessibility label for the control

### Events

- `onChange`: Fired when the date changes
  - Event payload: `{ newDate: number }` (milliseconds timestamp)

### Date/Time Conversion

The implementation includes helper functions to convert between JavaScript timestamps (milliseconds) and Windows `DateTime`:

- `DateTimeFrom(milliseconds, timezoneOffset)`: Converts JS timestamp to Windows DateTime
- `DateTimeToMilliseconds(dateTime, timezoneOffset)`: Converts Windows DateTime to JS timestamp

### Build Configuration

To build with XAML/Fabric support:
1. Ensure `RNW_NEW_ARCH` is defined in your build configuration
2. Include the new Fabric implementation files in your project
3. Link against required XAML libraries

## Comparison with Reference Implementation

This implementation follows the pattern established in the `xaml-calendar-view` sample from the React Native Windows repository (PR #15368):

**Similarities**:
- Uses `XamlIsland` for hosting XAML content
- Implements codegen-based component registration
- Uses `ContentIslandComponentView` initializer pattern
- Follows the `BaseXXXX<T>` template pattern

**Differences**:
- Adapted for `CalendarDatePicker` instead of `CalendarView`
- Includes timezone offset handling
- Supports more comprehensive property set for date picker scenarios
- Integrated into existing legacy architecture with compile-time switching

## Testing

To test the XAML implementation:
1. Build with `RNW_NEW_ARCH` enabled
2. Use the component as usual in your React Native app
3. The XAML-based picker should render instead of the legacy implementation

## Future Enhancements

Potential improvements:
- Add support for `TimePicker` with XAML Islands
- Implement state management for complex scenarios
- Add more XAML-specific styling properties
- Performance optimizations for rapid prop updates

## References

- [React Native Windows New Architecture](https://microsoft.github.io/react-native-windows/docs/new-architecture)
- [XAML Islands Overview](https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/xaml-islands)
- [Sample CalendarView PR #15368](https://github.com/microsoft/react-native-windows/pull/15368)

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include <winrt/Windows.Foundation.h>

namespace winrt::DateTimePicker::Helpers {

/// <summary>
/// Converts Unix timestamp (milliseconds) to Windows::Foundation::DateTime.
/// </summary>
/// <param name="timeInMilliseconds">Time in milliseconds since Unix epoch</param>
/// <param name="timeZoneOffsetInSeconds">Timezone offset in seconds to apply</param>
/// <returns>Windows DateTime object</returns>
winrt::Windows::Foundation::DateTime DateTimeFrom(int64_t timeInMilliseconds, int64_t timeZoneOffsetInSeconds);

/// <summary>
/// Converts Windows::Foundation::DateTime to Unix timestamp (milliseconds).
/// </summary>
/// <param name="dateTime">Windows DateTime object</param>
/// <param name="timeZoneOffsetInSeconds">Timezone offset in seconds to apply</param>
/// <returns>Time in milliseconds since Unix epoch</returns>
int64_t DateTimeToMilliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds);

} // namespace winrt::DateTimePicker::Helpers

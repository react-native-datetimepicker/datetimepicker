// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"
#include "DateTimeHelpers.h"

namespace winrt::DateTimePicker::Helpers {

winrt::Windows::Foundation::DateTime DateTimeFrom(int64_t timeInMilliseconds, int64_t timeZoneOffsetInSeconds) {
  const auto timeInSeconds = timeInMilliseconds / 1000;
  time_t ttWithTimeZoneOffset = static_cast<time_t>(timeInSeconds) + timeZoneOffsetInSeconds;
  winrt::Windows::Foundation::DateTime dateTime = winrt::clock::from_time_t(ttWithTimeZoneOffset);
  return dateTime;
}

int64_t DateTimeToMilliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds) {
  const time_t ttInSeconds = winrt::clock::to_time_t(dateTime);
  auto timeInUtc = ttInSeconds - timeZoneOffsetInSeconds;
  auto ttInMilliseconds = static_cast<int64_t>(timeInUtc) * 1000;
  return ttInMilliseconds;
}

} // namespace winrt::DateTimePicker::Helpers

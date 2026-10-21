/**
 * Custom state to store frameSize that the component descriptor will use to modify the
 * shadow node layout.
 */

#pragma once

#if __has_include(<React/Graphics.h>)
#include <React/Graphics.h>
#else
#include <react/renderer/graphics/Geometry.h>
#endif

namespace facebook {
namespace react {

class RNDateTimePickerState final {
  public:
    using Shared = std::shared_ptr<const RNDateTimePickerState>;
    RNDateTimePickerState(){};
    RNDateTimePickerState(Size frameSize_) : frameSize(frameSize_){};
    
    Size frameSize{};
};

} // namespace react
} // namespace facebook

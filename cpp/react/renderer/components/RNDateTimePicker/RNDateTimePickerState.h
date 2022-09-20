#pragma once

#include <react/renderer/graphics/Geometry.h>

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

const isAndroid = () => device.getPlatform() === 'android';
const isIOS = () => device.getPlatform() === 'ios';
const wait = async (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

const Platform = {
  select: (objectWithPlatformKeys) => {
    const platform = device.getPlatform();
    if (typeof objectWithPlatformKeys[platform] === 'function') {
      return objectWithPlatformKeys[platform]();
    } else {
      return objectWithPlatformKeys[platform];
    }
  },
};

module.exports = {
  isAndroid,
  isIOS,
  wait,
  Platform,
};

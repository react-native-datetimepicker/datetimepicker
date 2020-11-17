const isAndroid = () => device.getPlatform() === 'android';
const isIOS = () => device.getPlatform() === 'ios';
const wait = async (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

module.exports = {
  isAndroid,
  isIOS,
  wait,
};

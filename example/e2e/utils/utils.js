const isAndroid = () => device.getPlatform() === 'android';
const isIOS = () => device.getPlatform() === 'ios';

module.exports = {
  isAndroid,
  isIOS,
};

const getTimeText = () => element(by.id('timeText'));
const getDateText = () => element(by.id('dateText'));
const elementById = (id) => element(by.id(id));
const elementByText = (text) => element(by.text(text));
const getDateTimePickerIOS = () =>
  element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));
const getDatePickerAndroid = () =>
  element(by.type('android.widget.DatePicker'));

module.exports = {
  getTimeText,
  getDateText,
  elementById,
  elementByText,
  getDateTimePickerIOS,
  getDatePickerAndroid,
};

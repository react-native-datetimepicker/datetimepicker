const elementById = (id) => element(by.id(id));
const elementByText = (text) => element(by.text(text));

const getDateTimePickerIOS = () =>
  element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

const getInlineTimePickerIOS = () => element(by.label('Time Picker'));

const getDateTimePickerControlIOS = () => element(by.type('UIDatePicker'));

const getDatePickerAndroid = () => element(by.id('dateTimePicker'));

module.exports = {
  elementById,
  elementByText,
  getDateTimePickerIOS,
  getDateTimePickerControlIOS,
  getDatePickerAndroid,
  getInlineTimePickerIOS,
};

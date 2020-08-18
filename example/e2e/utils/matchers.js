const getTimeText = () => element(by.id('timeText'));
const getDateText = () => element(by.id('dateText'));
const elementById = (id) => element(by.id(id));
const elementByText = (text) => element(by.text(text));

module.exports = {
  getTimeText,
  getDateText,
  elementById,
  elementByText,
};

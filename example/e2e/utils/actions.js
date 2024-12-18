const {elementById} = require('./matchers');

async function userChangesTimeValue(
  {hours, minutes} = {hours: undefined, minutes: undefined},
) {
  const keyboardIconButton = element(
    by.type('androidx.appcompat.widget.AppCompatImageButton'),
  );

  await keyboardIconButton.tap();

  if (minutes !== undefined) {
    const minuteTextinput = element(
      by.type('androidx.appcompat.widget.AppCompatEditText'),
    ).atIndex(1);

    await minuteTextinput.replaceText(String(minutes));
  }
  if (hours !== undefined) {
    const hourTextinput = element(
      by.type('androidx.appcompat.widget.AppCompatEditText'),
    ).atIndex(0);

    await hourTextinput.replaceText(String(hours));
  }
}

async function userOpensPicker({
  mode,
  display,
  interval,
  tzOffsetPreset,
  firstDayOfWeek,
}) {
  await elementById('DateTimePickerScrollView').scrollTo('top');

  await element(by.text(mode)).tap();
  await element(by.text(display)).atIndex(0).tap();
  if (interval) {
    await element(by.text(String(interval))).tap();
  }
  if (tzOffsetPreset) {
    await elementById('DateTimePickerScrollView').scrollTo('bottom');
    await element(by.text(tzOffsetPreset)).tap();
    await elementById('DateTimePickerScrollView').scrollTo('top');
  }
  if (firstDayOfWeek) {
    await element(by.id(firstDayOfWeek)).tap();
  }
  await elementById('DateTimePickerScrollView').scrollTo('bottom');
  await element(by.id('showPickerButton')).tap();
}

async function userTapsCancelButtonAndroid() {
  // selecting element by text does not work consistently :/
  const cancelButton = element(by.text('Cancel'));
  // const cancelButton = element(
  //   by
  //     .type('androidx.appcompat.widget.AppCompatButton')
  //     .withAncestor(by.type('android.widget.ScrollView')),
  // ).atIndex(0);
  await cancelButton.tap();
}
async function userTapsOkButtonAndroid() {
  // selecting element by text does not work consistently :/
  const okButton = element(by.text('OK'));
  // const okButton = element(
  //   by
  //     .type('androidx.appcompat.widget.AppCompatButton')
  //     .withAncestor(by.type('android.widget.ScrollView')),
  // ).atIndex(1);
  await okButton.tap();
}

async function userSwipesTimezoneListUntilDesiredIsVisible(timeZone) {
  await waitFor(elementById(timeZone))
    .toBeVisible()
    .whileElement(by.id('timezone'))
    .scroll(200, 'right');
}

// Helper function to select a day in the calendar
// A negative number xPos and yPos means we go left and up respectively
// A positive number xPos and yPos means we go right and down respectively
async function userSelectsDayInCalendar(uiDevice, {xPos, yPos}) {
  for (let i = 0; i < Math.abs(yPos); i++) {
    yPos < 0 ? await uiDevice.pressDPadUp(i) : await uiDevice.pressDPadDown(i);
  }
  for (let j = 0; j < Math.abs(xPos); j++) {
    xPos < 0
      ? await uiDevice.pressDPadLeft(j)
      : await uiDevice.pressDPadRight(j);
  }
  await uiDevice.pressEnter();
}

async function userDismissesCompactDatePicker() {
  await element(by.type('_UIDatePickerContainerView')).tap();
}

module.exports = {
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
  userChangesTimeValue,
  userSelectsDayInCalendar,
  userSwipesTimezoneListUntilDesiredIsVisible,
  userDismissesCompactDatePicker,
};

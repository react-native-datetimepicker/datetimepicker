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
  await element(by.text(mode)).tap();
  await element(by.text(display)).tap();
  if (interval) {
    await element(by.text(String(interval))).tap();
  }
  if (tzOffsetPreset) {
    await elementById('DateTimePickerScrollView').scrollTo('bottom');
    await element(by.text(tzOffsetPreset)).tap();
    await elementById('DateTimePickerScrollView').scrollTo('top');
  }
  if (firstDayOfWeek) {
    await element(by.text(firstDayOfWeek)).tap();
  }
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

module.exports = {
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
  userChangesTimeValue,
};

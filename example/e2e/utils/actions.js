async function userChangesMinuteValue() {
  const keyboardIconButton = element(
    by.type('androidx.appcompat.widget.AppCompatImageButton'),
  );

  await keyboardIconButton.tap();

  const minuteTextinput = element(
    by.type('androidx.appcompat.widget.AppCompatEditText'),
  ).atIndex(1);

  await minuteTextinput.replaceText('30');
}

async function userOpensPicker({mode, display, interval}) {
  await element(by.text(mode)).tap();
  await element(by.text(display)).tap();
  if (interval) {
    await element(by.text(String(interval))).tap();
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
  userChangesMinuteValue,
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
};

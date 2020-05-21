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

describe('Example', () => {
  beforeEach(async () => {
    if (global.device.getPlatform() === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({newInstance: true});
    }
  });

  it('should have title and hermes indicator on android', async () => {
    await expect(element(by.id('appRootView'))).toBeVisible();
    await expect(element(by.text('Example DateTime Picker'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await expect(element(by.id('hermesIndicator'))).toExist();
    }
  });

  it('should show date picker after tapping datePicker button', async () => {
    element(by.id('datePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.DatePicker'))).toBeVisible();
    }
  });

  it('Nothing should happen if date doesn`t change', async () => {
    element(by.id('datePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      testElement.swipe('left', 'fast', '100');
      testElement.tapAtPoint({x: 50, y: 200});
      element(by.text('CANCEL')).tap();
    }

    await expect(dateTimeText).toHaveText('08/21/2020');
  });

  it('should update dateTimeText when date changes', async () => {
    element(by.id('datePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      testElement.setColumnToValue(0, 'November');
      testElement.setColumnToValue(1, '3');
      testElement.setColumnToValue(2, '1800');

      await expect(dateTimeText).toHaveText('11/03/1800');
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      testElement.swipe('left', 'fast', '100');
      testElement.tapAtPoint({x: 50, y: 200});
      element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('09/13/2020');
    }
  });

  it('should show time picker after tapping timePicker button', async () => {
    element(by.id('timePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
    }
  });

  it('Nothing should happen if time doesn`t change', async () => {
    element(by.id('timePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      await userChangesMinuteValue();
      await element(by.text('CANCEL')).tap();
    }

    await expect(dateTimeText).toHaveText('23:15');
  });

  it('should change time text when time changes', async () => {
    element(by.id('timePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      testElement.setColumnToValue(0, '2');
      testElement.setColumnToValue(1, '44');
      testElement.setColumnToValue(2, 'PM');

      await expect(dateTimeText).toHaveText('14:44');
    } else {
      await userChangesMinuteValue();
      await element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('23:30');
    }
  });

  it("shouldn't change time text when time changes to less than half of minuteInterval", async () => {
    element(by.id('timePickerIntervalButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      testElement.setColumnToValue(0, '2');
      testElement.setColumnToValue(1, '42');
      testElement.setColumnToValue(2, 'PM');

      await expect(dateTimeText).toHaveText('14:40');
    } else {
      const keyboardButton = element(
        by.type('androidx.appcompat.widget.AppCompatImageButton'),
      );
      keyboardButton.tap();
      const testElement = element(
        by
          .type('androidx.appcompat.widget.AppCompatEditText')
          .and(by.text('15')),
      );
      testElement.tap();
      testElement.replaceText('17');
      element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('23:15');
    }
  });

  it('should change time text when time changes to more than half of minuteInterval', async () => {
    element(by.id('timePickerIntervalButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      testElement.setColumnToValue(0, '2');
      testElement.setColumnToValue(1, '44');
      testElement.setColumnToValue(2, 'PM');

      await expect(dateTimeText).toHaveText('14:45');
    } else {
      const keyboardButton = element(
        by.type('androidx.appcompat.widget.AppCompatImageButton'),
      );
      keyboardButton.tap();
      const testElement = element(
        by
          .type('androidx.appcompat.widget.AppCompatEditText')
          .and(by.text('15')),
      );
      testElement.tap();
      testElement.replaceText('18');
      element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('23:20');
    }
  });

  it('should correct input on the fly on android', async () => {
    element(by.id('timePickerIntervalButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() !== 'ios') {
      const keyboardButton = element(
        by.type('androidx.appcompat.widget.AppCompatImageButton'),
      );
      keyboardButton.tap();

      element(
        by
          .type('androidx.appcompat.widget.AppCompatEditText')
          .and(by.text('15')),
      ).tap();
      element(
        by
          .type('androidx.appcompat.widget.AppCompatEditText')
          .and(by.text('15')),
      ).tapBackspaceKey();
      element(
        by
          .type('androidx.appcompat.widget.AppCompatEditText')
          .and(by.text('1')),
      ).typeText('8');

      await expect(
        element(
          by
            .type('androidx.appcompat.widget.AppCompatEditText')
            .and(by.text('18')),
        ),
      ).toExist();

      element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('23:20');
    }
  });
});

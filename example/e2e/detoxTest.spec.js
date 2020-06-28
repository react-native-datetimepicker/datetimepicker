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
    await waitFor(element(by.text('Example DateTime Picker')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should have title and hermes indicator on android', async () => {
    await expect(element(by.text('Example DateTime Picker'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await expect(element(by.id('hermesIndicator'))).toExist();
    }
  });

  it('should show date picker after tapping datePicker button', async () => {
    await element(by.id('datePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.DatePicker'))).toBeVisible();
    }
  });

  it('Nothing should happen if date does not change', async () => {
    await element(by.id('datePickerButton')).tap();
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
      await testElement.swipe('left', 'fast', '100');
      await testElement.tapAtPoint({x: 50, y: 200});
      await element(by.text('CANCEL')).tap();
    }

    await expect(dateTimeText).toHaveText('08/21/2020');
  });

  it('should update dateTimeText when date changes', async () => {
    await element(by.id('datePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      await testElement.setColumnToValue(0, 'November');
      await testElement.setColumnToValue(1, '3');
      await testElement.setColumnToValue(2, '1800');

      await expect(dateTimeText).toHaveText('11/03/1800');
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      await testElement.swipe('left', 'fast', '100');
      await testElement.tapAtPoint({x: 50, y: 200});
      await element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('09/13/2020');
    }
  });

  it('should show time picker after tapping timePicker button', async () => {
    await element(by.id('timePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(
        element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))),
      ).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
    }
  });

  it('Nothing should happen if time does not change', async () => {
    await element(by.id('timePickerButton')).tap();
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
    await element(by.id('timePickerButton')).tap();
    const dateTimeText = element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(1, '44');
      await testElement.setColumnToValue(2, 'PM');

      await expect(dateTimeText).toHaveText('14:44');
    } else {
      await userChangesMinuteValue();
      await element(by.text('OK')).tap();

      await expect(dateTimeText).toHaveText('23:30');
    }
  });

  describe.only('given 5-minute interval', () => {
    beforeEach(async () => {
      await element(by.id('timePickerDefaultIntervalButton')).tap();
    });
    it(':android: picker should correct 18-minute selection to 20-minute one', async () => {
      const keyboardButton = element(
        by.type('androidx.appcompat.widget.AppCompatImageButton'),
      );
      await keyboardButton.tap();
      const testElement = element(
        by.type('androidx.appcompat.widget.AppCompatEditText'),
      ).atIndex(1);
      await testElement.tap();
      await testElement.replaceText('18');
      await element(by.text('OK')).tap();

      const dateTimeText = element(by.id('dateTimeText'));
      await expect(dateTimeText).toHaveText('23:20');
    });

    it(':ios: picker should offer only options divisible by 5 (0, 5, 10,...)', async () => {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(2, 'PM');
      const dateTimeText = element(by.id('dateTimeText'));

      await expect(dateTimeText).toHaveText('14:15');

      try {
        await testElement.setColumnToValue(1, '18');
      } catch (err) {
        if (
          err.message.includes('UIPickerView does not contain desired value')
        ) {
          await testElement.setColumnToValue(1, '45');
        }
      }

      await expect(dateTimeText).toHaveText('14:45');
    });

    // TODO android spinner
  });
});

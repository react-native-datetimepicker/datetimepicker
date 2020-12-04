const {
  getTimeText,
  getDateText,
  elementById,
  elementByText,
  getDateTimePickerIOS,
  getDatePickerAndroid,
} = require('./utils/matchers');
const {
  userChangesMinuteValue,
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
} = require('./utils/actions');
const {isAndroid, isIOS, wait} = require('./utils/utils');

describe('Example', () => {
  beforeEach(async () => {
    if (isIOS()) {
      await device.reloadReactNative();
    } else {
      await device.launchApp({newInstance: true});
    }
    await waitFor(elementByText('Example DateTime Picker'))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should have title and hermes indicator on android', async () => {
    await expect(elementByText('Example DateTime Picker')).toBeVisible();
    if (isAndroid()) {
      await expect(elementById('hermesIndicator')).toExist();
    }
  });

  it('should show date picker after tapping datePicker button', async () => {
    await userOpensPicker({mode: 'date', display: 'default'});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await expect(getDatePickerAndroid()).toBeVisible();
    }
  });

  it('nothing should happen if date does not change', async () => {
    await userOpensPicker({mode: 'date', display: 'default'});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      await testElement.swipe('left', 'fast', '100');
      await testElement.tapAtPoint({x: 50, y: 200});
      await userTapsCancelButtonAndroid();
    }

    const dateText = getDateText();
    await expect(dateText).toHaveText('08/21/2020');
  });

  it('should update dateTimeText when date changes', async () => {
    await userOpensPicker({mode: 'date', display: 'default'});
    const dateText = getDateText();

    if (isIOS()) {
      const testElement = getDateTimePickerIOS();
      await testElement.setColumnToValue(0, 'November');
      await testElement.setColumnToValue(1, '3');
      await testElement.setColumnToValue(2, '1800');

      await expect(dateText).toHaveText('11/03/1800');
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      await testElement.swipe('left', 'fast', '100');
      await testElement.tapAtPoint({x: 50, y: 200});
      await userTapsOkButtonAndroid();

      await expect(dateText).toHaveText('09/13/2020');
    }
  });

  it('should show time picker after tapping timePicker button', async () => {
    await userOpensPicker({mode: 'time', display: 'default'});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
    }
  });

  it('nothing should happen if time does not change', async () => {
    await userOpensPicker({mode: 'time', display: 'default'});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await userChangesMinuteValue();
      await userTapsCancelButtonAndroid();
    }
    const timeText = getTimeText();
    await expect(timeText).toHaveText('23:15');
  });

  it('should change time text when time changes', async () => {
    await userOpensPicker({mode: 'time', display: 'default'});
    const timeText = getTimeText();

    if (isIOS()) {
      const testElement = getDateTimePickerIOS();
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(1, '44');
      await testElement.setColumnToValue(2, 'PM');

      await expect(timeText).toHaveText('14:44');
    } else {
      await userChangesMinuteValue();
      await userTapsOkButtonAndroid();

      await expect(timeText).toHaveText('23:30');
    }
  });

  it(':android: given we specify neutralButtonLabel, tapping the corresponding button sets date to the beginning of the unix time epoch', async () => {
    await elementById('neutralButtonLabelTextInput').typeText('clear');
    await userOpensPicker({mode: 'time', display: 'default'});
    await elementByText('clear').tap();

    const dateText = getDateText();
    await expect(dateText).toHaveText('01/01/1970');
  });

  it(':android: when component unmounts, dialog is dismissed', async () => {
    await elementById('showAndDismissPickerButton').tap();
    await wait(2000);
    await expect(getDatePickerAndroid()).toBeVisible();
    await wait(5000);

    await expect(getDatePickerAndroid()).toNotExist();
  });

  describe('given 5-minute interval', () => {
    it(':android: clock picker should correct 18-minute selection to 20-minute one', async () => {
      try {
        await userOpensPicker({mode: 'time', display: 'clock', interval: 5});

        const keyboardButton = element(
          by.type('androidx.appcompat.widget.AppCompatImageButton'),
        );
        await keyboardButton.tap();
        const testElement = element(
          by.type('androidx.appcompat.widget.AppCompatEditText'),
        ).atIndex(1);
        await testElement.tap();
        await testElement.replaceText('18');
        await userTapsOkButtonAndroid();

        const timeText = getTimeText();
        await expect(timeText).toHaveText('23:20');
      } catch (err) {
        console.error(err);
      }
    });

    it(':android: when the picker is shown as "spinner", swiping it down changes selected time', async () => {
      try {
        const timeText = getTimeText();

        await expect(timeText).toHaveText('23:15');

        await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

        const minutePicker = element(
          by.type('android.widget.NumberPicker'),
        ).atIndex(1);
        await minutePicker.swipe('up', 'slow', '33');
        await userTapsOkButtonAndroid();

        await expect(timeText).toHaveText('23:25');
      } catch (err) {
        console.error(err);
      }
    });

    it(':ios: picker should offer only options divisible by 5 (0, 5, 10,...)', async () => {
      await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

      const testElement = getDateTimePickerIOS();
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(2, 'PM');
      const timeText = getTimeText();

      await expect(timeText).toHaveText('14:15');

      const valueThatShouldNotBePresented = '18';
      try {
        await testElement.setColumnToValue(1, valueThatShouldNotBePresented);
      } catch (err) {
        if (
          err.message.includes('UIPickerView does not contain desired value')
        ) {
          await testElement.setColumnToValue(1, '45');
        } else {
          throw new Error(
            'because time interval of 5 minutes was set, Picker should not contain value ' +
              valueThatShouldNotBePresented +
              ' but it was displayed in the list.',
          );
        }
      }

      await expect(timeText).toHaveText('14:45');
    });
  });
});

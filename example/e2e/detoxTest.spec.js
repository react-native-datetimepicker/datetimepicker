const {
  getTimeText,
  getDateText,
  elementById,
  elementByText,
  getDateTimePickerIOS,
  getDatePickerAndroid,
  getDateTimePickerControlIOS,
  getInlineTimePickerIOS,
} = require('./utils/matchers');
const {
  userChangesTimeValue,
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
  userDismissesCompactDatePicker,
} = require('./utils/actions');
const {isIOS, wait, Platform} = require('./utils/utils');
const {device} = require('detox');

describe('Example', () => {
  const getPickerDisplay = () => {
    return isIOS() ? 'spinner' : 'default';
  };

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

  it('timeInfo heading has expected content', async () => {
    await expect(elementById('timeInfo')).toHaveText(
      'TZ: Europe/Prague, TZOffset: -1 original: 11/13/2021 11:00',
    );
  });

  it('should show date picker after tapping datePicker button', async () => {
    await userOpensPicker({mode: 'date', display: getPickerDisplay()});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await expect(getDatePickerAndroid()).toBeVisible();
    }
  });

  it('nothing should happen if date does not change', async () => {
    if (isIOS()) {
      await userOpensPicker({mode: 'date', display: 'compact'});

      await element(
        by.traits(['staticText']).withAncestor(by.label('Date Picker')),
      ).tap();
      // 'label' maps to 'description' in view hierarchy debugger
      const nextMonthArrow = element(by.label('Next Month'));

      await nextMonthArrow.tap();
      await nextMonthArrow.tap();
      await userDismissesCompactDatePicker();
    } else {
      await userOpensPicker({mode: 'date', display: 'default'});
      const calendarHorizontalScrollView = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      await calendarHorizontalScrollView.swipe('left', 'fast', 1);
      await calendarHorizontalScrollView.tap({x: 50, y: 200});
      await userTapsCancelButtonAndroid();
    }

    await expect(getDateText()).toHaveText('11/13/2021');
  });

  it('should update dateTimeText when date changes', async () => {
    await userOpensPicker({mode: 'date', display: getPickerDisplay()});

    if (isIOS()) {
      const testElement = getDateTimePickerControlIOS();
      await testElement.setDatePickerDate('2021-11-02', 'yyyy-MM-dd');
    } else {
      const uiDevice = device.getUiDevice();
      const focusSecondOfNovemberInCalendar = async () => {
        await uiDevice.pressDPadDown();
        await uiDevice.pressDPadDown();
        await uiDevice.pressDPadDown();
      };
      await focusSecondOfNovemberInCalendar();

      await uiDevice.pressEnter();

      await userTapsOkButtonAndroid();
    }
    await expect(getDateText()).toHaveText('11/02/2021');
  });

  it('should show time picker after tapping timePicker button', async () => {
    const display = await Platform.select({
      ios: 'inline',
      android: 'default',
    });
    await userOpensPicker({mode: 'time', display});

    if (isIOS()) {
      await expect(getInlineTimePickerIOS()).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
    }
  });

  it('nothing should happen if time does not change', async () => {
    await userOpensPicker({mode: 'time', display: getPickerDisplay()});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await userChangesTimeValue({minutes: '22'});
      await userTapsCancelButtonAndroid();
    }
    await expect(getTimeText()).toHaveText('11:00');
  });

  it('should change time text when time changes', async () => {
    await userOpensPicker({mode: 'time', display: getPickerDisplay()});

    if (isIOS()) {
      const testElement = getDateTimePickerControlIOS();
      // TODO
      await testElement.setDatePickerDate('15:44', 'HH:mm');
    } else {
      await userChangesTimeValue({hours: 15, minutes: 44});
      await userTapsOkButtonAndroid();
    }
    await expect(getTimeText()).toHaveText('15:44');
  });

  describe('time zone offset', () => {
    it.skip('should update dateTimeText when date changes and set setTzOffsetInMinutes to 0', async () => {
      // skip for now, there is a bug on android https://github.com/react-native-datetimepicker/datetimepicker/issues/528
      await expect(getDateText()).toHaveText('11/13/2021');
      await expect(getTimeText()).toHaveText('11:00');
      if (isIOS()) {
        await userOpensPicker({
          mode: 'date',
          display: 'spinner',
          tzOffsetPreset: 'setTzOffsetToZero',
        });
        const testElement = getDateTimePickerIOS();
        await testElement.setColumnToValue(0, 'November');
        await testElement.setColumnToValue(1, '14');
        await testElement.setColumnToValue(2, '2021');
      } else {
        await userOpensPicker({
          mode: 'date',
          display: 'default',
          tzOffsetPreset: 'setTzOffsetToZero',
        });
        await userTapsOkButtonAndroid();
      }
      await expect(getDateText()).toHaveText('11/14/2021');
      await expect(getTimeText()).toHaveText('11:00');
    });

    it('setTz should change time text when setTzOffsetInMinutes is 120 minutes', async () => {
      await element(by.id('DateTimePickerScrollView')).scrollTo('bottom');
      await userOpensPicker({
        mode: 'time',
        display: getPickerDisplay(),
        tzOffsetPreset: 'setTzOffset',
      });

      if (isIOS()) {
        const testElement = getDateTimePickerIOS();
        await testElement.setColumnToValue(0, '10');
        await testElement.setColumnToValue(1, '30');
        await testElement.setColumnToValue(2, 'AM');
      } else {
        await userChangesTimeValue({hours: '10', minutes: '30'});
        await userTapsOkButtonAndroid();
      }
      await expect(getTimeText()).toHaveText('09:30');
    });
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
    await wait(1000);
    await expect(getDatePickerAndroid()).toExist();
    await wait(6000);

    await expect(getDatePickerAndroid()).not.toExist();
  });

  describe('given 5-minute interval', () => {
    it(':android: clock picker should correct 18-minute selection to 20-minute one', async () => {
      try {
        await userOpensPicker({mode: 'time', display: 'clock', interval: 5});

        await userChangesTimeValue({hours: '23', minutes: '18'});

        await userTapsOkButtonAndroid();

        await expect(getTimeText()).toHaveText('23:20');
      } catch (err) {
        console.error(err);
      }
    });

    it(':android: when the picker is shown as "spinner", swiping it down changes selected time', async () => {
      const timeText = getTimeText();

      await expect(timeText).toHaveText('11:00');

      await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

      const minutePicker = element(
        by.type('android.widget.NumberPicker'),
      ).atIndex(1);
      await minutePicker.swipe('up', 'slow', 0.33);
      await userTapsOkButtonAndroid();

      await expect(timeText).toHaveText('11:15');
    });

    it(':ios: picker should offer only options divisible by 5 (0, 5, 10,...)', async () => {
      await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

      const testElement = getDateTimePickerIOS();
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(1, '15');
      await testElement.setColumnToValue(2, 'PM');
      const timeText = getTimeText();

      await expect(timeText).toHaveText('14:15');

      const valueThatShouldNotBePresented = '18';
      try {
        await testElement.setColumnToValue(1, valueThatShouldNotBePresented);
      } catch (err) {
        if (err.message.includes('does not contain value')) {
          await testElement.setColumnToValue(1, '45');
        } else {
          throw new Error(
            'because time interval of 5 minutes was set, Picker should not contain value ' +
              valueThatShouldNotBePresented +
              ' but it was displayed in the list.' +
              err,
          );
        }
      }

      await expect(timeText).toHaveText('14:45');
    });
  });
});

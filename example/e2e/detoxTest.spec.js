const {
  elementById,
  elementByText,
  getDateTimePickerIOS,
  getDatePickerAndroid,
  getDateTimePickerControlIOS,
  getInlineTimePickerIOS,
  getDatePickerButtonIOS,
} = require('./utils/matchers');
const {
  userChangesTimeValue,
  userOpensPicker,
  userTapsCancelButtonAndroid,
  userTapsOkButtonAndroid,
  userSelectsDayInCalendar,
  userSwipesTimezoneListUntilDesiredIsVisible,
} = require('./utils/actions');
const {isIOS, isAndroid, wait, Platform} = require('./utils/utils');
const {device} = require('detox');
const {describe} = require('jest-circus');
const {
  assertTimeLabels,
  assertInitialTimeLabels,
} = require('./utils/assertions');

describe('e2e tests', () => {
  const getPickerDisplay = () => {
    return isIOS() ? 'spinner' : 'default';
  };

  beforeAll(async () => {
    if (isIOS()) {
      await device.launchApp({newInstance: true});
    }
  }, 300000);

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
    await assertInitialTimeLabels();
    await expect(elementById('deviceTzName')).toHaveText('Europe/Prague');
    await expect(elementById('overriddenTzName')).toHaveText('Europe/Prague');
  });

  it('should show date picker after tapping datePicker button', async () => {
    await userOpensPicker({mode: 'date', display: getPickerDisplay()});

    if (isIOS()) {
      await expect(getDateTimePickerIOS()).toBeVisible();
    } else {
      await expect(getDatePickerAndroid()).toBeVisible();
    }
  });

  it('nothing should happen if date picker is dismissed / cancelled', async () => {
    await userOpensPicker({mode: 'date', display: 'default'});

    if (isIOS()) {
      await getDatePickerButtonIOS().tap();

      // 'label' maps to 'description' in view hierarchy debugger
      const nextMonthArrow = element(by.label('Next Month'));

      await nextMonthArrow.tap();
      await nextMonthArrow.tap();
      await getDatePickerButtonIOS().tap();
    } else {
      const calendarHorizontalScrollView = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.id('dateTimePicker')),
      );
      await calendarHorizontalScrollView.swipe('left', 'fast', 1);
      await calendarHorizontalScrollView.tap({x: 50, y: 200});
      await userTapsCancelButtonAndroid();
    }

    await elementByText('great').tap();
    await assertInitialTimeLabels();
  });

  it('should update dateTimeText when date changes', async () => {
    await userOpensPicker({mode: 'date', display: getPickerDisplay()});

    const targetDate = '2021-11-02T01:00:00Z';
    if (isIOS()) {
      const testElement = getDateTimePickerControlIOS();
      await testElement.setDatePickerDate(targetDate, 'ISO8601');
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

    await assertTimeLabels({
      utcTime: targetDate,
      deviceTime: '2021-11-02T02:00:00+01:00',
    });
  });

  it('should show time picker after tapping timePicker button', async () => {
    const display = Platform.select({
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
      await elementByText('great').tap();
    }
    await assertInitialTimeLabels();
  });

  it('should change time text when time changes', async () => {
    await userOpensPicker({mode: 'time', display: getPickerDisplay()});

    if (isIOS()) {
      const testElement = getDateTimePickerControlIOS();
      // TODO
      await testElement.setDatePickerDate('2021-11-13T14:44:00Z', 'ISO8601');
    } else {
      await userChangesTimeValue({hours: 15, minutes: 44});
      await userTapsOkButtonAndroid();
    }

    await assertTimeLabels({
      utcTime: '2021-11-13T14:44:00Z',
      deviceTime: '2021-11-13T15:44:00+01:00',
    });
  });

  describe('IANA time zone', () => {
    it('should show utcTime, deviceTime, overriddenTime correctly', async () => {
      await assertInitialTimeLabels();

      await expect(elementById('overriddenTzName')).toHaveText('Europe/Prague');

      let timeZone = 'America/Vancouver';
      await waitFor(elementById('timezone')).toBeVisible().withTimeout(1000);
      await userSwipesTimezoneListUntilDesiredIsVisible(timeZone);

      if (isAndroid()) {
        timeZone = timeZone.toUpperCase();
      }

      await waitFor(elementByText(timeZone)).toBeVisible().withTimeout(1000);

      await elementByText(timeZone).multiTap(2);

      await assertTimeLabels({
        utcTime: '2021-11-13T01:00:00Z',
        deviceTime: '2021-11-13T02:00:00+01:00',
        overriddenTime: '2021-11-12T17:00:00-08:00',
      });

      await expect(elementById('overriddenTzName')).toHaveText(
        'America/Vancouver',
      );
    });

    it('daylight saving should work properly', async () => {
      let timeZone = 'America/Vancouver';
      await waitFor(elementById('timezone')).toBeVisible().withTimeout(1000);
      await userSwipesTimezoneListUntilDesiredIsVisible(timeZone);

      if (isAndroid()) {
        timeZone = timeZone.toUpperCase();
      }

      await waitFor(elementByText(timeZone)).toBeVisible().withTimeout(1000);

      await elementByText(timeZone).multiTap(2);

      await userOpensPicker({mode: 'date', display: getPickerDisplay()});

      if (isIOS()) {
        const testElement = getDateTimePickerControlIOS();

        await testElement.setDatePickerDate('2021-03-14T10:00:00Z', 'ISO8601');
      } else {
        const uiDevice = device.getUiDevice();

        // Ensure you can't select yesterday (Android)
        const focusFourteenthOfMarchInCalendar = async () => {
          for (let i = 0; i < 3; i++) {
            await uiDevice.pressDPadDown();
          }

          await uiDevice.pressDPadUp();

          for (let i = 0; i < 8; i++) {
            await uiDevice.pressEnter();
          }

          for (let i = 0; i < 2; i++) {
            await uiDevice.pressDPadDown();
          }
        };
        await focusFourteenthOfMarchInCalendar();
        await uiDevice.pressEnter();
        await userTapsOkButtonAndroid();

        await userOpensPicker({mode: 'time', display: getPickerDisplay()});
        await userChangesTimeValue({hours: '2', minutes: '0'});
        await userTapsOkButtonAndroid();
      }

      await assertTimeLabels({
        utcTime: '2021-03-14T10:00:00Z',
        deviceTime: '2021-03-14T11:00:00+01:00',
        overriddenTime: '2021-03-14T03:00:00-07:00',
      });
    });
  });

  describe('time zone offset', () => {
    it('should update dateTimeText when date changes and set setTzOffsetInMinutes to 0', async () => {
      await assertInitialTimeLabels();

      let tzOffsetPreset = '0 mins';

      if (isIOS()) {
        await userOpensPicker({
          mode: 'date',
          display: 'spinner',
          tzOffsetPreset,
        });
      } else {
        tzOffsetPreset = tzOffsetPreset.toUpperCase();
        await userOpensPicker({
          mode: 'date',
          display: 'default',
          tzOffsetPreset,
        });
        await userTapsOkButtonAndroid();
      }
      await expect(elementById('overriddenTime')).toHaveText(
        '2021-11-13T01:00:00Z',
      );
    });

    it('setTz should change time text when setTzOffsetInMinutes is 120 minutes', async () => {
      await elementById('DateTimePickerScrollView').scrollTo('bottom');

      let tzOffsetPreset = '+120 mins';
      if (isAndroid()) {
        tzOffsetPreset = tzOffsetPreset.toUpperCase();
      }

      await userOpensPicker({
        mode: 'time',
        display: getPickerDisplay(),
        tzOffsetPreset,
      });

      if (isIOS()) {
        const testElement = getDateTimePickerIOS();
        await testElement.setColumnToValue(0, '7');
        await testElement.setColumnToValue(1, '30');
        await testElement.setColumnToValue(2, 'AM');
      } else {
        await userChangesTimeValue({hours: '7', minutes: '30'});
        await userTapsOkButtonAndroid();
      }
      await assertTimeLabels({
        utcTime: '2021-11-13T05:30:00Z',
        deviceTime: '2021-11-13T06:30:00+01:00',
        overriddenTime: '2021-11-13T07:30:00+02:00',
      });
    });

    it('should let you pick tomorrow but not yesterday when setting min/max', async () => {
      await elementById('DateTimePickerScrollView').scrollTo('bottom');
      await elementById('setMinMax').tap();

      if (isIOS()) {
        const testElement = getDateTimePickerControlIOS();

        // Ensure you can't select yesterday (iOS)
        await testElement.setDatePickerDate('2021-11-12T01:00:00Z', 'ISO8601');

        await expect(elementById('utcTime')).toHaveText('2021-11-13T00:00:00Z');

        // Ensure you can select tomorrow (iOS)
        await userOpensPicker({mode: 'date', display: getPickerDisplay()});
        await testElement.setDatePickerDate('2021-11-14T01:00:00Z', 'ISO8601');
      } else {
        const uiDevice = device.getUiDevice();

        // Ensure you can't select yesterday (Android)
        const focusTwelveOfNovemberInCalendar = async () => {
          for (let i = 0; i < 4; i++) {
            await uiDevice.pressDPadDown();
          }
          for (let i = 0; i < 3; i++) {
            await uiDevice.pressDPadRight();
          }
        };
        await focusTwelveOfNovemberInCalendar();
        await uiDevice.pressEnter();
        await userTapsOkButtonAndroid();

        await assertTimeLabels({
          utcTime: '2021-11-13T01:00:00Z',
          deviceTime: '2021-11-13T02:00:00+01:00',
          overriddenTime: '2021-11-13T01:00:00Z',
        });

        // Ensure you can select tomorrow (Android)
        await userOpensPicker({mode: 'date', display: getPickerDisplay()});
        const focusFourteenthOfNovemberInCalendar = async () => {
          for (let i = 0; i < 5; i++) {
            await uiDevice.pressDPadDown();
          }
          for (let i = 0; i < 2; i++) {
            await uiDevice.pressDPadLeft();
          }
        };
        await focusFourteenthOfNovemberInCalendar();
        await uiDevice.pressEnter();
        await userTapsOkButtonAndroid();
      }

      await assertTimeLabels({
        utcTime: '2021-11-14T01:00:00Z',
        deviceTime: '2021-11-14T02:00:00+01:00',
        overriddenTime: '2021-11-14T01:00:00Z',
      });
    });
  });

  it(':android: given we specify neutralButtonLabel, tapping the corresponding button sets date to the beginning of the unix time epoch', async () => {
    await elementById('neutralButtonLabelTextInput').typeText('clear');
    await userOpensPicker({mode: 'time', display: 'default'});
    await elementByText('clear').tap();

    await assertTimeLabels({
      utcTime: '1970-01-01T00:00:00Z',
      deviceTime: '1970-01-01T01:00:00+01:00',
    });
  });

  it(':android: when component unmounts, dialog is dismissed', async () => {
    await elementById('showAndDismissPickerButton').tap();
    await waitFor(getDatePickerAndroid()).toExist().withTimeout(4000);
    await wait(6000);

    await expect(getDatePickerAndroid()).not.toExist();
  });

  describe('given 5-minute interval', () => {
    it(':android: clock picker should correct 18-minute selection to 20-minute one', async () => {
      await userOpensPicker({mode: 'time', display: 'clock', interval: 5});

      await userChangesTimeValue({hours: '23', minutes: '18'});

      await userTapsOkButtonAndroid();

      await assertTimeLabels({
        utcTime: '2021-11-13T22:20:00Z',
        deviceTime: '2021-11-13T23:20:00+01:00',
      });
    });

    it(':android: when the picker is shown as "spinner", swiping it down changes selected time', async () => {
      await assertTimeLabels({
        utcTime: '2021-11-13T01:00:00Z',
        deviceTime: '2021-11-13T02:00:00+01:00',
      });

      await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

      const minutePicker = element(
        by.type('android.widget.NumberPicker'),
      ).atIndex(1);
      await minutePicker.swipe('up', 'slow', 0.33);
      await userTapsOkButtonAndroid();

      await assertTimeLabels({
        utcTime: '2021-11-13T01:15:00Z',
        deviceTime: '2021-11-13T02:15:00+01:00',
      });
    });

    it(':ios: picker should offer only options divisible by 5 (0, 5, 10,...)', async () => {
      await userOpensPicker({mode: 'time', display: 'spinner', interval: 5});

      const testElement = getDateTimePickerIOS();
      await testElement.setColumnToValue(0, '2');
      await testElement.setColumnToValue(1, '15');
      await testElement.setColumnToValue(2, 'PM');

      await assertTimeLabels({
        utcTime: '2021-11-13T13:15:00Z',
        deviceTime: '2021-11-13T14:15:00+01:00',
      });

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

      await assertTimeLabels({
        utcTime: '2021-11-13T13:45:00Z',
        deviceTime: '2021-11-13T14:45:00+01:00',
      });
    });
  });

  describe(':android: firstDayOfWeek functionality', () => {
    it.each([
      {
        firstDayOfWeekIn: 'Sunday',
        selectDayPositions: {xPosIn: -2, yPosIn: 4},
      },
      {
        firstDayOfWeekIn: 'Tuesday',
        selectDayPositions: {xPosIn: 3, yPosIn: 3},
      },
    ])(
      ':android: picker should have $firstDayOfWeekIn as firstDayOfWeek and select Sunday date',
      async ({firstDayOfWeekIn, selectDayPositions}) => {
        const targetDate = '2021-11-07T01:00:00Z';
        const targetDateWithTZ = '2021-11-07T02:00:00+01:00';

        await userOpensPicker({
          mode: 'date',
          display: getPickerDisplay(),
          firstDayOfWeek: firstDayOfWeekIn,
        });
        await expect(getDatePickerAndroid()).toBeVisible();

        const uiDevice = device.getUiDevice();
        await userSelectsDayInCalendar(uiDevice, {
          xPos: selectDayPositions.xPosIn,
          yPos: selectDayPositions.yPosIn,
        });

        await userTapsOkButtonAndroid();

        await expect(elementById('firstDayOfWeek')).toHaveText(
          firstDayOfWeekIn,
        );

        await assertTimeLabels({
          utcTime: targetDate,
          deviceTime: targetDateWithTZ,
        });
      },
    );
  });
});

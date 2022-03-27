/**
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {Text, Button} from 'react-native';
import RNDateTimePicker, {DateTimePickerAndroid} from '../src/index';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {createDateTimeSetEvtParams} from '../src/index';
import {
  mockAndroidDialogDateChange,
  mockAndroidDialogDismissal,
} from '../jest/mockEventTriggers';

function TestAppWithComponent() {
  const [date, setDate] = React.useState<?Date>();

  return (
    <>
      <RNDateTimePicker
        value={new Date(0)}
        onChange={(evt, selectedDate) => {
          setDate(selectedDate);
        }}
      />
      <Text>{String(date?.toLocaleString())}</Text>
      <Text>{String((date?.getTime() ?? 0) / 1000)}</Text>
    </>
  );
}

const AppWithImperativePicker = () => {
  const [date, setDate] = useState(new Date(0));

  const onChange = (event, selectedDate) => {
    selectedDate && setDate(selectedDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      display: 'default',
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const time = date?.getTime();
  return (
    <>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Text>selected: {date.toLocaleString()}</Text>
      <Text>{String(time)}</Text>
    </>
  );
};
const renderPickerComponent = async () => {
  const utils = render(<TestAppWithComponent />);

  await waitFor(() => utils.UNSAFE_getByType(RNDateTimePicker));
  return utils;
};
describe('userland tests', () => {
  it('rendering RNDateTimePicker and calling fireEvent, triggers onChange (platform-agnostic)', async () => {
    const date = new Date(156e10);

    const {UNSAFE_getByType, getByText} = await renderPickerComponent();

    fireEvent(
      UNSAFE_getByType(RNDateTimePicker),
      'onChange',
      ...createDateTimeSetEvtParams(date),
    );
    getByText('1560000000');
  });

  describe("when using android picker's imperative api, we can simulate", () => {
    it('the date being changed', async () => {
      const {getByText} = render(<AppWithImperativePicker />);

      const newSelectedDate = new Date(0);
      const february = 1;
      newSelectedDate.setFullYear(2022, february, 1);
      const nowAsString = newSelectedDate.getTime().toString();

      mockAndroidDialogDateChange(newSelectedDate);
      fireEvent.press(getByText('Show date picker!'));

      await waitFor(() => getByText(nowAsString));
    });

    it('the picker being dismissed', async () => {
      const {getByText} = render(<AppWithImperativePicker />);

      mockAndroidDialogDismissal();
      fireEvent.press(getByText('Show date picker!'));

      await waitFor(() => getByText('0'));
    });
  });
});

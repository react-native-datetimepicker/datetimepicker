/* eslint-disable jest/expect-expect */
/**
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {Text, Button} from 'react-native';
// in your code, import from '@react-native-community/datetimepicker'
import DateTimePicker from '../src/index';
// $FlowExpectedError: complains about import path
import {DateTimePickerAndroid} from '../src/DateTimePickerAndroid.android';

// $FlowExpectedError: module treated as any
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {createDateTimeSetEvtParams} from '../src/index';
import {mockAndroidDialogDateChange, mockAndroidDialogDismissal} from '../jest';

function TestAppWithComponent() {
  const [date, setDate] = React.useState<?Date>();

  return (
    <>
      <DateTimePicker
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

  await waitFor(() => utils.UNSAFE_getByType(DateTimePicker));
  return utils;
};

describe('userland tests', () => {
  it("rendering DateTimePicker and calling fireEvent triggers the picker's onChange callback (platform-agnostic)", async () => {
    const date = new Date(156e10);

    const {UNSAFE_getByType, getByText} = await renderPickerComponent();

    fireEvent(
      UNSAFE_getByType(DateTimePicker),
      'onChange',
      ...createDateTimeSetEvtParams(date, 0),
    );
    getByText('1560000000');
  });

  describe('when using android imperative api, we can simulate', () => {
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

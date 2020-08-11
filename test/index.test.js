import React from 'react';
import DatePicker from '../src/index.js';
import RNDateTimePickerIOS from '../src/picker.ios';
import AndroidDateTimePicker from '../src/datetimepicker.android';
import {render, fireEvent, waitFor} from '@testing-library/react-native';

const DATE = 1376949600000;

const renderPicker = async (props) => {
  const utils = render(<DatePicker value={new Date(DATE)} {...props} />);
  await waitFor(() => utils.UNSAFE_getByType(DatePicker));
  return utils;
};

describe('DatePicker', () => {
  it('renders a native Component', async () => {
    const {toJSON} = await renderPicker({});

    expect(toJSON()).toMatchSnapshot();
  });

  it('will pass timestamp to native Component', async () => {
    const date = new Date(156e10);
    const {toJSON} = await renderPicker({
      value: date,
    });

    expect(toJSON()).toHaveProperty('props.date', date.getTime());
  });

  it('calls onChange callback', async () => {
    expect.assertions(4);
    const date = new Date(156e10);

    function onChange(event, dateArg) {
      expect(event).toHaveProperty('type', 'event');
      expect(event).toHaveProperty('nativeEvent');
      expect(event.nativeEvent).toHaveProperty('timestamp', date.getTime());
      expect(dateArg).toEqual(date);
    }
    const {UNSAFE_getByType} = await renderPicker({onChange});

    fireEvent(UNSAFE_getByType(RNDateTimePickerIOS), 'onChange', {
      type: 'event',
      nativeEvent: {
        timestamp: date.getTime(),
      },
    });
  });

  it('has default mode `date`', () => {
    expect(DatePicker.defaultProps.mode).toEqual('date');
  });

  it.each([['time'], ['datetime'], ['countdown']])(
    'renders with mode %s',
    async (mode) => {
      const {toJSON} = await renderPicker({
        mode,
      });
      expect(toJSON()).toMatchSnapshot();
    },
  );

  it.each([
    [{}, 'A date or time should be specified as `value`.'],
    [
      {display: 'calendar', mode: 'time', value: new Date()},
      'display: calendar and mode: time cannot be used together.',
    ],
    [
      {display: 'clock', mode: 'date', value: new Date()},
      'display: clock and mode: date cannot be used together.',
    ],
  ])(
    'AndroidDateTimePicker throws when invalid props are passed',
    (props, expected) => {
      expect(() => AndroidDateTimePicker(props)).toThrow(expected);
    },
  );

  it('applies styling to DatePicker', async () => {
    const style = {backgroundColor: 'red'};
    const {toJSON} = await renderPicker({
      style,
    });
    const snapshot = toJSON();
    expect(snapshot).toHaveProperty('props.style', [
      {height: 216},
      {backgroundColor: 'red'},
    ]);
    expect(snapshot).toMatchSnapshot();
  });
});

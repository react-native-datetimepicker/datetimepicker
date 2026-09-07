import React from 'react';
import RNDateTimePickerIOS from '../src/datetimepicker.ios';
import RNDateTimePickerWindows, {
  RNDateTimePickerWindows as NativeDateTimePickerWindows,
} from '../src/datetimepicker.windows';
import RNDateTimePickerAndroid from '../src/datetimepicker.android';
import {DateTimePickerAndroid} from '../src/DateTimePickerAndroid.android';
import NativeDateTimePickerIOS from '../src/picker.ios';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {EVENT_TYPE_SET} from '../src/constants';

import * as moduleExports from '../src/index';

const DATE = 1376949600000;

const renderPicker = async (Component, props) => {
  const utils = render(<Component value={new Date(DATE)} {...props} />);
  await waitFor(() => utils.UNSAFE_getByType(Component));
  return utils;
};

describe('DateTimePicker', () => {
  it('namedExports have the expected shape', () => {
    expect(moduleExports).toMatchSnapshot();
  });

  describe.each([RNDateTimePickerIOS, RNDateTimePickerAndroid])(
    'given a component for android / iOS',
    (Component) => {
      it('renders a component (iOS) / null (android)', async () => {
        const {toJSON} = await renderPicker(Component);

        expect(toJSON()).toMatchSnapshot();
      });

      it.each([
        [{value: 'bogus'}, '`value` prop must be an instance of Date object'],
        [{}, 'A date or time must be specified as `value` prop'],
      ])('throws when invalid props are passed', (props, expected) => {
        expect(() => Component(props)).toThrow(expected);
      });
    },
  );

  describe('AndroidDateTimePicker', () => {
    it.each([
      [
        {display: 'calendar', mode: 'time', value: new Date()},
        'display: calendar and mode: time cannot be used together.',
      ],
      [
        {display: 'clock', mode: 'date', value: new Date()},
        'display: clock and mode: date cannot be used together.',
      ],
    ])('throws when invalid props %s are passed', (props, expected) => {
      expect(() => RNDateTimePickerAndroid(props)).toThrow(expected);
    });

    it.each([
      [
        {
          value: new Date('2023-06-15'),
          minimumDate: new Date('2023-12-31'),
          maximumDate: new Date('2023-01-01'),
        },
        'DateTimePicker: minimumDate (2023-12-31T00:00:00.000Z) is after maximumDate (2023-01-01T00:00:00.000Z). Ensure minimumDate < maximumDate.',
      ],
      [
        {
          value: new Date(DATE),
          timeZoneName: 'Europe/Prague',
          timeZoneOffsetInMinutes: 60,
        },
        '`timeZoneName` and `timeZoneOffsetInMinutes` cannot be specified at the same time',
      ],
    ])(
      'runs the shared prop validation on %s, in both the component and the imperative api',
      (props, expected) => {
        expect(() => DateTimePickerAndroid.open(props)).toThrow(expected);
        expect(() => RNDateTimePickerAndroid(props)).toThrow(expected);
      },
    );
    
    it('reopens the picker when the design changes', () => {
      const open = jest
        .spyOn(DateTimePickerAndroid, 'open')
        .mockImplementation(() => {});
      jest
        .spyOn(DateTimePickerAndroid, 'dismiss')
        .mockImplementation(() => Promise.resolve(true));

      const {rerender} = render(
        <RNDateTimePickerAndroid value={new Date(DATE)} design="default" />,
      );
      rerender(
        <RNDateTimePickerAndroid value={new Date(DATE)} design="material" />,
      );

      expect(open.mock.calls.map(([params]) => params.design)).toEqual([
        'default',
        'material',
      ]);

      jest.restoreAllMocks();
    });
  });

  describe('RNDateTimePickerIOS', () => {
    it('will pass timestamp to native Component', async () => {
      const date = new Date(156e10);
      const {toJSON} = await renderPicker(RNDateTimePickerIOS, {
        value: date,
      });

      expect(toJSON()).toHaveProperty('props.date', date.getTime());
    });
  });

  test.each([
    [RNDateTimePickerIOS, NativeDateTimePickerIOS, 'timestamp'],
    [RNDateTimePickerWindows, NativeDateTimePickerWindows, 'newDate'],
  ])(
    'fireEvent calls onChange callback for %s',
    async (ExportedComponent, NativeBackingComponent, timestampKeyName) => {
      expect.assertions(2);
      const date = new Date(156e10);

      function onChange(event, dateArg) {
        expect(event).toEqual({
          type: EVENT_TYPE_SET,
          nativeEvent: expect.objectContaining({
            timestamp: date.getTime(),
          }),
        });
        expect(dateArg).toEqual(date);
      }
      const {UNSAFE_getByType} = await renderPicker(ExportedComponent, {
        onChange,
      });

      fireEvent(UNSAFE_getByType(NativeBackingComponent), 'onChange', {
        nativeEvent: {
          [timestampKeyName]: date.getTime(),
        },
      });
    },
  );
});

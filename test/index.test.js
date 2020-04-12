import renderer from 'react-test-renderer';
import DatePicker from '../src/index.js';
import AndroidDateTimePicker from '../src/datetimepicker.android';
import React from 'react';

describe('DatePicker', () => {
  const DATE = 1376949600000;

  it('renders a native Component', () => {
    const tree = renderer
      .create(<DatePicker value={new Date(DATE)} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('will pass timestamp to native Component', () => {
    const date = new Date(156e10);
    const tree = renderer.create(<DatePicker value={date} />).toJSON();

    expect(tree).toHaveProperty('props.date', date.getTime());
  });

  it('calls onChange callback', () => {
    const date = new Date(156e10);

    function onChange(event, dateArg) {
      expect(event).toHaveProperty('type', 'event');
      expect(event).toHaveProperty('nativeEvent');
      expect(event.nativeEvent).toHaveProperty('timestamp', date.getTime());
      expect(dateArg).toEqual(date);
    }

    renderer
      .create(<DatePicker value={date} onChange={onChange} />)
      .getInstance()
      ._onChange({
        type: 'event',
        nativeEvent: {
          timestamp: date.getTime(),
        },
      });
  });

  it('has default mode `date`', () => {
    expect(DatePicker.defaultProps.mode).toEqual('date');
  });

  it('renders with mode `time`', () => {
    const tree = renderer
      .create(<DatePicker value={new Date(DATE)} mode="time" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders with mode `datetime` (iOS only)', () => {
    const tree = renderer
      .create(<DatePicker value={new Date(DATE)} mode="datetime" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('has reference to picker', () => {
    expect(new DatePicker()._picker).toBeDefined();
  });

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

  it('applies styling to DatePicker', () => {
    const style = {backgroundColor: 'red'};
    const tree = renderer
      .create(<DatePicker style={style} value={new Date(DATE)} />)
      .toJSON();

    expect(tree).toHaveProperty('props.style', [
      {height: 216},
      {backgroundColor: 'red'},
    ]);
    expect(tree).toMatchSnapshot();
  });
});

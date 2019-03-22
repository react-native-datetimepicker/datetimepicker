import DatePickerAndroid from './datepicker';
import TimePickerAndroid from './timepicker';
import React, { Component } from 'react';

const selectors = {
  time: TimePickerAndroid,
  date: DatePickerAndroid,
};

class RNDateTimePicker extends Component {
  render() {
    const { mode, value } = this.props;
    const Selector = selectors[mode];
    const {action, year, month, day} = Selector.open({
      date: value,
    });

    /*if (action !== DatePickerAndroid.dismissedAction) {
    }*/

    return null;
  }
}

const styles = {};

export {
  RNDateTimePicker as default,
  styles,
};

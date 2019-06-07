import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, Platform} from 'react-native';
import DateTimePicker from 'react-native-datetimepicker';

type Props = {};
export default class App extends Component<Props> {
  state = {
    date: new Date(1598051730000),
    mode: 'date',
    show: false,
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  }

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  datepicker = () => {
    this.show('date');
  }

  timepicker = () => {
    this.show('time');
  }

  mmddyyyy = (date) => {
    var yyyy = date.getUTCFullYear();
    var mm = date.getUTCMonth() < 9 ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1); // getUTCMonth() is zero-based
    var dd  = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();
    return ''.concat(mm).concat('/').concat(dd).concat('/').concat(yyyy);
  }

  hhmm = (date) => {
    var hh = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
    var min = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
    return ''.concat(hh).concat(':').concat(min);
  }

  render() {
    const { show, date, mode } = this.state;

    return (
      <View testID="appRootView" style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Example DateTime Picker</Text>
        </View>
        <View style={styles.button}>
          <Button testID="datePickerButton" onPress={this.datepicker} title="Show date picker!" />
        </View>
        <View style={styles.button}>
          <Button testID="timePickerButton" onPress={this.timepicker} title="Show time picker!" />
        </View>
        <View style={styles.header}>
          <Text testID="dateTimeText" style={styles.dateTimeText}>
            { mode === 'time' && this.hhmm(date) }
            { mode === 'date' && this.mmddyyyy(date) }
          </Text>
        </View>
        { show && <DateTimePicker testID="dateTimePicker" timeZoneOffsetInMinutes={0} value={date} mode={mode} is24Hour={true} display="default" onChange={this.setDate} /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
});

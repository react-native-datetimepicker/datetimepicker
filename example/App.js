import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, Platform} from 'react-native';
import DateTimePicker from 'react-native-datetimepicker';

type Props = {};
export default class App extends Component<Props> {
  state = {
    date: new Date('August 21, 2020 23:15:30 UTC'),
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

  render() {
    const { show, date, mode } = this.state;

    return (
      <View testID='appRootView' style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Example DateTime Picker</Text>
        </View>
        <View style={styles.button}>
          <Button testID='datePickerButton' onPress={this.datepicker} title="Show date picker!" />
        </View>
        <View style={styles.button}>
          <Button testID='timePickerButton' onPress={this.timepicker} title="Show time picker!" />
        </View>
        <View style={styles.header}>
          <Text testID='dateTimeText' style={styles.dateTimeText}>
            { mode === 'time' && date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: true }) }
            { mode === 'date' && date.toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }) }
          </Text>
        </View>
        { show && <DateTimePicker testID='dateTimePicker' timeZoneOffsetInMinutes={0} value={date} mode={mode} is24Hour={true} display="default" onChange={this.setDate} /> }
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

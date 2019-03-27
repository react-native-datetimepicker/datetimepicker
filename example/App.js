import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import DateTimePicker from 'react-native-datetimepicker';

type Props = {};
export default class App extends Component<Props> {
  state = {
    date: new Date('2020-06-12T12:42:42'),
    mode: 'date',
    show: false,
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: false,
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Example DateTime Picker</Text>
        </View>
        <View style={styles.button}>
          <Button onPress={this.datepicker} title="Show date picker!" />
        </View>
        <View style={styles.button}>
          <Button onPress={this.timepicker} title="Show time picker!" />
        </View>
        { show && <DateTimePicker value={date} mode={mode} is24Hour={true} display="default" onChange={this.setDate} /> }
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
});

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DatePicker from 'react-native-datetimepicker';

type Props = {};
export default class App extends Component<Props> {
  state = {
    date: new Date(),
  }

  setDate = date => {
    this.setState({date});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Example DateTime Picker</Text>
        </View>
        <DatePicker value={this.state.date} onDateChange={this.setDate} />
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

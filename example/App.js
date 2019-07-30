import {SafeAreaView, ScrollView, StyleSheet, View, Text, StatusBar, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Header,Colors} from 'react-native/Libraries/NewAppScreen';
import React, {Fragment, Component} from 'react';
import moment from 'moment';

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

  render() {
    const { show, date, mode } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
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
                    { mode === 'time' && moment.utc(date).format('HH:mm') }
                    { mode === 'date' && moment.utc(date).format('MM/DD/YYYY') }
                  </Text>
                </View>
                { show && <DateTimePicker testID="dateTimePicker" timeZoneOffsetInMinutes={0} value={date} mode={mode} is24Hour={true} display="default" onChange={this.setDate} /> }
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  container: {
    marginTop: 32,
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

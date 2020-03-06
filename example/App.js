import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import React, {useState} from 'react';
import moment from 'moment';

const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState('default');
  const [interval, setMinInterval] = useState(undefined);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
    setMinInterval(undefined);
  };

  const showDatepicker = () => {
    showMode('date');
    setDisplay('default');
  };

  const showDatepickerSpinner = () => {
    showMode('date');
    setDisplay('spinner');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showTimepickerWithInterval = () => {
    showMode('time');
    setDisplay('spinner');
    setMinInterval(5);
  };

  return (
    <>
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
                <Button
                  testID="datePickerButton"
                  onPress={showDatepicker}
                  title="Show date picker default!"
                />
              </View>
              <View style={styles.button}>
                <Button
                  testID="datePickerButton"
                  onPress={showDatepickerSpinner}
                  title="Show date picker spinner!"
                />
              </View>
              <View style={styles.button}>
                <Button
                  testID="timePickerButton"
                  onPress={showTimepicker}
                  title="Show time picker!"
                />
              </View>
              <View style={styles.button}>
                <Button
                  testID="timePickerIntervalButton"
                  onPress={showTimepickerWithInterval}
                  title="Show time picker (with 5 min interval)!"
                />
              </View>
              <View style={styles.header}>
                <Text testID="dateTimeText" style={styles.dateTimeText}>
                  {mode === 'time' && moment.utc(date).format('HH:mm')}
                  {mode === 'date' && moment.utc(date).format('MM/DD/YYYY')}
                </Text>
              </View>
              {show && (
                <DateTimePicker
                  minuteInterval={interval}
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={date}
                  mode={mode}
                  is24Hour
                  display={display}
                  onChange={onChange}
                  style={styles.iOsPicker}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

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
  iOsPicker: {
    flex: 1,
  },
});

export default App;

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import React, {useState} from 'react';
import {Picker} from 'react-native-windows';
import moment from 'moment';
import {DAY_OF_WEEK} from '../src/constants';

const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [color, setColor] = useState();
  const [display, setDisplay] = useState('default');

  // Windows-specific
  const [maxDate, setMinDate] = useState(new Date('2021'));
  const [minDate, setMaxDate] = useState(new Date('2018'));
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DAY_OF_WEEK.Monday);
  const [dateFormat, setDateFormat] = useState('longdate');
  const [dayOfWeekFormat, setDayOfWeekFormat] = useState(
    '{dayofweek.abbreviated(2)}',
  );

  const handleResetPress = () => {
    setDate(undefined);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
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
    setDisplay('default');
  };

  const showTimepickerSpinner = () => {
    showMode('time');
    setDisplay('spinner');
  };

  if (Platform.OS !== 'windows') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal !== null && (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View testID="appRootView" style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.text}>Example DateTime Picker</Text>
                </View>
                <View style={styles.header}>
                  <Text style={{margin: 10, flex: 1}}>
                    text color (iOS only)
                  </Text>
                  <TextInput
                    value={color}
                    style={{height: 60, flex: 1}}
                    onChangeText={text => {
                      setColor(text.toLowerCase());
                    }}
                    placeholder="color"
                  />
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
                    testID="datePickerButtonSpinner"
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
                    testID="timePickerButtonSpinner"
                    onPress={showTimepickerSpinner}
                    title="Show time picker spinner!"
                  />
                </View>
                <View style={styles.header}>
                  <Text testID="dateTimeText" style={styles.dateTimeText}>
                    {mode === 'time' && moment.utc(date).format('HH:mm')}
                    {mode === 'date' && moment.utc(date).format('MM/DD/YYYY')}
                  </Text>
                  <Button
                    testID="hidePicker"
                    onPress={() => setShow(false)}
                    title="hide picker"
                  />
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    is24Hour
                    display={display}
                    onChange={onChange}
                    style={styles.iOsPicker}
                    textColor={color || undefined}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  } else {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {global.HermesInternal !== null && (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View testID="appRootView" style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.text}>Example DateTime Picker</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10}}>Date format: </Text>
                  <Picker
                    style={{width: 200, height: 35}}
                    selectedValue={dateFormat}
                    onValueChange={value => setDateFormat(value)}>
                    <Picker.Item
                      label="day month year"
                      value="day month year"
                    />
                    <Picker.Item
                      label="dayofweek day month"
                      value="dayofweek day month"
                    />
                    <Picker.Item label="longdate" value="longdate" />
                    <Picker.Item label="shortdate" value="shortdate" />
                  </Picker>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10}}>Day of week format: </Text>
                  <Picker
                    style={{width: 200, height: 35}}
                    selectedValue={dayOfWeekFormat}
                    onValueChange={value => setDayOfWeekFormat(value)}>
                    <Picker.Item
                      label="abbreviated(2)"
                      value="{dayofweek.abbreviated(2)}"
                    />
                    <Picker.Item
                      label="abbreviated(3)"
                      value="{dayofweek.abbreviated(3)}"
                    />
                    <Picker.Item label="full" value="{dayofweek.full}" />
                  </Picker>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10}}>First day of week: </Text>
                  <Picker
                    style={{width: 200, height: 35}}
                    selectedValue={firstDayOfWeek}
                    onValueChange={value => setFirstDayOfWeek(value)}>
                    <Picker.Item label="Sunday" value={DAY_OF_WEEK.Sunday} />
                    <Picker.Item label="Monday" value={DAY_OF_WEEK.Monday} />
                    <Picker.Item label="Tuesday" value={DAY_OF_WEEK.Tuesday} />
                    <Picker.Item
                      label="Wednesday"
                      value={DAY_OF_WEEK.Wednesday}
                    />
                    <Picker.Item
                      label="Thursday"
                      value={DAY_OF_WEEK.Thursday}
                    />
                    <Picker.Item label="Friday" value={DAY_OF_WEEK.Friday} />
                    <Picker.Item
                      label="Saturday"
                      value={DAY_OF_WEEK.Saturday}
                    />
                  </Picker>
                </View>
                <View style={styles.header}>
                  <Text testID="dateTimeText" style={styles.dateTimeText}>
                    {date !== undefined
                      ? moment(date).format('MM/DD/YYYY')
                      : moment().format('MM/DD/YYYY')}
                  </Text>
                </View>

                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  onChange={onChange}
                  style={styles.windowsPicker}
                  firstDayOfWeek={firstDayOfWeek}
                  maxDate={maxDate}
                  minDate={minDate}
                  dateFormat={dateFormat}
                  dayOfWeekFormat={dayOfWeekFormat}
                  placeholderText="select date"
                />
                <View style={{width: 200}}>
                  <Button
                    style={styles.resetButton}
                    title="Reset calendar"
                    onPress={handleResetPress}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    width: 150,
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
  windowsPicker: {
    flex: 1,
    paddingTop: 10,
    width: 350,
  },
});

export default App;

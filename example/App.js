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
  useColorScheme,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from './SegmentedControl';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import React, {useRef, useState} from 'react';
import {Picker} from 'react-native-windows';
import moment from 'moment-timezone';
import {
  ANDROID_MODE,
  DAY_OF_WEEK,
  IOS_MODE,
  ANDROID_DISPLAY,
  IOS_DISPLAY,
} from '@react-native-community/datetimepicker/src/constants';
import * as RNLocalize from 'react-native-localize';

const timezone = [
  120,
  0,
  -120,
  undefined,
  'America/New_York',
  'America/Vancouver',
  'Europe/London',
  'Europe/Istanbul',
  'Asia/Hong_Kong',
  'Australia/Brisbane',
  'Australia/Sydney',
  'Australia/Adelaide',
];

const ThemedText = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const textColorByMode = {color: isDarkMode ? Colors.white : Colors.black};

  const TextElement = React.createElement(Text, props);
  return React.cloneElement(TextElement, {
    style: [props.style, textColorByMode],
  });
};
const ThemedTextInput = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const textColorByMode = {color: isDarkMode ? Colors.white : Colors.black};

  const TextElement = React.createElement(TextInput, props);
  return React.cloneElement(TextElement, {
    style: [props.style, styles.textInput, textColorByMode],
    placeholderTextColor: isDarkMode ? Colors.white : Colors.black,
  });
};

const Info = ({testID, title, body}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <ThemedText style={{flex: 1}}>{title}</ThemedText>
      <ThemedText testID={testID} style={{flex: 1}}>
        {body}
      </ThemedText>
    </View>
  );
};

const MODE_VALUES = Platform.select({
  ios: Object.values(IOS_MODE),
  android: Object.values(ANDROID_MODE),
  windows: [],
});
const DISPLAY_VALUES = Platform.select({
  ios: Object.values(IOS_DISPLAY),
  android: Object.values(ANDROID_DISPLAY),
  windows: [],
});
const MINUTE_INTERVALS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];

export const App = () => {
  // Sat, 13 Nov 2021 10:00:00 GMT (local: Saturday, November 13, 2021 11:00:00 AM GMT+01:00)
  const sourceMoment = moment.unix(1636765200);
  const sourceDate = sourceMoment.local().toDate();
  const [date, setDate] = useState(sourceDate);
  const [tzOffsetInMinutes, setTzOffsetInMinutes] = useState(undefined);
  const [tzName, setTzName] = useState(RNLocalize.getTimeZone());
  const [mode, setMode] = useState(MODE_VALUES[0]);
  const [show, setShow] = useState(false);
  const [textColor, setTextColor] = useState();
  const [accentColor, setAccentColor] = useState();
  const [display, setDisplay] = useState(DISPLAY_VALUES[0]);
  const [interval, setMinInterval] = useState(1);
  const [neutralButtonLabel, setNeutralButtonLabel] = useState(undefined);
  const [disabled, setDisabled] = useState(false);
  const [minimumDate, setMinimumDate] = useState();
  const [maximumDate, setMaximumDate] = useState();

  // Windows-specific
  const [time, setTime] = useState(undefined);
  const [maxDate] = useState(new Date('2021'));
  const [minDate] = useState(new Date('2018'));
  const [is24Hours, set24Hours] = useState(false);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DAY_OF_WEEK.Monday);
  const [dateFormat, setDateFormat] = useState('longdate');
  const [dayOfWeekFormat, setDayOfWeekFormat] = useState(
    '{dayofweek.abbreviated(2)}',
  );

  const scrollRef = useRef(null);

  const handleResetPress = () => {
    setDate(undefined);
  };

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'dismissed') {
      Alert.alert(
        'picker was dismissed',
        undefined,
        [
          {
            text: 'great',
          },
        ],
        {cancelable: true},
      );
      return;
    }

    if (event.type === 'neutralButtonPressed') {
      setDate(new Date(0));
    } else {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, newTime?: Date) => {
    if (Platform.OS === 'windows') {
      setTime(newTime);
    }
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.lighter,
  };

  const renderItem = ({item}) => {
    const isNumber = typeof item === 'number';
    const title = isNumber
      ? item > 0
        ? `+${item} mins`
        : `${item} mins`
      : item;
    return (
      <View style={{marginHorizontal: 1}}>
        <Button
          title={title || 'undefined'}
          onPress={() => {
            setTzOffsetInMinutes(isNumber ? item : undefined);
            setTzName(isNumber ? undefined : item);
          }}
        />
      </View>
    );
  };

  const toggleMinMaxDateInUTC = () => {
    setTzOffsetInMinutes(0);
    setTzName(undefined);

    const startOfTodayUTC = sourceMoment.utc().startOf('day').toDate();
    setMinimumDate(maximumDate ? undefined : startOfTodayUTC);
    const endOfTomorrowUTC = sourceMoment
      .utc()
      .endOf('day')
      .add(1, 'day')
      .toDate();
    setMaximumDate(minimumDate ? undefined : endOfTomorrowUTC);
  };

  if (Platform.OS !== 'windows') {
    return (
      <SafeAreaView
        testID="appRootView"
        style={[
          backgroundStyle,
          {flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white},
        ]}>
        <StatusBar barStyle="default" />
        <View>
          <View style={styles.header}>
            <ThemedText style={styles.text}>Example DateTime Picker</ThemedText>
          </View>
          <View>
            <Info
              testID={'utcTime'}
              title={'UTC Time:'}
              body={moment(date).utc().format()}
            />
            <Info
              testID={'deviceTime'}
              title={'Device Time:'}
              body={moment(date).format()}
            />
            <Info
              testID={'deviceTzName'}
              title={'Device TzName:'}
              body={RNLocalize.getTimeZone()}
            />
            {(tzName || !isNaN(tzOffsetInMinutes)) && (
              <>
                <Info
                  testID={'overriddenTime'}
                  title={'Overridden Time:'}
                  body={(() => {
                    if (tzName) {
                      return moment(date).tz(tzName).format();
                    }
                    if (tzOffsetInMinutes !== undefined) {
                      return moment(date).utcOffset(tzOffsetInMinutes).format();
                    }
                    return '';
                  })()}
                />
                <Info
                  testID={tzName ? 'overriddenTzName' : 'overriddenTzOffset'}
                  title={(() => {
                    if (tzName) {
                      return 'Overridden TzName:';
                    }
                    if (tzOffsetInMinutes !== undefined) {
                      return 'Overridden TzOffset:';
                    }
                    return '';
                  })()}
                  body={tzName || `${tzOffsetInMinutes} mins`}
                />
              </>
            )}
          </View>
        </View>
        <ScrollView
          testID="DateTimePickerScrollView"
          ref={scrollRef}
          onContentSizeChange={() => {
            if (Platform.OS === 'ios') {
              scrollRef.current?.scrollToEnd({animated: true});
            }
          }}>
          <ThemedText>mode prop:</ThemedText>
          <SegmentedControl
            values={MODE_VALUES}
            selectedIndex={MODE_VALUES.indexOf(mode)}
            onChange={(event) => {
              setMode(MODE_VALUES[event.nativeEvent.selectedSegmentIndex]);
            }}
          />
          <ThemedText>display prop:</ThemedText>
          <SegmentedControl
            values={DISPLAY_VALUES}
            selectedIndex={DISPLAY_VALUES.indexOf(display)}
            onChange={(event) => {
              setDisplay(
                DISPLAY_VALUES[event.nativeEvent.selectedSegmentIndex],
              );
            }}
          />
          <ThemedText>minute interval prop:</ThemedText>
          <SegmentedControl
            values={MINUTE_INTERVALS.map(String)}
            selectedIndex={MINUTE_INTERVALS.indexOf(interval)}
            onChange={(event) => {
              setMinInterval(
                MINUTE_INTERVALS[event.nativeEvent.selectedSegmentIndex],
              );
            }}
          />
          <View style={styles.header}>
            <ThemedText style={styles.textLabel}>
              text color (iOS only)
            </ThemedText>
            <ThemedTextInput
              value={textColor}
              onChangeText={(text) => {
                setTextColor(text.toLowerCase());
              }}
              placeholder="textColor"
            />
          </View>
          <View style={styles.header}>
            <ThemedText style={styles.textLabel}>
              accent color (iOS only)
            </ThemedText>
            <ThemedTextInput
              value={accentColor}
              onChangeText={(text) => {
                setAccentColor(text.toLowerCase());
              }}
              placeholder="accentColor"
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <ThemedText style={styles.textLabel}>
              disabled (iOS only)
            </ThemedText>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <Switch value={disabled} onValueChange={setDisabled} />
            </View>
          </View>
          <View style={styles.header}>
            <ThemedText style={styles.textLabel}>
              neutralButtonLabel (android only)
            </ThemedText>
            <ThemedTextInput
              value={neutralButtonLabel}
              onChangeText={setNeutralButtonLabel}
              placeholder="neutralButtonLabel"
              testID="neutralButtonLabelTextInput"
            />
          </View>
          <View style={styles.header}>
            <ThemedText style={styles.textLabel}>
              [android] show and dismiss picker after 3 secs
            </ThemedText>
          </View>
          <View style={styles.button}>
            <Button
              testID="showAndDismissPickerButton"
              onPress={() => {
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                }, 6000);
              }}
              title="Show and dismiss picker!"
            />
          </View>
          <View
            style={[
              styles.button,
              {flexDirection: 'row', justifyContent: 'space-around'},
            ]}>
            <Button
              testID="showPickerButton"
              onPress={() => {
                setShow(true);
              }}
              title="Show picker!"
            />
            <Button
              testID="hidePicker"
              onPress={() => setShow(false)}
              title="Hide picker!"
            />
          </View>
          <FlatList
            testID="timezone"
            style={{marginBottom: 10}}
            horizontal={true}
            renderItem={renderItem}
            data={timezone}
          />
          <View style={styles.button}>
            <Button
              testID="setMinMax"
              onPress={() => {
                toggleMinMaxDateInUTC();
                setShow(true);
              }}
              title="toggleMinMaxDate"
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* This label ensures there is no regression in this former bug: https://github.com/react-native-datetimepicker/datetimepicker/issues/409 */}
            <Text style={{flexShrink: 1}}>
              This is a very very very very very very long text to showcase
              behavior
            </Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={tzOffsetInMinutes}
                timeZoneName={tzName}
                minuteInterval={interval}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                value={date}
                mode={mode}
                is24Hour
                display={display}
                onChange={onChange}
                textColor={textColor || undefined}
                accentColor={accentColor || undefined}
                neutralButton={{label: neutralButtonLabel}}
                negativeButton={{label: 'Cancel', textColor: 'red'}}
                disabled={disabled}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
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
              <View testID="appRootView" style={styles.containerWindows}>
                <View style={styles.header}>
                  <Text style={styles.text}>Example DateTime Picker</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10}}>Date format: </Text>
                  <Picker
                    style={{width: 200, height: 35}}
                    selectedValue={dateFormat}
                    onValueChange={(value) => setDateFormat(value)}>
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
                    onValueChange={(value) => setDayOfWeekFormat(value)}>
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
                    onValueChange={(value) => setFirstDayOfWeek(value)}>
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
                <View style={{width: 200, marginTop: 15}}>
                  <Text testID="dateTimeText" style={styles.dateTimeText}>
                    {date !== undefined
                      ? moment(date).format('MM/DD/YYYY')
                      : moment().format('MM/DD/YYYY')}
                  </Text>
                  <Button
                    style={styles.resetButton}
                    title="Reset calendar"
                    onPress={handleResetPress}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10, marginTop: 10}}>
                    Clock format (AM/PM):{' '}
                  </Text>
                  <Picker
                    style={{width: 200, height: 35, marginTop: 10}}
                    selectedValue={is24Hours}
                    onValueChange={(value) => set24Hours(value)}>
                    <Picker.Item label="12-hour clock" value={false} />
                    <Picker.Item label="24-hour clock" value={true} />
                  </Picker>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{padding: 10}}>Minute interval: </Text>
                  <Picker
                    style={{width: 200, height: 35}}
                    selectedValue={interval}
                    onValueChange={(value) => setMinInterval(value)}>
                    <Picker.Item label="1 minute step" value={1} />
                    <Picker.Item label="12 minute step" value={12} />
                    <Picker.Item label="15 minute step" value={15} />
                    <Picker.Item label="17 minute step" value={17} />
                  </Picker>
                </View>
                <DateTimePicker
                  mode="time"
                  value={time}
                  style={{width: 300, opacity: 1, height: 30, marginTop: 50}}
                  onChange={onTimeChange}
                  is24Hour={is24Hours}
                  minuteInterval={interval}
                />
                <View style={styles.header}>
                  <Text style={styles.dateTimeText}>
                    {time !== undefined ? 'Time changed event response:\n' : ''}
                    {time !== undefined ? time.toUTCString() : ''}
                  </Text>
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
  containerWindows: {
    marginTop: 32,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textLabel: {
    margin: 10,
    flex: 1,
  },
  textInput: {
    height: 60,
    flex: 1,
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
  windowsPicker: {
    flex: 1,
    paddingTop: 10,
    width: 350,
  },
});

export default App;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerWindows } from '@react-native-community/datetimepicker';

export default function App() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (_event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (_event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // Windows-specific imperative API example
  const openWindowsDatePicker = () => {
    if (Platform.OS === 'windows' && DateTimePickerWindows) {
      DateTimePickerWindows.open({
        value: date,
        mode: 'date',
        minimumDate: new Date(2000, 0, 1),
        maximumDate: new Date(2025, 11, 31),
        firstDayOfWeek: 0, // Sunday
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
          }
        },
        onError: (error) => {
          console.error('Date picker error:', error);
        }
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const openWindowsTimePicker = () => {
    if (Platform.OS === 'windows' && DateTimePickerWindows) {
      DateTimePickerWindows.open({
        value: time,
        mode: 'time',
        is24Hour: true,
        onChange: (event, selectedTime) => {
          if (event.type === 'set' && selectedTime) {
            setTime(selectedTime);
          }
        },
        onError: (error) => {
          console.error('Time picker error:', error);
        }
      });
    } else {
      setShowTimePicker(true);
    }
  };

  const formattedDate = date.toDateString();
  const formattedTime = time.toLocaleTimeString();
  const combinedDateTime = `${date.toLocaleDateString()} ${time.toLocaleTimeString()}`;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>DateTimePicker Sample</Text>
        <Text style={styles.subtitle}>Windows Fabric - Fluent Design</Text>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Date Selection</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selected Date:</Text>
            <Text style={styles.value}>{formattedDate}</Text>
            <Text
              style={styles.button}
              onPress={openWindowsDatePicker}
            >
              Pick Date {Platform.OS === 'windows' ? '(Imperative API)' : ''}
            </Text>
          </View>
        </View>

        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Time Selection</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selected Time:</Text>
            <Text style={styles.value}>{formattedTime}</Text>
            <Text
              style={styles.button}
              onPress={openWindowsTimePicker}
            >
              Pick Time {Platform.OS === 'windows' ? '(Imperative API)' : ''}
            </Text>
          </View>
        </View>

        {/* Combined DateTime Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📆 Combined DateTime</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Full DateTime:</Text>
            <Text style={styles.valueHighlight}>{combinedDateTime}</Text>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Date</Text>
            <Text style={styles.closeButton} onPress={() => setShowDatePicker(false)}>
              ✕
            </Text>
          </View>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date(2025, 11, 31)}
            minimumDate={new Date(2000, 0, 1)}
          />
          {Platform.OS === 'ios' && (
            <View style={styles.iosButtonContainer}>
              <Text style={styles.iosButton} onPress={() => setShowDatePicker(false)}>
                Done
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Time</Text>
            <Text style={styles.closeButton} onPress={() => setShowTimePicker(false)}>
              ✕
            </Text>
          </View>
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
            is24Hour={true}
          />
          {Platform.OS === 'ios' && (
            <View style={styles.iosButtonContainer}>
              <Text style={styles.iosButton} onPress={() => setShowTimePicker(false)}>
                Done
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0078d4',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#605e5c',
    marginBottom: 32,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#323130',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0078d4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#605e5c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0078d4',
    marginBottom: 14,
    paddingVertical: 8,
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: '600',
    color: '#107c10',
    marginBottom: 0,
    paddingVertical: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0078d4',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    borderRadius: 4,
    textAlign: 'center',
    overflow: 'hidden',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#edebe9',
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edebe9',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#323130',
  },
  closeButton: {
    fontSize: 20,
    color: '#605e5c',
    fontWeight: '600',
  },
  iosButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  iosButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: '#0078d4',
    fontSize: 16,
    fontWeight: '600',
  },
});

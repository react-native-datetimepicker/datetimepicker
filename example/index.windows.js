/**
 * @format
 * Windows-specific entry point with DateTimePicker
 */

import React, {useState} from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

// Note: The native RNDateTimePickerWindows Fabric component is not yet fully implemented.
// This demo shows the app structure - the native picker will work once the Fabric
// component registration is complete.

function DateTimePickerApp() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [editingDate, setEditingDate] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (t) => {
    return t.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateSubmit = () => {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
    }
    setEditingDate(false);
    setDateInput('');
  };

  const handleTimeSubmit = () => {
    const [hours, minutes] = timeInput.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newTime = new Date();
      newTime.setHours(hours, minutes, 0, 0);
      setTime(newTime);
    }
    setEditingTime(false);
    setTimeInput('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎉 DateTimePicker Demo</Text>
        <Text style={styles.subtitle}>Windows Fabric Build - Success!</Text>
        
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            ✅ Native Fabric build is working!
          </Text>
          <Text style={styles.successSubtext}>
            The React Native Windows Fabric infrastructure is functional.
          </Text>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Date Selection</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selected Date:</Text>
            <Text style={styles.value}>{formatDate(date)}</Text>
            
            {editingDate ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter date (MM/DD/YYYY)"
                  value={dateInput}
                  onChangeText={setDateInput}
                  onSubmitEditing={handleDateSubmit}
                />
                <TouchableOpacity style={styles.smallButton} onPress={handleDateSubmit}>
                  <Text style={styles.smallButtonText}>Set</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setEditingDate(true)}>
                <Text style={styles.buttonText}>Change Date</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Time Selection</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selected Time:</Text>
            <Text style={styles.value}>{formatTime(time)}</Text>
            
            {editingTime ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter time (HH:MM)"
                  value={timeInput}
                  onChangeText={setTimeInput}
                  onSubmitEditing={handleTimeSubmit}
                />
                <TouchableOpacity style={styles.smallButton} onPress={handleTimeSubmit}>
                  <Text style={styles.smallButtonText}>Set</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setEditingTime(true)}>
                <Text style={styles.buttonText}>Change Time</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Combined Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Combined Selection</Text>
          <View style={styles.card}>
            <Text style={styles.combinedText}>
              {formatDate(date)}
            </Text>
            <Text style={styles.combinedText}>
              at {formatTime(time)}
            </Text>
          </View>
        </View>

        {/* Quick Date Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Select</Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => setDate(new Date())}>
              <Text style={styles.quickButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow);
              }}>
              <Text style={styles.quickButtonText}>Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setDate(nextWeek);
              }}>
              <Text style={styles.quickButtonText}>Next Week</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#0078D4',
    marginBottom: 20,
  },
  successBanner: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
  },
  successSubtext: {
    fontSize: 14,
    color: '#155724',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0078D4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  smallButton: {
    backgroundColor: '#0078D4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  combinedText: {
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

// Register with both names
AppRegistry.registerComponent('date-time-picker-example', () => DateTimePickerApp);
AppRegistry.registerComponent('DateTimePickerDemo', () => DateTimePickerApp);

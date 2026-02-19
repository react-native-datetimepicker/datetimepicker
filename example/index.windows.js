/**
 * @format
 * Windows-specific entry point with DateTimePicker
 */

import React, {useState, useCallback, useMemo} from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

// Note: The native RNDateTimePickerWindows Fabric component is not yet fully implemented.
// This demo shows the app structure - the native picker will work once the Fabric
// component registration is complete.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function CalendarPicker({selectedDate, onDateSelect}) {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const goToPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const daysInPrevMonth = getDaysInMonth(
      viewMonth === 0 ? 11 : viewMonth - 1,
      viewMonth === 0 ? viewYear - 1 : viewYear,
    );

    const cells = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        month: viewMonth === 0 ? 11 : viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({day: d, currentMonth: true, month: viewMonth, year: viewYear});
    }

    // Next month leading days to fill remaining row(s)
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({
          day: i,
          currentMonth: false,
          month: viewMonth === 11 ? 0 : viewMonth + 1,
          year: viewMonth === 11 ? viewYear + 1 : viewYear,
        });
      }
    }

    return cells;
  }, [viewMonth, viewYear]);

  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  const isSelected = (cell) =>
    cell.day === selectedDate.getDate() &&
    cell.month === selectedDate.getMonth() &&
    cell.year === selectedDate.getFullYear();

  const isToday = (cell) => {
    const today = new Date();
    return (
      cell.day === today.getDate() &&
      cell.month === today.getMonth() &&
      cell.year === today.getFullYear()
    );
  };

  const headerLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={calStyles.container}>
      {/* Selected date header */}
      <View style={calStyles.header}>
        <Text style={calStyles.headerText}>{headerLabel}</Text>
      </View>

      {/* Month / Year nav */}
      <View style={calStyles.monthNav}>
        <Text style={calStyles.monthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <View style={calStyles.navButtons}>
          <Pressable onPress={goToPrevMonth} style={calStyles.navButton}>
            <Text style={calStyles.navButtonText}>▲</Text>
          </Pressable>
          <Pressable onPress={goToNextMonth} style={calStyles.navButton}>
            <Text style={calStyles.navButtonText}>▼</Text>
          </Pressable>
        </View>
      </View>

      {/* Day-of-week headers */}
      <View style={calStyles.weekRow}>
        {DAY_NAMES.map((d) => (
          <View key={d} style={calStyles.weekCell}>
            <Text style={calStyles.weekText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {rows.map((row, ri) => (
        <View key={ri} style={calStyles.weekRow}>
          {row.map((cell, ci) => {
            const selected = isSelected(cell);
            const today = isToday(cell);
            return (
              <Pressable
                key={ci}
                style={[
                  calStyles.dayCell,
                  selected && calStyles.dayCellSelected,
                  today && !selected && calStyles.dayCellToday,
                ]}
                onPress={() =>
                  onDateSelect(new Date(cell.year, cell.month, cell.day))
                }>
                <Text
                  style={[
                    calStyles.dayText,
                    !cell.currentMonth && calStyles.dayTextOther,
                    selected && calStyles.dayTextSelected,
                  ]}>
                  {cell.day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const calStyles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navButtonText: {
    color: '#aaa',
    fontSize: 12,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dayCellSelected: {
    backgroundColor: '#0078D4',
    borderRadius: 20,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: '#0078D4',
    borderRadius: 20,
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
  },
  dayTextOther: {
    color: '#666',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});

function DateTimePickerApp() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState('');

  const timeInputRef = React.useRef('');

  const onTimeInputChange = useCallback((text) => {
    timeInputRef.current = text;
    setTimeInput(text);
  }, []);

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

  const handleDateSelect = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleTimeSubmit = useCallback(() => {
    const input = timeInputRef.current;
    if (!input) {
      return;
    }
    const [hours, minutes] = input.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newTime = new Date();
      newTime.setHours(hours, minutes, 0, 0);
      setTime(newTime);
    }
    setEditingTime(false);
    setTimeInput('');
    timeInputRef.current = '';
  }, []);

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
            <Pressable onPress={() => setCalendarOpen(!calendarOpen)}>
              <View style={styles.dateDisplay}>
                <Text style={styles.value}>{formatDate(date)}</Text>
                <Text style={styles.toggleArrow}>
                  {calendarOpen ? '▲' : '▼'}
                </Text>
              </View>
            </Pressable>

            {calendarOpen && (
              <CalendarPicker
                selectedDate={date}
                onDateSelect={handleDateSelect}
              />
            )}

            <Pressable
              style={styles.button}
              onPress={() => setCalendarOpen(!calendarOpen)}>
              <Text style={styles.buttonText}>
                {calendarOpen ? 'Done' : 'Pick Date'}
              </Text>
            </Pressable>
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
                  onChangeText={onTimeInputChange}
                />
                <Pressable style={styles.smallButton} onPress={handleTimeSubmit}>
                  <Text style={styles.smallButtonText}>Set</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() => setEditingTime(true)}>
                <Text style={styles.buttonText}>Change Time</Text>
              </Pressable>
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
            <Pressable
              style={styles.quickButton}
              onPress={() => setDate(new Date())}>
              <Text style={styles.quickButtonText}>Today</Text>
            </Pressable>
            <Pressable
              style={styles.quickButton}
              onPress={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow);
              }}>
              <Text style={styles.quickButtonText}>Tomorrow</Text>
            </Pressable>
            <Pressable
              style={styles.quickButton}
              onPress={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setDate(nextWeek);
              }}>
              <Text style={styles.quickButtonText}>Next Week</Text>
            </Pressable>
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
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  toggleArrow: {
    fontSize: 14,
    color: '#666',
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
  smallButtonWrapper: {
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginTop: 8,
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

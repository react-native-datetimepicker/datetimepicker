import { requireNativeComponent, StyleSheet } from 'react-native';
const RNDateTimePicker = requireNativeComponent('RNDateTimePicker');

const styles = StyleSheet.create({
  picker: {
    height: 216,
  },
});

export {
  RNDateTimePicker as default,
  styles,
};

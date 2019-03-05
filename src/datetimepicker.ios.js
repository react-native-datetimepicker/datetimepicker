import { requireNativeComponent, StyleSheet } from 'react-native';
const RCTDatePicker = requireNativeComponent('RCTDatePicker');

const styles = StyleSheet.create({
  picker: {
    height: 216,
  },
});

export {
  RCTDatePicker as default,
  styles,
};

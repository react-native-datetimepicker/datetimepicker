export default function DateTimePicker() {
  React.useEffect(() => {
    console.warn(`DateTimePicker is not supported on: ${Platform.OS}`);
  }, [])
  return null;
}

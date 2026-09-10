import type {
  DateTimePickerChangeEvent,
  DateTimePickerEvent,
} from '../src/index';

// Android dialogs and iOS dismiss events omit `target`.
const androidEvent: DateTimePickerEvent = {
  type: 'set',
  nativeEvent: {
    timestamp: 0,
    utcOffset: 0,
  },
};

// iOS native view events include RN's injected react tag.
const iosEvent: DateTimePickerEvent = {
  type: 'set',
  nativeEvent: {
    timestamp: 0,
    utcOffset: 0,
    target: 42,
  },
};

declare const event: DateTimePickerEvent;
declare const changeEvent: DateTimePickerChangeEvent;

const target: number | undefined = event.nativeEvent.target;
const changeTarget: number | undefined = changeEvent.nativeEvent.target;

if (event.nativeEvent.target) {
  const reactTag: number = event.nativeEvent.target;
  void reactTag;
}

void androidEvent;
void iosEvent;
void target;
void changeTarget;

## Migration from the older components

`RNDateTimePicker` is the new common name used to represent the old versions of iOS and Android.

On Android, open picker modals will update the selected date and/or time if the prop `value` changes. For example, if a HOC holding state, updates the `value` prop. Previously the component used to close the modal and render a new one on consecutive calls.

### DatePickerIOS

- `initialDate` is deprecated, use `value` instead.

  ```js
  // Before
  <DatePickerIOS initialValue={new Date()} />
  ```

  ```js
  // Now
  <RNDateTimePicker value={new Date()} />
  ```

- `date` is deprecated, use `value` instead.

  ```js
  // Before
  <DatePickerIOS date={new Date()} />
  ```

  ```js
  // Now
  <RNDateTimePicker value={new Date()} />
  ```

- `onChange` now returns also the date.

  ```js
  // Before
  onChange = (event) => {};
  <DatePickerIOS onChange={this.onChange} />;
  ```

  ```js
  // Now
  onChange = (event, date) => {};
  <RNDateTimePicker onChange={this.onChange} />;
  ```

- `onDateChange` is deprecated, use `onChange` instead.

  ```js
  // Before
  setDate = (date) => {};
  <DatePickerIOS onDateChange={this.setDate} />;
  ```

  ```js
  // Now
  setDate = (event, date) => {};
  <RNDateTimePicker onChange={this.setDate} />;
  ```

### DatePickerAndroid

- `date` is deprecated, use `value` instead.

  ```js
  // Before
  try {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: new Date(),
    });
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
  ```

  ```js
  // Now
  <RNDateTimePicker mode="date" value={new Date()} />
  ```

- `minDate` and `maxDate` are deprecated, use `minimumDate` and `maximumDate` instead.

  ```js
  // Before
  try {
    const {action, year, month, day} = await DatePickerAndroid.open({
      minDate: new Date(),
      maxDate: new Date(),
    });
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
  ```

  ```js
  // Now
  <RNDateTimePicker
    mode="date"
    minimumDate={new Date()}
    maximumDate={new Date()}
  />
  ```

- `dateSetAction` is deprecated, use `onChange` instead.

  ```js
  // Before
  try {
    const {action, year, month, day} = await DatePickerAndroid.open();
    if (action === DatePickerAndroid.dateSetAction) {
      // Selected year, month (0-11), day
    }
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
  ```

  ```js
  // Now
  setDate = (event, date) => {
    if (date !== undefined) {
      // timeSetAction
    }
  };
  <RNDateTimePicker mode="date" onChange={this.setDate} />;
  ```

- `dismissedAction` is deprecated, use `onChange` instead.

  ```js
  // Before
  try {
    const {action, year, month, day} = await DatePickerAndroid.open();
    if (action === DatePickerAndroid.dismissedAction) {
      // Dismissed
    }
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
  ```

  ```js
  // Now
  setDate = (event, date) => {
    if (date === undefined) {
      // dismissedAction
    }
  };
  <RNDateTimePicker mode="date" onChange={this.setDate} />;
  ```

### TimePickerAndroid

- `hour` and `minute` are deprecated, use `value` instead.

  ```js
  // Before
  try {
    const {action, hour, minute} = await TimePickerAndroid.open({
      hour: 14,
      minute: 0,
      is24Hour: false, // Will display '2 PM'
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      // Selected hour (0-23), minute (0-59)
    }
  } catch ({code, message}) {
    console.warn('Cannot open time picker', message);
  }
  ```

  ```js
  // Now
  // It will use the hour and minute defined in date
  <RNDateTimePicker mode="time" value={new Date()} />
  ```

- `timeSetAction` is deprecated, use `onChange` instead.

  ```js
  // Before
  try {
    const {action, hour, minute} = await TimePickerAndroid.open();
    if (action === TimePickerAndroid.timeSetAction) {
      // Selected hour (0-23), minute (0-59)
    }
  } catch ({code, message}) {
    console.warn('Cannot open time picker', message);
  }
  ```

  ```js
  // Now
  setTime = (event, date) => {
    if (date !== undefined) {
      // Use the hour and minute from the date object
    }
  };
  <RNDateTimePicker mode="time" onChange={this.setTime} />;
  ```

- `dismissedAction` is deprecated, use `onChange` instead.

  ```js
  // Before
  try {
    const {action, hour, minute} = await TimePickerAndroid.open();
    if (action === TimePickerAndroid.dismissedAction) {
      // Dismissed
    }
  } catch ({code, message}) {
    console.warn('Cannot open time picker', message);
  }
  ```

  ```js
  // Now
  setTime = (event, date) => {
    if (date === undefined) {
      // dismissedAction
    }
  };
  <RNDateTimePicker mode="time" onChange={this.setTime} />;
  ```

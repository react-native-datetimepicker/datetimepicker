describe('Example', () => {
  beforeEach(async () => {
    if (global.device.getPlatform() === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({newInstance: true});
    }
  });

  it('should have title', async () => {
    await expect(element(by.id('appRootView'))).toBeVisible();
    await expect(element(by.text('Example DateTime Picker'))).toBeVisible();
  });

  it('should show date picker after tapping datePicker button', async () => {
    await element(by.id('datePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')))).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.DatePicker'))).toBeVisible();
    }
  });

  it('Nothing should happen if date doesn`t change', async () => {
    await element(by.id('datePickerButton')).tap();
    const dateTimeText = await element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

      await expect(dateTimeText).toHaveText('08/21/2020');
    } else {
      const testElement = await element(by.type('android.widget.ScrollView').withAncestor(by.type('android.widget.DatePicker')));
      await testElement.swipe('left', 'fast', '100');
      await element(by.text('CANCEL')).tap();
  
      await expect(dateTimeText).toHaveText('08/22/20');
    }
  });

  it('should update dateTimeText when date changes', async () => {
    await element(by.id('datePickerButton')).tap();
    const dateTimeText = await element(by.id('dateTimeText'));

    if (global.device.getPlatform() === 'ios') {
      const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));
      await testElement.setColumnToValue(0, 'November');
      await testElement.setColumnToValue(1, '3');
      await testElement.setColumnToValue(2, '1800');

      await expect(dateTimeText).toHaveText('11/03/1800');
    } else {
      const testElement = await element(by.type('android.widget.ScrollView').withAncestor(by.type('android.widget.DatePicker')));
      await testElement.swipe('left', 'fast', '100');
      await testElement.tapAtPoint({ x: 50, y: 200});
      await element(by.text('OK')).tap();
  
      await expect(dateTimeText).toHaveText('09/13/20');
    }
  });
  
  it('should show time picker after tapping timePicker button', async () => {
    await element(by.id('timePickerButton')).tap();

    if (global.device.getPlatform() === 'ios') {
      await expect(element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')))).toBeVisible();
    } else {
      await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
    }
  });

  // it.only('Nothing should happen if time doesn`t change', async () => {
  //   await element(by.id('timePickerButton')).tap();
  //   const dateTimeText = await element(by.id('dateTimeText'));

  //   if (global.device.getPlatform() === 'ios') {
  //     const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

  //     await expect(dateTimeText).toHaveText('11:15 PM');
  //   } else {
  //     // await expect(element(by.type('android.widget.TimePicker'))).toBeVisible();
  //     await expect(element(by.type('android.internal.widget.NumericTextView').and(by.text('text')))).toBeVisible();
  //     // await expect(element(by.type('android.widget.NumericTextView').withAncestor(by.type('com.widget.TimePicker')))).toBeVisible();
  //     await expect(element(by.type('android.widget.RadialTimePickerView').withAncestor(by.type('com.widget.TimePicker')))).toBeVisible();
  //     // await testElement.swipe('left', 'fast', '100');
  //     // await element(by.text('CANCEL')).tap();
  
  //     // await expect(dateTimeText).toHaveText('06/12/20');
  //   }
  // });

  // it('should change time text when time changes', async () => {
  //   await element(by.id('timePickerButton')).tap();
  //   const dateTimeText = await element(by.id('dateTimeText'));
  //   const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

  //   await testElement.setColumnToValue(0, '2');
  //   await testElement.setColumnToValue(1, '44');
  //   await testElement.setColumnToValue(2, 'PM');

  //   await expect(dateTimeText).toHaveText('2:44 PM');
  // });
});

describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await expect(element(by.id('appRootView'))).toBeVisible();
  });

  it('should have title', async () => {
    await expect(element(by.text('Example DateTime Picker'))).toBeVisible();
  });

  it('should show date picker after tapping datePicker button', async () => {
    await element(by.id('datePickerButton')).tap();
    await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))).toBeVisible;
  });

  it('should change date text when date changes', async () => {
    await element(by.id('datePickerButton')).tap();
    const dateTimeText = await element(by.id('dateTimeText'));
    const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

    await testElement.setColumnToValue(0, 'November');
    await testElement.setColumnToValue(1, '3');
    await testElement.setColumnToValue(2, '1800');

    await expect(dateTimeText).toHaveText('11/3/1800');
  })

  it('should show time picker after tapping timePicker button', async () => {
    await element(by.id('timePickerButton')).tap();
    await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker'))).toBeVisible;
  });

  it('should change time text when time changes', async () => {
    await element(by.id('timePickerButton')).tap();
    const dateTimeText = await element(by.id('dateTimeText'));
    const testElement = await element(by.type('UIPickerView').withAncestor(by.id('dateTimePicker')));

    await testElement.setColumnToValue(0, '2');
    await testElement.setColumnToValue(1, '44');
    await testElement.setColumnToValue(2, 'PM');

    await expect(dateTimeText).toHaveText('2:44 PM');
  });
});

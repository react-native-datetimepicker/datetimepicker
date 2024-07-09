const {elementById} = require('./matchers');

async function assertTimeLabels({utcTime, deviceTime, overriddenTime}) {
  await expect(elementById('utcTime')).toHaveText(utcTime);
  await expect(elementById('deviceTime')).toHaveText(deviceTime);
  await expect(elementById('overriddenTime')).toHaveText(
    overriddenTime ?? deviceTime,
  );
}

async function assertInitialTimeLabels() {
  return await assertTimeLabels({
    utcTime: '2021-11-13T01:00:00Z',
    deviceTime: '2021-11-13T02:00:00+01:00',
    overriddenTime: '2021-11-13T02:00:00+01:00',
  });
}
module.exports = {assertTimeLabels, assertInitialTimeLabels};

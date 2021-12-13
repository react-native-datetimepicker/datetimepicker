// Set the default test timeout
jest.setTimeout(130000);

beforeAll(async () => {
  await device.launchApp();
}, 300000);

import * as constants from '../src/constants.js';

describe('constants', () => {
  it('exports mode values', () => {
    expect(constants).toHaveProperty('MODE_DATE', 'date');
    expect(constants).toHaveProperty('MODE_TIME', 'time');
    expect(constants).toHaveProperty('MODE_DATETIME', 'datetime');
  });

  it('exports display values', () => {
    expect(constants).toHaveProperty('DISPLAY_DEFAULT', 'default');
    expect(constants).toHaveProperty('DISPLAY_SPINNER', 'spinner');
    expect(constants).toHaveProperty('DISPLAY_CLOCK', 'clock');
    expect(constants).toHaveProperty('DISPLAY_CALENDAR', 'calendar');
  });
});

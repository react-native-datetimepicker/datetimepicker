import renderer from 'react-test-renderer';
import DatePicker from '../src/index.js';
import React from 'react';

test('renders a DatePicker by default', () => {
  const tree = renderer.create(<DatePicker value={ new Date('08/20/2013') }/>).toJSON();

  expect(tree).toMatchSnapshot();
});

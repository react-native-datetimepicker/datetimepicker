import renderer from 'react-test-renderer';
import DatePicker from '../src/index.js';
import React from 'react';

describe('DatePicker', function (){
  it('renders a native Component', () => {
    const tree = renderer.create(<DatePicker value={ new Date('08/20/2013') }/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('will pass timestamp to native Component', function () {
    const date = new Date(156e10);
    const tree = renderer.create(<DatePicker value={ date }/>).toJSON();

    expect(tree).toHaveProperty(['children', 0, 'props', 'date'], date.getTime());
  });

  it.todo('calls onDateChange callback');
  it.todo('calls onChange callback');

  it('has default mode `date`', function () {
    expect(DatePicker.defaultProps.mode).toEqual('date');
  });

  it('has reference to picker', function () {
    expect(new DatePicker()._picker).toBeDefined();
  });

  it('applies styling to `View` wrapper', function () {
    const style = { backgroundColor: 'red' };
    const tree = renderer.create(<DatePicker style={style} value={ new Date('08/20/2013') }/>).toJSON();

    expect(tree).toHaveProperty('props.style.backgroundColor', style.backgroundColor);
    expect(tree).toMatchSnapshot();
  });
});

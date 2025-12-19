import React from 'react';
import { render } from '@testing-library/react-native';
import { SimpleLineChart } from '../Chart';

describe('SimpleLineChart', () => {
  it('renders correctly with data', () => {
    const data = [100, 200, 300];
    const labels = ['Mon', 'Tue', 'Wed'];

    const { getByText } = render(
      <SimpleLineChart data={data} labels={labels} />
    );

    expect(getByText('Spending Trend')).toBeTruthy();
    expect(getByText('Last 7 Days')).toBeTruthy();
  });

  it('returns null when data is empty', () => {
    const { toJSON } = render(<SimpleLineChart data={[]} />);
    expect(toJSON()).toBeNull();
  });
});
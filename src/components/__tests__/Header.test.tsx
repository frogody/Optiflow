import { render, screen } from '@testing-library/react';
import React from 'react';

import Header from '../Header';

describe('Header Component', () => {
  test('renders in simple mode correctly', () => {
    render(<Header isAdvancedMode={false} onToggleMode={() => {}} />);

    // Check for simple mode text
    expect(screen.getByText('Simple Mode')).toBeInTheDocument();

    // Check for switch mode button
    expect(screen.getByText('Switch to Advanced Mode')).toBeInTheDocument();

    // Check for Documentation button
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  test('renders in advanced mode correctly', () => {
    render(<Header isAdvancedMode={true} onToggleMode={() => {}} />);

    // Check for advanced mode text
    expect(screen.getByText('Advanced Mode')).toBeInTheDocument();

    // Check for switch mode button
    expect(screen.getByText('Switch to Simple Mode')).toBeInTheDocument();

    // Check for Documentation button
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });
});

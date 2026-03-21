/**
 * Component tests for reusable UI elements.
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/common/Button';
import { Badge } from '../src/components/common/Badge';

/* ─── Button ───────────────────────────────────────────── */

describe('Button', () => {
  test('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  test('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeDisabled();
  });

  test('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon">★</span>}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

/* ─── Badge ────────────────────────────────────────────── */

describe('Badge', () => {
  test('renders text content', () => {
    render(<Badge>High</Badge>);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('applies variant-specific classes', () => {
    const { container } = render(<Badge variant="danger">Urgent</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('red');
  });
});

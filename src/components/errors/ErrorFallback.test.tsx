
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorFallback } from './ErrorFallback';

describe('ErrorFallback', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('displays the error heading and recovery instructions', () => {
    render(
      <ErrorFallback
        error={new Error('Test error')}
        resetErrorBoundary={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/An unexpected error occurred/),
    ).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when Try again is clicked', async () => {
    const user = userEvent.setup();
    const resetErrorBoundary = vi.fn();

    render(
      <ErrorFallback
        error={new Error('Test error')}
        resetErrorBoundary={resetErrorBoundary}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(resetErrorBoundary).toHaveBeenCalledOnce();
  });

  it('provides a button to return to the dashboard', () => {
    render(
      <ErrorFallback
        error={new Error('Test error')}
        resetErrorBoundary={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Return to dashboard' }),
    ).toBeInTheDocument();
  });

  it('displays the error message in development mode', () => {
    vi.stubEnv('DEV', true);

    render(
      <ErrorFallback
        error={new Error('Detailed test error')}
        resetErrorBoundary={vi.fn()}
      />,
    );

    expect(screen.getByText('Detailed test error')).toBeInTheDocument();
  });

  
it('navigates to the dashboard when Return to dashboard is clicked', async () => {
  const user = userEvent.setup();

  const originalLocation = window.location;
  const locationSpy = vi.fn();

  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      ...originalLocation,
      set href(value: string) {
        locationSpy(value);
      },
      get href() {
        return originalLocation.href;
      },
    },
  });

  try {
    render(
      <ErrorFallback
        error={new Error('Test error')}
        resetErrorBoundary={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Return to dashboard' }),
    );

    expect(locationSpy).toHaveBeenCalledWith('/');
  } finally {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  }
});

it('displays a generic message when the error is not an Error instance', () => {
  vi.stubEnv('DEV', true);

  render(
    <ErrorFallback
      error={'unexpected value' as unknown as Error}
      resetErrorBoundary={vi.fn()}
    />,
  );

  expect(
    screen.getByText('An unexpected error occurred.'),
  ).toBeInTheDocument();
});

});


import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { describe, expect, it, vi } from 'vitest';
import { ErrorFallback } from './ErrorFallback';

function BrokenComponent(): never {
  throw new Error('Test rendering error');
}

describe('ErrorFallback', () => {
  it('displays a fallback when a component throws', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    try {
      render(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BrokenComponent />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole('heading', {
          name: 'Something went wrong',
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Try again' }),
      ).toBeInTheDocument();
    } finally {
      consoleError.mockRestore();
    }
  });
});


import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider } from '../context/SettingsContext';
import { SettingsPage } from './SettingsPage';

describe('SettingsPage form validation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows required-field errors when the form is submitted empty', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/store name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/store description/i), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('Admin name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Store name is required.')).toBeInTheDocument();
    expect(screen.getByText('Store description is required.')).toBeInTheDocument();
  });

  it('rejects an invalid email address', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(
      screen.getByText('Enter a valid email address.'),
    ).toBeInTheDocument();
  });

  it('shows a success message when valid settings are saved', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
  });

  it('clears a field error when that field is edited', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>,
    );

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('Admin name is required.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/admin name/i), {
      target: { value: 'Store Administrator' },
    });

    expect(screen.queryByText('Admin name is required.')).not.toBeInTheDocument();
  });
});

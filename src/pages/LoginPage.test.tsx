import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  function renderLoginPage() {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );
  }

  it('renders password input as password type by default', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: /Show password/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles password visibility between text and password when toggle button is clicked', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const toggleButton = screen.getByRole('button', { name: /Show password/i });

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument();

    // Click again to hide password
    fireEvent.click(screen.getByRole('button', { name: /Hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /Show password/i })).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { RegisterPage } from './RegisterPage';

describe('RegisterPage', () => {
  function renderRegisterPage() {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </MemoryRouter>,
    );
  }

  it('renders both password inputs with password type by default', () => {
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^Confirm password$/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    expect(screen.getByRole('button', { name: /^Show password$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Show confirm password$/i }),
    ).toBeInTheDocument();
  });

  it('toggles password and confirm password independently', () => {
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^Confirm password$/i);

    const togglePasswordBtn = screen.getByRole('button', {
      name: /^Show password$/i,
    });
    const toggleConfirmBtn = screen.getByRole('button', {
      name: /^Show confirm password$/i,
    });


    // Toggle main password
    fireEvent.click(togglePasswordBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle confirm password
    fireEvent.click(toggleConfirmBtn);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Hide main password again
    fireEvent.click(screen.getByRole('button', { name: /^Hide password$/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
});

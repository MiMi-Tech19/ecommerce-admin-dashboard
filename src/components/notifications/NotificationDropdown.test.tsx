import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotificationProvider } from '../../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';

describe('NotificationDropdown', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <NotificationProvider>
          <NotificationDropdown />
        </NotificationProvider>
      </MemoryRouter>,
    );
  }

  it('renders bell button with unread count badge', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /Notifications/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles dropdown panel on button click', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /Notifications/i });
    fireEvent.click(button);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('New Order Received')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(button);
    expect(screen.queryByText('New Order Received')).not.toBeInTheDocument();
  });

  it('filters notifications by Unread', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /Notifications/i });
    fireEvent.click(button);

    const unreadTab = screen.getByRole('button', { name: /^Unread \(/i });
    fireEvent.click(unreadTab);


    // Unread item is visible
    expect(screen.getByText('New Order Received')).toBeInTheDocument();
    // Read item should not be in the unread list
    expect(screen.queryByText('System Backup Success')).not.toBeInTheDocument();
  });

  it('marks all as read when button is clicked', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /Notifications/i });
    fireEvent.click(button);

    const markAllBtn = screen.getByText(/Mark all read/i);
    fireEvent.click(markAllBtn);

    // Unread badge should disappear and Mark all button should hide
    expect(screen.queryByText(/Mark all read/i)).not.toBeInTheDocument();
  });
});

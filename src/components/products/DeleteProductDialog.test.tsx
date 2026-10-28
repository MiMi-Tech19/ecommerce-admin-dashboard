import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteProductDialog } from './DeleteProductDialog';

const { mutateAsyncMock, onCloseMock } = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
  onCloseMock: vi.fn(),
}));

vi.mock('../../hooks/useDeleteProduct', () => ({
  useDeleteProduct: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

const product = {
  id: 'product-123',
  name: 'Wireless Headphones',
  description: 'Noise-cancelling headphones',
  category: 'Electronics',
  price: 79.99,
  stock: 25,
  status: 'active' as const,
  imageUrl: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function renderDeleteProductDialog() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DeleteProductDialog product={product} onClose={onCloseMock} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mutateAsyncMock.mockResolvedValue(undefined);
});

describe('DeleteProductDialog', () => {
  it('displays the confirmation dialog and product name', () => {
    renderDeleteProductDialog();

    expect(
      screen.getByRole('alertdialog', { name: 'Delete product?' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancel' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete Product' }),
    ).toBeInTheDocument();
  });

  it('deletes the product and closes the dialog after success', async () => {
    const user = userEvent.setup();
    renderDeleteProductDialog();

    await user.click(
      screen.getByRole('button', { name: 'Delete Product' }),
    );

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith('product-123');
      expect(onCloseMock).toHaveBeenCalledOnce();
    });
  });

  it('closes the dialog without deleting when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderDeleteProductDialog();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCloseMock).toHaveBeenCalledOnce();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddProductModal } from './AddProductModal';
import type { Product } from '../../types';

const {
  mutateAsyncMock,
  updateMutateAsyncMock,
  onCloseMock,
} = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
  updateMutateAsyncMock: vi.fn(),
  onCloseMock: vi.fn(),
}));

vi.mock('../../hooks/useCreateProduct', () => ({
  useCreateProduct: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

vi.mock('../../hooks/useUpdateProduct', () => ({
  useUpdateProduct: () => ({
    mutateAsync: updateMutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

function renderAddProductModal(product?: Product) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AddProductModal
        onClose={onCloseMock}
        product={product}
      />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  mutateAsyncMock.mockResolvedValue({
    id: 'product-123',
    name: 'Wireless Headphones',
  });

  updateMutateAsyncMock.mockResolvedValue({
    id: 'product-123',
    name: 'Premium Headphones',
  });
});

describe('AddProductModal', () => {
  it('renders the Add Product form', () => {
    renderAddProductModal();

    expect(
      screen.getByRole('heading', { name: 'Add Product' }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Product name/)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Create Product' }),
    ).toBeInTheDocument();
  });

  it('shows a validation error when required fields are empty', () => {
    renderAddProductModal();

    const form = screen.getByRole('dialog').querySelector('form');

    expect(form).not.toBeNull();

    if (!form) {
      throw new Error('Product form was not found.');
    }

    fireEvent.submit(form);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please complete all required fields.',
    );
  });

  it('creates a product and closes the modal after successful submission', async () => {
    const user = userEvent.setup();
    renderAddProductModal();

    await user.type(screen.getByLabelText(/Product name/), 'Wireless Headphones');
    await user.type(screen.getByLabelText(/Description/), 'Noise-cancelling headphones');
    await user.type(screen.getByLabelText(/Category/), 'Electronics');
    await user.type(screen.getByLabelText(/Price/), '79.99');
    await user.type(screen.getByLabelText(/Stock quantity/), '25');

    await user.click(screen.getByRole('button', { name: 'Create Product' }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: 'Wireless Headphones',
        description: 'Noise-cancelling headphones',
        category: 'Electronics',
        price: 79.99,
        stock: 25,
        status: 'active',
        imageUrl: '',
      });

      expect(onCloseMock).toHaveBeenCalledOnce();
    });
  });
  
  it('updates an existing product and closes the modal', async () => {
    const user = userEvent.setup();

    const existingProduct: Product = {
      id: 'product-123',
      name: 'Wireless Headphones',
      description: 'Original description',
      category: 'Electronics',
      price: 49.99,
      stock: 10,
      status: 'active',
      imageUrl: '',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    renderAddProductModal(existingProduct);

    expect(
      screen.getByRole('heading', { name: 'Edit Product' }),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Product name/);
    await user.clear(nameInput);
    await user.type(nameInput, 'Premium Headphones');

    const priceInput = screen.getByLabelText(/Price/);
    await user.clear(priceInput);
    await user.type(priceInput, '89.99');

    await user.click(
      screen.getByRole('button', { name: 'Save Changes' }),
    );

    await waitFor(() => {
      expect(updateMutateAsyncMock).toHaveBeenCalledWith({
        id: 'product-123',
        product: {
          name: 'Premium Headphones',
          description: 'Original description',
          category: 'Electronics',
          price: 89.99,
          stock: 10,
          status: 'active',
          imageUrl: '',
        },

        
      });

      expect(onCloseMock).toHaveBeenCalledOnce();
    });
  });

  
it('rejects a negative product price', async () => {
  const user = userEvent.setup();
  renderAddProductModal();

  await user.type(screen.getByLabelText(/Product name/), 'Test Product');
  await user.type(screen.getByLabelText(/Description/), 'Test description');
  await user.type(screen.getByLabelText(/Category/), 'Electronics');
  await user.type(screen.getByLabelText(/Price/), '-10');
  await user.type(screen.getByLabelText(/Stock quantity/), '5');

  await user.click(screen.getByRole('button', { name: 'Create Product' }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Price must be a valid non-negative number.',
  );
  expect(mutateAsyncMock).not.toHaveBeenCalled();
});

it('rejects a negative stock quantity', async () => {
  const user = userEvent.setup();
  renderAddProductModal();

  await user.type(screen.getByLabelText(/Product name/), 'Test Product');
  await user.type(screen.getByLabelText(/Description/), 'Test description');
  await user.type(screen.getByLabelText(/Category/), 'Electronics');
  await user.type(screen.getByLabelText(/Price/), '10');
  await user.type(screen.getByLabelText(/Stock quantity/), '-2');

  await user.click(screen.getByRole('button', { name: 'Create Product' }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Stock must be a whole number greater than or equal to zero.',
  );
  expect(mutateAsyncMock).not.toHaveBeenCalled();
});

it('rejects a fractional stock quantity', async () => {
  const user = userEvent.setup();
  renderAddProductModal();

  await user.type(screen.getByLabelText(/Product name/), 'Test Product');
  await user.type(screen.getByLabelText(/Description/), 'Test description');
  await user.type(screen.getByLabelText(/Category/), 'Electronics');
  await user.type(screen.getByLabelText(/Price/), '10');
  await user.type(screen.getByLabelText(/Stock quantity/), '2.5');

  await user.click(screen.getByRole('button', { name: 'Create Product' }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Stock must be a whole number greater than or equal to zero.',
  );
  expect(mutateAsyncMock).not.toHaveBeenCalled();
});

});

import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import type { Product } from '../../types';

interface DeleteProductDialogProps {
  product: Product;
  onClose: () => void;
}

export function DeleteProductDialog({
  product,
  onClose,
}: DeleteProductDialogProps) {
  const deleteMutation = useDeleteProduct();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(product.id);
      onClose();
    } catch {
      // The mutation error is displayed below.
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !deleteMutation.isPending
        ) {
          onClose();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <span aria-hidden="true" className="text-xl font-bold">
              !
            </span>
          </div>

          <div>
            <h2
              id="delete-product-title"
              className="text-lg font-bold text-slate-900"
            >
              Delete product?
            </h2>

            <p
              id="delete-product-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900">
                {product.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {deleteMutation.isError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            Failed to delete product. Please try again.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </section>
    </div>
  );
}

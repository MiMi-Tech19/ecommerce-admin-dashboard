import { useState, type FormEvent } from "react";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import type { Product, ProductStatus } from "../../types";

interface AddProductModalProps {
  onClose: () => void;
  product?: Product;
}

export function AddProductModal({ onClose, product }: AddProductModalProps) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isEditing = product !== undefined;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [status, setStatus] = useState<ProductStatus>(
    product?.status ?? "active",
  );
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !name.trim() ||
      !description.trim() ||
      !category.trim() ||
      price.trim() === "" ||
      stock.trim() === ""
    ) {
      setValidationError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setValidationError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setValidationError(
        "Stock must be a whole number greater than or equal to zero.",
      );
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: parsedPrice,
      stock: parsedStock,
      status,
      imageUrl: imageUrl.trim(),
    };

    try {
      if (product) {
        await updateMutation.mutateAsync({
          id: product.id,
          product: productData,
        });
      } else {
        await createMutation.mutateAsync(productData);
      }

      onClose();
    } catch {
      // The appropriate mutation error is displayed below.
    }
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6">
          <h2
            id="product-modal-title"
            className="text-xl font-bold text-slate-900"
          >
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update the details of this product."
              : "Enter the details for your new product."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="product-name"
              className="text-sm font-medium text-slate-700"
            >
              Product name *
            </label>
            <input
              id="product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              placeholder="Wireless Headphones"
              required
            />
          </div>

          <div>
            <label
              htmlFor="product-description"
              className="text-sm font-medium text-slate-700"
            >
              Description *
            </label>
            <textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClassName}
              placeholder="Describe the product"
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-category"
                className="text-sm font-medium text-slate-700"
              >
                Category *
              </label>
              <input
                id="product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={inputClassName}
                placeholder="Electronics"
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="product-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ProductStatus)
                }
                className={inputClassName}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="text-sm font-medium text-slate-700"
              >
                Price *
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClassName}
                placeholder="49.99"
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="text-sm font-medium text-slate-700"
              >
                Stock quantity *
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className={inputClassName}
                placeholder="25"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-image"
              className="text-sm font-medium text-slate-700"
            >
              Image URL
            </label>
            <input
              id="product-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className={inputClassName}
              placeholder="https://example.com/product.jpg"
            />
          </div>

          {validationError && (
            <p role="alert" className="text-sm text-red-600">
              {validationError}
            </p>
          )}

          {(isEditing ? updateMutation.isError : createMutation.isError) && (
            <p role="alert" className="text-sm text-red-600">
              {(() => {
                const error = isEditing
                  ? updateMutation.error
                  : createMutation.error;

                if (error instanceof Error && error.message.trim()) {
                  return error.message;
                }

                return isEditing
                  ? "Failed to update product. Please try again."
                  : "Failed to create product. Please try again.";
              })()}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

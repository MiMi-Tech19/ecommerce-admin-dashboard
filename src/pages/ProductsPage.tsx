import { useProducts } from '../hooks/useProducts';

export function ProductsPage() {
 const {
  data: products = [],
  isLoading,
  isError,
} = useProducts();

  if (isLoading) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Products
        </h1>

        <p className="mt-4 text-slate-600">
          Loading products...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Products
        </h1>

        <p className="mt-4 text-red-600">
          Unable to load products.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">
        Products
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">
              {product.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {product.category}
            </p>

            <p className="mt-4 text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Stock: {product.stock}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
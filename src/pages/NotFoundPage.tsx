import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-900">
        404
      </h1>

      <p className="mt-2 text-slate-600">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        Back to Dashboard
      </Link>
    </section>
  );
}
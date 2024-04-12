import { Link } from 'react-router-dom';

export default function PaymentCompletionPage() {
  return (
    <main className="flex min-h-[50vw] flex-col items-center justify-center gap-5 sm:min-h-[30vw]">
      <h1 className="text-2xl font-bold">Transaction successfully completed</h1>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-400"
      >
        Go To Home Page
      </Link>
    </main>
  );
}

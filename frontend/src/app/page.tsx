export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Task Tracker</h1>
        <p className="text-sm text-gray-600 text-center">
          Simple task management app with authentication, built for the Brew internship
          assignment.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <a
            href="/login"
            className="w-full text-center rounded-md bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="w-full text-center rounded-md border border-slate-300 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

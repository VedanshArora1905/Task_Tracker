export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#f5f5f7]">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Task Tracker
          </h1>
          <p className="text-center text-sm text-gray-600">
            A simple task manager with authentication, priorities, and filters — built for the Brew internship assignment.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/login"
              className="w-full rounded-lg bg-[#007aff] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#0051d5] transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-[#1d1d1f] hover:bg-gray-50 transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

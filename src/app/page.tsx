export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="w-full max-w-4xl p-8 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Welcome to Flashcard App
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Master your knowledge with interactive flashcards
          </p>
        </div>

        {/* Get Started Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Get Started Today
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Create your own flashcards, study at your own pace, and track your progress. Sign in or sign up using the buttons above to begin your learning journey.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

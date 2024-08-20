'use client';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 border-t border-black">
        © 2024 Feed-Back App. All rights reserved.
      </footer>
    </>
  );
}

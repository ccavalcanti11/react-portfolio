export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
          React Portfolio
        </h1>
        <p className="max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
          A boilerplate portfolio built with{" "}
          <strong className="text-black dark:text-white">Next.js</strong>,{" "}
          <strong className="text-black dark:text-white">React</strong>,{" "}
          <strong className="text-black dark:text-white">GraphQL</strong>, and{" "}
          <strong className="text-black dark:text-white">Apollo Client</strong>.
        </p>
      </main>
    </div>
  );
}

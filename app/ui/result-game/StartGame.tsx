'use client';

export default function StartGame({
  title,
  startGame,
  customRender,
}: {
  title?: string;
  startGame: () => void;
  customRender?: () => React.ReactNode;
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center font-bold">
        Welcome to {title ?? 'Memory Game'}!
      </h1>
      <div>{customRender ? customRender() : null}</div>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => startGame()
        }
      >
        Start
      </button>
    </main>
  );
}

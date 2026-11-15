"use client";

export default function Error({ error, reset }) {
  return (
    <div className="text-strokeClr w-full h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl">Something went wrong!</h2>
        <button
          className="underline underline-offset-1 text-lg"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

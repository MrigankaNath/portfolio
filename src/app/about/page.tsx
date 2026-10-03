import type { Metadata } from "next";

export const metadata: Metadata = { title: "about" };

export default function About() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
      <h1>about</h1>
    </main>
  );
}

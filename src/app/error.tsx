"use client";

import { ErrorView } from "@school-management/ui";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorView error={error} reset={reset} className="min-h-screen bg-base" />;
}

import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="min-h-screen bg-black">
        {children}
      </div>
    </Suspense>
  );
}

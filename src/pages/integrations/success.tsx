import Link from 'next/link';
import { useEffect, useState } from 'react';

// Add "use client" directive
const IntegrationSuccess = () => {
  // Use state to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);

  // Only render on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3CDFFF] to-[#4AFFD4]">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#3CDFFF]">
          Integration Connected!
        </h1>
        <p className="mb-6 text-slate-700">
          Thank you for connecting your integration. You can now use voice
          commands to interact with this service.
        </p>
        <Link href="/integrations">
          <a className="inline-block px-6 py-2 rounded bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-slate-900 font-semibold hover:from-[#4AFFD4] hover:to-[#3CDFFF]">
            Back to Integrations
          </a>
        </Link>
      </div>
    </div>
  );
};

export default IntegrationSuccess;

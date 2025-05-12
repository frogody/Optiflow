// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

export default function OrchestratorIdPlaceholder() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Orchestrator Page</h1>
      <p className="text-gray-600 mb-4">This page is temporarily disabled to resolve build issues.</p>
    </div>
  );
} 
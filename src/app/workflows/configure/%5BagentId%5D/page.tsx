// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

export default async function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Workflow Configuration Page</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <p>Placeholder page for workflow configuration</p>
      </div>
    </div>
  );
} 
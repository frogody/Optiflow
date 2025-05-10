'use client';

export default function SimplePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Optiflow - We're Getting Things Back</h1>
      <p className="text-xl mb-8">We're working to restore all your pages and features</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard 
          title="Workflow Automation" 
          description="Automate your business processes with our visual workflow editor"
        />
        <FeatureCard 
          title="Voice Interface" 
          description="Control your workflows with natural language voice commands"
        />
        <FeatureCard 
          title="AI Integration" 
          description="Leverage AI models to add intelligence to your workflows"
        />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Available Pages:</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <PageLink href="/" title="Home" />
          <PageLink href="/features" title="Features" />
          <PageLink href="/pricing" title="Pricing" />
          <PageLink href="/signup" title="Sign Up" />
          <PageLink href="/login" title="Login" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function PageLink({ href, title }: { href: string; title: string }) {
  return (
    <a 
      href={href}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
    >
      {title}
    </a>
  );
} 
// Enable dynamic rendering for all pages to prevent static rendering issues
export const dynamic = 'force-dynamic';

// Disable all caching for pages to ensure fresh content
export const revalidate = 0;

// Disable static generation
export const generateStaticParams = () => {
  return [];
}; 
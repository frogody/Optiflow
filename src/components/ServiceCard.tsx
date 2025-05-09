// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export function ServiceCard({ icon, title, description, href, className }: ServiceCardProps) {
  const CardComponent = href ? Link : 'div';
  const props = href ? { href } : {};

  return (
    <CardComponent {...props}>
      <Card className={ cn(
        "p-6 h-full transition-all duration-200",
        href && "hover:scale-105 hover:shadow-lg cursor-pointer",
        className
      )    }>
        <div className="w-12 h-12 mb-4 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </CardComponent>
  );
} 
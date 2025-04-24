import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const caseStudies = [
  {
    title: 'AI Strategy Transformation',
    company: 'Global Manufacturing Corp',
    description: 'Helped streamline operations with custom AI solutions, resulting in 40% efficiency increase.',
    impact: '40% Efficiency Increase',
    duration: '6 months',
  },
  {
    title: 'Data Integration Success',
    company: 'FinTech Solutions Ltd',
    description: 'Integrated disparate data sources and implemented AI-driven analytics, leading to 25% cost reduction.',
    impact: '25% Cost Reduction',
    duration: '4 months',
  },
  {
    title: 'AI Security Implementation',
    company: 'Healthcare Provider Network',
    description: 'Developed and implemented AI-powered security protocols while ensuring HIPAA compliance.',
    impact: 'Zero Security Breaches',
    duration: '8 months',
  },
];

export function CaseStudyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % caseStudies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((current) => (current - 1 + caseStudies.length) % caseStudies.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {caseStudies.map((study, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-2">{study.title}</h3>
                <p className="text-primary font-medium mb-4">{study.company}</p>
                <p className="text-muted-foreground mb-6">{study.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Impact</p>
                    <p className="font-semibold">{study.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{study.duration}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center mt-4 gap-2">
        {caseStudies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 
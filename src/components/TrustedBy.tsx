import Image from 'next/image';

export function TrustedBy() {
  const partners = [
    { name: 'Partner 1', logo: '/logos/partner1.svg' },
    { name: 'Partner 2', logo: '/logos/partner2.svg' },
    { name: 'Partner 3', logo: '/logos/partner3.svg' },
    { name: 'Partner 4', logo: '/logos/partner4.svg' },
    { name: 'Partner 5', logo: '/logos/partner5.svg' },
  ];

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-8">
        Coming soon
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-75">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="relative w-32 h-12 grayscale hover:grayscale-0 transition-all"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

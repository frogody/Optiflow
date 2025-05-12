'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';

// Security features
const securityFeatures = [
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise-Grade Encryption',
    description: 'All data is protected with AES-256 encryption in transit and at rest, ensuring your sensitive information remains secure at all times.'
  },
  {
    icon: LockClosedIcon,
    title: 'Advanced Authentication',
    description: 'Multi-factor authentication, SSO integration, and customizable session policies to keep your account protected.'
  },
  {
    icon: ServerIcon,
    title: 'Secure Infrastructure',
    description: 'Our cloud infrastructure follows industry best practices with regular security audits, penetration testing, and compliance monitoring.'
  },
  {
    icon: DocumentTextIcon,
    title: 'Compliance & Certifications',
    description: 'Optiflow maintains compliance with SOC 2, GDPR, HIPAA, and other major regulatory standards to meet your industry requirements.'
  },
];

// Compliance certifications
const complianceCertifications = [
  { name: 'SOC 2 Type II', status: 'Compliant' },
  { name: 'GDPR', status: 'Compliant' },
  { name: 'HIPAA', status: 'Compliant' },
  { name: 'ISO 27001', status: 'Compliant' },
  { name: 'CCPA', status: 'Compliant' },
  { name: 'NIST CSF', status: 'Compliant' },
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function SecurityPage() {
  return (
    <div className="bg-[#111111] text-[#E5E7EB]">
      {/* Hero section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#22D3EE]">
            Security & Compliance
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-[#9CA3AF] mb-12">
            Your data security is our top priority. Discover how Optiflow keeps your information safe with enterprise-grade security features and rigorous compliance standards.
          </p>
          <div className="inline-flex rounded-md shadow">
            <Link href="/contact" className="px-5 py-3 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors inline-flex items-center">
              Talk to Security Team
              <Icon name="arrow-right-" className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#22D3EE]">Our Security Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-[#18181B] p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-[#1E293B] rounded-lg mr-3">
                  <feature.icon className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <h3 className="text-xl font-medium text-[#E5E7EB]">{feature.title}</h3>
              </div>
              <p className="text-[#9CA3AF]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#18181B] rounded-xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#22D3EE]">How We Protect Your Data</h2>
            <div className="space-y-4">
              <div className="flex">
                <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 flex-shrink-0" />
                <p className="text-[#E5E7EB]">
                  <strong>Data Encryption</strong> - All data is encrypted both in transit and at rest using industry-standard protocols.
                </p>
              </div>
              <div className="flex">
                <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 flex-shrink-0" />
                <p className="text-[#E5E7EB]">
                  <strong>Access Controls</strong> - Strict role-based access controls with principle of least privilege.
                </p>
              </div>
              <div className="flex">
                <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 flex-shrink-0" />
                <p className="text-[#E5E7EB]">
                  <strong>24/7 Monitoring</strong> - Continuous monitoring of all systems with automated alerts for suspicious activities.
                </p>
              </div>
              <div className="flex">
                <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 flex-shrink-0" />
                <p className="text-[#E5E7EB]">
                  <strong>Regular Backups</strong> - Automated data backups with geographic redundancy to prevent data loss.
                </p>
              </div>
              <div className="flex">
                <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 flex-shrink-0" />
                <p className="text-[#E5E7EB]">
                  <strong>Vulnerability Management</strong> - Regular security assessments and prompt patching of vulnerabilities.
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0891b2] to-[#1e40af] opacity-80 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="lock-closed-" className="h-32 w-32 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#22D3EE]">Compliance & Certifications</h2>
        <p className="text-[#9CA3AF] mb-12 max-w-3xl">
          Optiflow maintains compliance with major security frameworks and regulations. Our security practices are regularly audited by independent third parties to ensure we meet or exceed industry standards.
        </p>
        
        <div className="bg-[#18181B] rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 border-b border-[#374151]">
            <div className="p-4 font-medium text-[#E5E7EB] border-r border-[#374151]">Certification</div>
            <div className="p-4 font-medium text-[#E5E7EB] md:col-span-2">Status</div>
          </div>
          
          {complianceCertifications.map((cert, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-3 border-b border-[#374151] last:border-b-0">
              <div className="p-4 text-[#E5E7EB] border-r border-[#374151]">{cert.name}</div>
              <div className="p-4 text-[#10B981] flex items-center md:col-span-2">
                <Icon name="check-circle-" className="h-5 w-5 mr-2" />
                {cert.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#22D3EE]">Our Security Practices</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#18181B] p-8 rounded-xl">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Security Development Lifecycle</h3>
            <p className="text-[#9CA3AF] mb-4">
              Security is integrated into every stage of our development process. Our engineers follow secure coding practices, and all code undergoes rigorous security review before deployment.
            </p>
            <p className="text-[#9CA3AF]">
              We perform regular static code analysis, dependency scanning, and dynamic application security testing to identify and address potential vulnerabilities early.
            </p>
          </div>
          
          <div className="bg-[#18181B] p-8 rounded-xl">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Incident Response</h3>
            <p className="text-[#9CA3AF] mb-4">
              Our dedicated security team has established comprehensive incident response procedures to quickly address any security events. We regularly test these procedures through simulated incident exercises.
            </p>
            <p className="text-[#9CA3AF]">
              In the event of a security incident, we commit to transparent communication with affected customers in accordance with our contractual obligations and applicable regulations.
            </p>
          </div>
          
          <div className="bg-[#18181B] p-8 rounded-xl">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Physical Security</h3>
            <p className="text-[#9CA3AF] mb-4">
              Our cloud infrastructure is hosted in secure data centers with 24/7 physical security, biometric access controls, and environmental safeguards.
            </p>
            <p className="text-[#9CA3AF]">
              All Optiflow offices have physical access controls, including key card systems and security personnel to ensure only authorized personnel have access to our facilities.
            </p>
          </div>
          
          <div className="bg-[#18181B] p-8 rounded-xl">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Employee Security</h3>
            <p className="text-[#9CA3AF] mb-4">
              All Optiflow employees undergo background checks and receive regular security awareness training to ensure they understand their role in maintaining our security posture.
            </p>
            <p className="text-[#9CA3AF]">
              We enforce strict access controls, multi-factor authentication, and follow the principle of least privilege to ensure employees only have access to the resources necessary for their role.
            </p>
          </div>
        </div>
      </section>

      {/* Security Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#18181B] rounded-xl">
        <h2 className="text-2xl font-bold mb-8 text-[#E5E7EB]">Security Resources</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/security/whitepaper" className="block p-6 bg-[#111111] rounded-lg hover:bg-[#1E293B] transition-colors">
            <Icon name="document-text-" className="h-8 w-8 text-[#22D3EE] mb-4" />
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Security Whitepaper</h3>
            <p className="text-[#9CA3AF]">Download our detailed security whitepaper for a comprehensive overview of our security practices.</p>
          </Link>
          
          <Link href="/security/privacy-shield" className="block p-6 bg-[#111111] rounded-lg hover:bg-[#1E293B] transition-colors">
            <Icon name="shield-check-" className="h-8 w-8 text-[#22D3EE] mb-4" />
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Privacy Shield Certification</h3>
            <p className="text-[#9CA3AF]">Learn about our Privacy Shield certification for international data transfers.</p>
          </Link>
          
          <Link href="/security/pentest-reports" className="block p-6 bg-[#111111] rounded-lg hover:bg-[#1E293B] transition-colors">
            <Icon name="server-" className="h-8 w-8 text-[#22D3EE] mb-4" />
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Penetration Test Reports</h3>
            <p className="text-[#9CA3AF]">View summaries of our most recent third-party penetration tests.</p>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#18181B] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-[#E5E7EB]">Have Security Questions?</h2>
          <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
            Our security team is here to answer any questions you may have about how we protect your data and maintain compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-5 py-3 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors inline-block">
              Contact Security Team
            </Link>
            <Link href="/security/faq" className="px-5 py-3 bg-transparent border border-[#374151] text-[#E5E7EB] rounded-md font-medium hover:bg-[#1E293B] transition-colors inline-block">
              Security FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
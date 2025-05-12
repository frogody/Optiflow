'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import Image from 'next/image';
import Link from 'next/link';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function SecurityPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-[#9CA3AF] mb-8">
        <Link href="/help" className="hover:text-[#22D3EE]">Help Center</Link>
        <span className="mx-2">›</span>
        <span>Security & Compliance</span>
      </div>
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#22D3EE] mb-4">Security & Compliance</h1>
        <p className="text-lg text-[#9CA3AF]">
          Learn about Optiflow's comprehensive security measures, compliance certifications, 
          and how we keep your data and workflows protected.
        </p>
      </div>
      
      {/* Security Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Security Overview</h2>
        <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6 mb-6">
          <p className="text-[#9CA3AF] mb-4">
            At Optiflow, security is a top priority in everything we build. Our platform is designed 
            with a security-first approach to protect your data, connections, and workflow automations.
          </p>
          <p className="text-[#9CA3AF]">
            We implement multiple layers of security controls across our infrastructure, application,
            and operational processes to safeguard against threats and ensure compliance with 
            industry standards.
          </p>
        </div>
        
        {/* Security Pillars */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Icon name="lock-closed-" className="h-8 w-8 text-[#22D3EE] mr-3" />
              <h3 className="text-xl font-medium text-[#E5E7EB]">Data Security</h3>
            </div>
            <ul className="space-y-3 text-[#9CA3AF]">
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Strict access controls and least privilege principles</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Regular security assessments and penetration testing</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Icon name="server-" className="h-8 w-8 text-[#22D3EE] mr-3" />
              <h3 className="text-xl font-medium text-[#E5E7EB]">Infrastructure Security</h3>
            </div>
            <ul className="space-y-3 text-[#9CA3AF]">
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>SOC 2 compliant cloud infrastructure</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Network security with firewalls and intrusion detection</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Continuous monitoring and automated threat response</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Compliance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Compliance</h2>
        <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-[#111111] border border-[#374151] rounded-lg px-4 py-3 flex items-center">
              <span className="text-[#E5E7EB] font-medium">GDPR</span>
            </div>
            <div className="bg-[#111111] border border-[#374151] rounded-lg px-4 py-3 flex items-center">
              <span className="text-[#E5E7EB] font-medium">CCPA</span>
            </div>
            <div className="bg-[#111111] border border-[#374151] rounded-lg px-4 py-3 flex items-center">
              <span className="text-[#E5E7EB] font-medium">SOC 2</span>
            </div>
            <div className="bg-[#111111] border border-[#374151] rounded-lg px-4 py-3 flex items-center">
              <span className="text-[#E5E7EB] font-medium">ISO 27001</span>
            </div>
            <div className="bg-[#111111] border border-[#374151] rounded-lg px-4 py-3 flex items-center">
              <span className="text-[#E5E7EB] font-medium">HIPAA</span>
              <span className="ml-2 text-xs text-[#9CA3AF]">(Enterprise plan)</span>
            </div>
          </div>
          
          <p className="text-[#9CA3AF]">
            Optiflow maintains compliance with major regulatory frameworks and industry standards.
            We regularly undergo independent audits and assessments to verify our compliance status.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Data Privacy</h3>
            <p className="text-[#9CA3AF] mb-4">
              We are committed to protecting your privacy and complying with global data protection regulations:
            </p>
            <ul className="space-y-3 text-[#9CA3AF]">
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>GDPR and CCPA compliant data handling practices</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Transparent data collection and processing policies</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>User data controls and export capabilities</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Enterprise Compliance</h3>
            <p className="text-[#9CA3AF] mb-4">
              Enterprise customers benefit from additional compliance features:
            </p>
            <ul className="space-y-3 text-[#9CA3AF]">
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>HIPAA compliance for healthcare data</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Custom data retention policies</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Advanced audit logging and compliance reporting</span>
              </li>
              <li className="flex items-start">
                <Icon name="check-" className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0 mt-0.5" />
                <span>Single Sign-On (SSO) and custom security controls</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Security Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Security Features</h2>
        
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Authentication & Access</h3>
            <ul className="space-y-4 text-[#9CA3AF]">
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="shield-check-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">Multi-Factor Authentication (MFA)</h4>
                  <p>Add an extra layer of security with MFA options including authenticator apps, SMS, and security keys.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="shield-check-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">Single Sign-On (SSO)</h4>
                  <p>Enterprise customers can integrate with identity providers using SAML 2.0 or OAuth 2.0.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="shield-check-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">Role-Based Access Control</h4>
                  <p>Granular permissions to control who can view, edit, and execute workflows.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-xl font-medium text-[#E5E7EB] mb-4">Data Protection</h3>
            <ul className="space-y-4 text-[#9CA3AF]">
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="lock-closed-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">End-to-End Encryption</h4>
                  <p>All data transmission within Optiflow is encrypted using TLS 1.2+ protocols.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="lock-closed-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">Secure Credential Storage</h4>
                  <p>Integration credentials are encrypted and stored using industry-standard key management systems.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-[#111111] rounded-full p-2 mr-4 mt-1">
                  <Icon name="lock-closed-" className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#E5E7EB] mb-1">Data Retention Controls</h4>
                  <p>Configure custom data retention policies to automatically purge workflow execution data based on your requirements.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Security Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Security Best Practices</h2>
        
        <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
          <p className="text-[#9CA3AF] mb-4">
            Follow these recommended practices to maximize security for your Optiflow account:
          </p>
          
          <ul className="space-y-4 text-[#9CA3AF]">
            <li className="flex items-start">
              <div className="bg-[#111111] rounded-full p-1.5 mr-3 mt-0.5">
                <span className="text-[#22D3EE] font-medium text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-[#E5E7EB] mb-1">Enable Multi-Factor Authentication</h4>
                <p>Always use MFA to protect your account from unauthorized access.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-[#111111] rounded-full p-1.5 mr-3 mt-0.5">
                <span className="text-[#22D3EE] font-medium text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-[#E5E7EB] mb-1">Implement Least Privilege Access</h4>
                <p>Only grant necessary permissions to team members based on their roles.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-[#111111] rounded-full p-1.5 mr-3 mt-0.5">
                <span className="text-[#22D3EE] font-medium text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-[#E5E7EB] mb-1">Regularly Review Integrations</h4>
                <p>Audit your connected apps and revoke access for unused integrations.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-[#111111] rounded-full p-1.5 mr-3 mt-0.5">
                <span className="text-[#22D3EE] font-medium text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium text-[#E5E7EB] mb-1">Monitor Workflow Activities</h4>
                <p>Regularly check audit logs for unusual patterns or unauthorized actions.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-[#111111] rounded-full p-1.5 mr-3 mt-0.5">
                <span className="text-[#22D3EE] font-medium text-sm">5</span>
              </div>
              <div>
                <h4 className="font-medium text-[#E5E7EB] mb-1">Secure API Keys</h4>
                <p>Rotate API keys regularly and never share them in public repositories.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Security Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Additional Resources</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/privacy" 
            className="block bg-[#111111] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors"
          >
            <div className="flex items-center mb-2">
              <Icon name="document-text-" className="h-5 w-5 text-[#22D3EE] mr-2" />
              <h3 className="text-lg font-medium text-[#E5E7EB]">Privacy Policy</h3>
            </div>
            <p className="text-[#9CA3AF] mb-2">
              Learn about how we collect, use, and protect your personal information.
            </p>
            <span className="text-[#22D3EE] text-sm flex items-center">
              Read more <Icon name="arrow-top-right-on-square-" className="h-3 w-3 ml-1" />
            </span>
          </Link>
          
          <Link 
            href="/security" 
            className="block bg-[#111111] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors"
          >
            <div className="flex items-center mb-2">
              <Icon name="shield-check-" className="h-5 w-5 text-[#22D3EE] mr-2" />
              <h3 className="text-lg font-medium text-[#E5E7EB]">Security Policy</h3>
            </div>
            <p className="text-[#9CA3AF] mb-2">
              Detailed overview of our security practices and commitments.
            </p>
            <span className="text-[#22D3EE] text-sm flex items-center">
              Read more <Icon name="arrow-top-right-on-square-" className="h-3 w-3 ml-1" />
            </span>
          </Link>
          
          <Link 
            href="/help/security/compliance" 
            className="block bg-[#111111] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors"
          >
            <div className="flex items-center mb-2">
              <Icon name="document-text-" className="h-5 w-5 text-[#22D3EE] mr-2" />
              <h3 className="text-lg font-medium text-[#E5E7EB]">Compliance Documentation</h3>
            </div>
            <p className="text-[#9CA3AF] mb-2">
              Access detailed documentation about our compliance certifications.
            </p>
            <span className="text-[#22D3EE] text-sm flex items-center">
              View documents <Icon name="arrow-top-right-on-square-" className="h-3 w-3 ml-1" />
            </span>
          </Link>
          
          <Link 
            href="/help/contact-support" 
            className="block bg-[#111111] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors"
          >
            <div className="flex items-center mb-2">
              <Icon name="shield-check-" className="h-5 w-5 text-[#22D3EE] mr-2" />
              <h3 className="text-lg font-medium text-[#E5E7EB]">Security Support</h3>
            </div>
            <p className="text-[#9CA3AF] mb-2">
              Questions about security or need to report a concern? Contact our security team.
            </p>
            <span className="text-[#22D3EE] text-sm flex items-center">
              Contact support <Icon name="arrow-top-right-on-square-" className="h-3 w-3 ml-1" />
            </span>
          </Link>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">Security FAQs</h2>
        
        <div className="space-y-4">
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">How does Optiflow secure API credentials?</h3>
            <p className="text-[#9CA3AF]">
              API credentials for integrations are encrypted using AES-256 before being stored in our database. 
              The encryption keys are managed in a separate key management system with strict access controls. 
              Credentials are only decrypted when needed for workflow execution and never exposed in logs or to users.
            </p>
          </div>
          
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Can I get a copy of your security certifications?</h3>
            <p className="text-[#9CA3AF]">
              Yes, our compliance documentation, including SOC 2 reports and ISO 27001 certificates, 
              is available to customers under NDA. Enterprise customers can request these documents 
              through their account manager, while other customers can contact our support team.
            </p>
          </div>
          
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">How does Optiflow handle data residency requirements?</h3>
            <p className="text-[#9CA3AF]">
              Enterprise plans include data residency options that allow you to specify the geographic 
              region where your data is stored and processed. This helps meet regulatory requirements 
              for data localization in specific jurisdictions. Currently, we offer data residency options 
              in the US, EU, and Asia-Pacific regions.
            </p>
          </div>
          
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">What is your incident response process?</h3>
            <p className="text-[#9CA3AF]">
              We have a comprehensive incident response plan that includes detection, containment, 
              eradication, and recovery procedures. In the event of a security incident affecting 
              customer data, we notify affected customers within 72 hours, providing details about 
              the impact and remediation steps. Our security team conducts post-incident reviews 
              to prevent similar issues in the future.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 
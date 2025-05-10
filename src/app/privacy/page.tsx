'use client';

import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#111111] text-[#E5E7EB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E5E7EB] mb-2">Privacy Policy</h1>
          <div className="flex items-center justify-center text-[#9CA3AF] text-sm">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Last updated: June 1, 2023</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">1. Introduction</h2>
            <p className="text-[#E5E7EB] mb-4">
              Optiflow, Inc. ("Optiflow," "we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services (collectively, the "Services").
            </p>
            <p className="text-[#E5E7EB] mb-4">
              Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">2. Information We Collect</h2>
            <p className="text-[#E5E7EB] mb-4">
              We collect several types of information from and about users of our Services:
            </p>
            
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">2.1. Personal Data</h3>
            <p className="text-[#E5E7EB] mb-4">
              Personal Data refers to information that can be used to identify you directly or indirectly. We may collect the following Personal Data:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Identity Information:</strong> Name, email address, job title, and company.</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), and account preferences.</li>
              <li><strong>Contact Information:</strong> Email address, telephone number, and physical address.</li>
              <li><strong>Billing Information:</strong> Payment method details, billing address, and transaction history.</li>
              <li><strong>Profile Information:</strong> Profile picture, user biography, and social media handles.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">2.2. Usage Data</h3>
            <p className="text-[#E5E7EB] mb-4">
              We automatically collect certain information about how you interact with our Services:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Log Data:</strong> IP address, browser type, operating system, referring web page, pages visited, date/time stamp, and clickstream data.</li>
              <li><strong>Device Information:</strong> Device type, operating system, and browser information.</li>
              <li><strong>Performance Data:</strong> Page load times, crashes, and other usage statistics.</li>
              <li><strong>Feature Usage:</strong> Information about how you use specific features of our Services, such as workflow executions, AI interactions, and voice commands.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">2.3. Content Data</h3>
            <p className="text-[#E5E7EB] mb-4">
              We collect and store content that you create, upload, or receive while using our Services, including:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Workflow Data:</strong> The configuration, structure, and content of workflows you create.</li>
              <li><strong>Voice Data:</strong> Audio recordings and transcripts from voice interactions with our Services.</li>
              <li><strong>Integration Data:</strong> Data from third-party services you connect to Optiflow, such as Pipedream connections.</li>
              <li><strong>Communications:</strong> Messages, comments, and other communications within our platform.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">3. How We Collect Information</h2>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.1. Direct Collection</h3>
            <p className="text-[#E5E7EB] mb-4">
              We collect information directly from you when you:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Register for an account or create a profile.</li>
              <li>Fill out forms or surveys within our Services.</li>
              <li>Communicate with us via email, chat, or other means.</li>
              <li>Subscribe to our newsletter or marketing communications.</li>
              <li>Participate in promotions, contests, or events.</li>
              <li>Report problems or request support.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">3.2. Automated Collection</h3>
            <p className="text-[#E5E7EB] mb-4">
              We use automated technologies to collect information, including:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar technologies to collect information about your browsing behavior, preferences, and device characteristics. For more information, please see our <Link href="/cookies" className="text-[#22D3EE] hover:text-[#06B6D4]">Cookie Policy</Link>.</li>
              <li><strong>Analytics Tools:</strong> We use analytics tools to measure and analyze usage patterns, feature adoption, and performance metrics.</li>
              <li><strong>Application Data:</strong> Our Services automatically record certain information about your actions while using them.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">3.3. Third-Party Sources</h3>
            <p className="text-[#E5E7EB] mb-4">
              We may receive information about you from third parties, including:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Business partners, such as integration providers and resellers.</li>
              <li>Authentication services when you sign in using third-party login providers (e.g., Google, GitHub).</li>
              <li>Publicly available sources, like company websites or professional networking sites.</li>
              <li>Service providers, including payment processors and customer support tools.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">4. How We Use Your Information</h2>
            <p className="text-[#E5E7EB] mb-4">
              We use the information we collect for the following purposes:
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">4.1. Providing and Improving the Services</h3>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>To create and maintain your account.</li>
              <li>To deliver the features and functionality you request.</li>
              <li>To personalize your experience and customize content.</li>
              <li>To develop new products, services, and features.</li>
              <li>To analyze and improve the performance and functionality of our Services.</li>
              <li>To process and complete transactions.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">4.2. Communications</h3>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>To communicate with you about your account or our Services.</li>
              <li>To respond to your inquiries, comments, or questions.</li>
              <li>To send administrative information, such as updates to our terms or privacy policies.</li>
              <li>To send marketing communications, newsletters, and promotional materials.</li>
              <li>To provide support and assistance.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">4.3. Research and Analytics</h3>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>To conduct research and analytics to understand how users interact with our Services.</li>
              <li>To generate anonymous, aggregated statistics about our user base.</li>
              <li>To evaluate the effectiveness of our marketing campaigns.</li>
              <li>To improve our AI models and voice recognition capabilities.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">4.4. Legal and Security Purposes</h3>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>To enforce our <Link href="/terms" className="text-[#22D3EE] hover:text-[#06B6D4]">Terms of Service</Link> and other legal rights.</li>
              <li>To protect the security and integrity of our Services.</li>
              <li>To detect, prevent, and address fraud, abuse, security risks, and technical issues.</li>
              <li>To comply with applicable laws, regulations, and legal processes.</li>
              <li>To respond to lawful requests from public authorities.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">5. Legal Basis for Processing (for EEA/UK Users)</h2>
            <p className="text-[#E5E7EB] mb-4">
              If you are in the European Economic Area (EEA) or the United Kingdom (UK), we collect and process your Personal Data only when we have a legal basis for doing so under applicable law, including:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Contractual Necessity:</strong> To perform the contract we have with you, such as our Terms of Service, or to take steps at your request before entering into such a contract.</li>
              <li><strong>Legitimate Interests:</strong> To pursue our legitimate interests, provided that our interests are not overridden by your data protection interests or fundamental rights and freedoms.</li>
              <li><strong>Consent:</strong> When you have given us specific consent to process your data for a specific purpose.</li>
              <li><strong>Legal Obligation:</strong> When we need to comply with a legal obligation.</li>
              <li><strong>Vital Interests:</strong> To protect your vital interests or those of another person.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-[#E5E7EB] mb-4">
              We may share your information with the following third parties:
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.1. Service Providers</h3>
            <p className="text-[#E5E7EB] mb-4">
              We share information with third-party vendors, consultants, and other service providers who need access to your information to help us provide the Services, including:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Cloud hosting and infrastructure providers.</li>
              <li>Payment processors and billing services.</li>
              <li>Customer support and communication tools.</li>
              <li>Analytics and monitoring services.</li>
              <li>AI and machine learning providers (e.g., for our LLM services).</li>
              <li>Voice recognition and text-to-speech services (e.g., ElevenLabs).</li>
              <li>Integration platforms (e.g., Pipedream).</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">6.2. Integrations and Third-Party Services</h3>
            <p className="text-[#E5E7EB] mb-4">
              When you choose to use third-party integrations or connect our Services to third-party services, we may share information with those third parties. The information shared will be governed by the privacy policies of those third-party services.
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">6.3. Business Transfers</h3>
            <p className="text-[#E5E7EB] mb-4">
              If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your Personal Data.
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">6.4. Legal Requirements</h3>
            <p className="text-[#E5E7EB] mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency). We may also disclose your information to:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Enforce our rights, privacy policy, and other legal agreements.</li>
              <li>Protect against legal liability.</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Services.</li>
              <li>Protect the rights, property, or safety of Optiflow, our users, or others.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">6.5. With Your Consent</h3>
            <p className="text-[#E5E7EB] mb-4">
              We may share your information with third parties when you have given us your consent to do so.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">7. International Data Transfers</h2>
            <p className="text-[#E5E7EB] mb-4">
              We are based in the United States and process data globally. If you are accessing our Services from outside the United States, your information may be transferred to, stored, and processed in the United States or other countries where our service providers maintain facilities.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              If you are in the EEA, UK, or Switzerland, we ensure that such transfers comply with applicable data protection laws, including by implementing appropriate safeguards such as standard contractual clauses approved by the European Commission or other lawful transfer mechanisms.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">8. Data Security</h2>
            <p className="text-[#E5E7EB] mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of your information. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your information, the transmission of information to and from our Services is at your own risk. You should only access the Services within a secure environment.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Encryption of sensitive data in transit and at rest.</li>
              <li>Regular security assessments and penetration testing.</li>
              <li>Access controls and authentication mechanisms.</li>
              <li>Monitoring for suspicious activities and unauthorized access attempts.</li>
              <li>Regular security training for our employees.</li>
              <li>Secure development practices and code reviews.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">9. Data Retention</h2>
            <p className="text-[#E5E7EB] mb-4">
              We retain your Personal Data for as long as necessary to fulfill the purposes for which we collected it, including to provide you with the Services, comply with legal obligations, resolve disputes, and enforce our legal agreements.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              When determining the retention period, we consider:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>The amount, nature, and sensitivity of the information.</li>
              <li>The potential risk of harm from unauthorized use or disclosure.</li>
              <li>The purposes for which we process the information.</li>
              <li>Whether we can achieve those purposes through other means.</li>
              <li>Applicable legal, regulatory, or contractual requirements.</li>
            </ul>
            <p className="text-[#E5E7EB] mb-4">
              In some circumstances, we may anonymize your Personal Data so that it can no longer be associated with you, in which case we may use such information without further notice to you.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">10. Your Data Protection Rights</h2>
            <p className="text-[#E5E7EB] mb-4">
              Depending on your location, you may have certain rights regarding your Personal Data:
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">10.1. Rights for All Users</h3>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Access:</strong> You can request copies of your Personal Data.</li>
              <li><strong>Correction:</strong> You can request that we correct inaccurate information about you.</li>
              <li><strong>Deletion:</strong> You can request that we delete your Personal Data in certain circumstances.</li>
              <li><strong>Opt-out of Communications:</strong> You can opt out of marketing communications at any time.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">10.2. Additional Rights for EEA/UK/California Residents</h3>
            <p className="text-[#E5E7EB] mb-4">
              If you are located in the EEA, UK, California, or other jurisdictions with similar laws, you may have additional rights:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Data Portability:</strong> You can request a copy of your Personal Data in a structured, commonly used, machine-readable format.</li>
              <li><strong>Restriction of Processing:</strong> You can request that we restrict the processing of your Personal Data under certain circumstances.</li>
              <li><strong>Objection to Processing:</strong> You can object to our processing of your Personal Data based on our legitimate interests.</li>
              <li><strong>Automated Decision-Making:</strong> You can request not to be subject to automated decision-making, including profiling, that has legal or significant effects on you.</li>
              <li><strong>Withdraw Consent:</strong> You can withdraw consent at any time where we rely on consent to process your Personal Data.</li>
              <li><strong>Do Not Sell:</strong> California residents can request that we do not sell their Personal Data.</li>
            </ul>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 mt-6">10.3. How to Exercise Your Rights</h3>
            <p className="text-[#E5E7EB] mb-4">
              To exercise your rights, please contact us at privacy@optiflow.com. We will respond to your request within the timeframe required by applicable law.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              For your protection, we may need to verify your identity before implementing your request. We will not discriminate against you for exercising any of your data protection rights.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">11. Children's Privacy</h2>
            <p className="text-[#E5E7EB] mb-4">
              Our Services are not intended for children under the age of 16. We do not knowingly collect Personal Data from children under 16. If you are a parent or guardian and you believe your child has provided us with Personal Data, please contact us at privacy@optiflow.com, and we will take steps to delete such information.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">12. Voice Data Processing</h2>
            <p className="text-[#E5E7EB] mb-4">
              When you use our voice features, we collect and process voice data:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Voice Recordings:</strong> We collect audio recordings when you use voice commands or interact with our voice assistant features.</li>
              <li><strong>Transcriptions:</strong> We convert voice recordings to text to understand and process your requests.</li>
              <li><strong>Voice Synthesis:</strong> When generating voice responses, we may use voice synthesis technology.</li>
            </ul>
            <p className="text-[#E5E7EB] mb-4">
              We use voice data to:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Process and respond to your voice commands.</li>
              <li>Improve our voice recognition and processing capabilities.</li>
              <li>Develop and enhance our voice features.</li>
              <li>Troubleshoot and fix issues with voice functionality.</li>
            </ul>
            <p className="text-[#E5E7EB] mb-4">
              We may share voice data with third-party service providers that help us provide voice functionality, such as speech recognition and voice synthesis providers. These providers are bound by contractual obligations to protect your data.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">13. Changes to Privacy Policy</h2>
            <p className="text-[#E5E7EB] mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes, we will provide additional notice, such as sending an email or displaying a prominent notice within our Services.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              We encourage you to review this Privacy Policy periodically to stay informed about our data practices.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">14. Contact Information</h2>
            <p className="text-[#E5E7EB] mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="text-[#E5E7EB]">
              <p>Optiflow, Inc.</p>
              <p>Attn: Privacy Officer</p>
              <p>1234 Innovation Way</p>
              <p>San Francisco, CA 94107</p>
              <p>privacy@optiflow.com</p>
            </div>
            <p className="text-[#E5E7EB] mt-4">
              For users in the EEA, UK, or Switzerland, Optiflow, Inc. is the data controller responsible for your Personal Data. If you are not satisfied with our response, you may have the right to lodge a complaint with a supervisory authority in the country where you reside, work, or where you believe an infringement has occurred.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
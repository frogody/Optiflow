'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function TermsOfService() {
  return (
    <div className="bg-[#111111] text-[#E5E7EB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E5E7EB] mb-2">Terms of Service</h1>
          <div className="flex items-center justify-center text-[#9CA3AF] text-sm">
            <Icon name="calendar-" className="h-4 w-4 mr-1" />
            <span>Last updated: June 1, 2023</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">1. Introduction</h2>
            <p className="text-[#E5E7EB] mb-4">
              Welcome to Optiflow ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the Optiflow platform, including our website, applications, APIs, and other services (collectively, the "Services").
            </p>
            <p className="text-[#E5E7EB] mb-4">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services. Please read these Terms carefully before using our Services.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li><strong>Account:</strong> Your account on the Optiflow platform that enables you to access and use our Services.</li>
              <li><strong>Content:</strong> Any information, data, text, software, graphics, messages, or other materials that you upload, create, display, share, or otherwise provide through the Services.</li>
              <li><strong>Subscription:</strong> A paid plan that grants you access to premium features of the Services.</li>
              <li><strong>User:</strong> Any individual or entity that accesses or uses the Services.</li>
              <li><strong>Workflow:</strong> A sequence of automated tasks and operations created and executed through the Services.</li>
              <li><strong>Credit System:</strong> Our usage-based billing system that charges for certain actions based on computational resources used.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">3. Account Registration and Use</h2>
            <p className="text-[#E5E7EB] mb-4">
              To use certain features of the Services, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              You are solely responsible for all Content you upload, create, or share through the Services. You agree not to use the Services for any illegal or unauthorized purpose.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">4. Subscription Terms</h2>
            <p className="text-[#E5E7EB] mb-4">
              Some features of the Services require a paid Subscription. By subscribing to a paid plan, you agree to pay all fees associated with the Subscription you select.
            </p>
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">4.1. Fees and Payments</h3>
            <p className="text-[#E5E7EB] mb-4">
              We will bill you in advance for your Subscription on a recurring basis (monthly or annually, depending on your selection). All payments are non-refundable except as expressly stated in these Terms.
            </p>
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">4.2. Credit System Usage</h3>
            <p className="text-[#E5E7EB] mb-4">
              Certain actions within the platform may consume credits. Your Subscription includes a specific number of credits per billing period. Additional credits can be purchased separately. Unused credits expire at the end of your billing period unless otherwise specified.
            </p>
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">4.3. Renewal and Cancellation</h3>
            <p className="text-[#E5E7EB] mb-4">
              Your Subscription will automatically renew unless you cancel it. You may cancel your Subscription at any time through your account settings. If you cancel, you can continue to use your Subscription until the end of your current billing period, but you will not receive a refund for any fees already paid.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">5. Acceptable Use</h2>
            <p className="text-[#E5E7EB] mb-4">
              You agree not to use the Services to:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Violate any applicable law or regulation.</li>
              <li>Infringe the intellectual property rights of others.</li>
              <li>Send spam or unsolicited communications.</li>
              <li>Distribute malware or other harmful code.</li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services.</li>
              <li>Collect or store personal data about other users without their consent.</li>
              <li>Engage in any activity that could reasonably be expected to cause harm to Optiflow or other users.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">6. Intellectual Property Rights</h2>
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.1. Optiflow's Intellectual Property</h3>
            <p className="text-[#E5E7EB] mb-4">
              The Services and all content, features, and functionality thereof, including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof, are owned by Optiflow, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.2. User Content</h3>
            <p className="text-[#E5E7EB] mb-4">
              You retain ownership of any intellectual property rights that you hold in the Content you create, upload, or share through the Services. By creating, uploading, or sharing Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such Content in connection with providing the Services to you and other users.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">7. Confidentiality</h2>
            <p className="text-[#E5E7EB] mb-4">
              We take the confidentiality of your data seriously. We will not access, view, or process your Content except:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>As necessary to provide the Services to you.</li>
              <li>As otherwise specified in our <Link href="/privacy" className="text-[#22D3EE] hover:text-[#06B6D4]">Privacy Policy</Link>.</li>
              <li>As required by law or legal process.</li>
              <li>As authorized by you.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">8. Disclaimers of Warranties</h2>
            <p className="text-[#E5E7EB] mb-4">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">9. Limitation of Liability</h2>
            <p className="text-[#E5E7EB] mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL OPTIFLOW, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES;</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES;</li>
              <li>ANY CONTENT OBTAINED FROM THE SERVICES; AND</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,</li>
            </ul>
            <p className="text-[#E5E7EB] mt-4">
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">10. Indemnification</h2>
            <p className="text-[#E5E7EB] mb-4">
              You agree to indemnify, defend, and hold harmless Optiflow, its affiliates, officers, directors, employees, consultants, agents, and representatives from any and all claims, liabilities, damages, losses, costs, expenses, fees (including reasonable attorneys' fees) that such parties may incur as a result of or arising from:
            </p>
            <ul className="list-disc pl-6 text-[#E5E7EB] space-y-2">
              <li>Your use of the Services;</li>
              <li>Your violation of these Terms;</li>
              <li>Your violation of any rights of any other person or entity; or</li>
              <li>Any Content you upload, create, or share through the Services.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">11. Term and Termination</h2>
            <p className="text-[#E5E7EB] mb-4">
              These Terms will remain in full force and effect while you use the Services. We may terminate or suspend your account or access to the Services at any time, for any reason, without prior notice or liability, including if you violate any provision of these Terms.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              Upon termination of your account, your right to use the Services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-[#E5E7EB] mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              Any dispute arising out of or relating to these Terms or the Services shall be resolved through binding arbitration in San Francisco, California, in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall be conducted by a single arbitrator, and the award shall be final and binding on the parties. The prevailing party shall be entitled to recover its reasonable attorneys' fees and costs.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">13. Changes to Terms</h2>
            <p className="text-[#E5E7EB] mb-4">
              We may revise these Terms from time to time. The most current version will always be posted on our website. If a revision, in our sole discretion, is material, we will notify you via email or through the Services. By continuing to access or use the Services after those revisions become effective, you agree to be bound by the revised Terms.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">14. Contact Information</h2>
            <p className="text-[#E5E7EB] mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="text-[#E5E7EB]">
              <p>Optiflow, Inc.</p>
              <p>1234 Innovation Way</p>
              <p>San Francisco, CA 94107</p>
              <p>legal@optiflow.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
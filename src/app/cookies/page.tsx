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

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#111111] text-[#E5E7EB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E5E7EB] mb-2">Cookie Policy</h1>
          <div className="flex items-center justify-center text-[#9CA3AF] text-sm">
            <Icon name="calendar-" className="h-4 w-4 mr-1" />
            <span>Last updated: June 1, 2023</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">1. Introduction</h2>
            <p className="text-[#E5E7EB] mb-4">
              This Cookie Policy explains how Optiflow, Inc. ("Optiflow," "we," "our," or "us") uses cookies and similar technologies when you visit our website, applications, or other online services (collectively, the "Services").
            </p>
            <p className="text-[#E5E7EB] mb-4">
              By using our Services, you consent to our use of cookies and similar technologies in accordance with this Cookie Policy and our <Link href="/privacy" className="text-[#22D3EE] hover:text-[#06B6D4]">Privacy Policy</Link>.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">2. What Are Cookies?</h2>
            <p className="text-[#E5E7EB] mb-4">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. Cookies are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              Cookies enable us to recognize your device and collect information about how you use our Services. They also allow us to remember your preferences, improve your user experience, and tailor content to your interests.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">3. Types of Cookies We Use</h2>
            <p className="text-[#E5E7EB] mb-4">
              We use the following types of cookies and similar technologies:
            </p>
            
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.1. Essential Cookies</h3>
            <p className="text-[#E5E7EB] mb-4">
              These cookies are necessary for our Services to function properly. They enable you to navigate our Services and use their features, such as accessing secure areas. Without these cookies, certain services cannot be provided.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg mb-6">
              <p className="text-[#9CA3AF] text-sm">
                <strong>Examples:</strong> Session cookies, authentication cookies, security cookies, and cookies that remember your language preferences.
              </p>
            </div>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.2. Performance and Analytics Cookies</h3>
            <p className="text-[#E5E7EB] mb-4">
              These cookies collect information about how visitors use our Services, including which pages visitors go to most often and if they receive error messages. We use this information to improve our Services and to understand how visitors interact with our content.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg mb-6">
              <p className="text-[#9CA3AF] text-sm">
                <strong>Examples:</strong> Google Analytics, Mixpanel, and other analytics tool cookies that help us understand user behavior and improve our Services.
              </p>
            </div>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.3. Functionality Cookies</h3>
            <p className="text-[#E5E7EB] mb-4">
              These cookies allow our Services to remember choices you make and provide enhanced, personalized features. They may also be used to provide services you have requested, such as watching a video or commenting on a blog.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg mb-6">
              <p className="text-[#9CA3AF] text-sm">
                <strong>Examples:</strong> Cookies that remember your preferences, settings, and choices, such as your preferred language or region.
              </p>
            </div>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.4. Targeting and Advertising Cookies</h3>
            <p className="text-[#E5E7EB] mb-4">
              These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and to help measure the effectiveness of advertising campaigns. They are usually placed by our advertising partners with our permission.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg mb-6">
              <p className="text-[#9CA3AF] text-sm">
                <strong>Examples:</strong> Cookies from advertising networks like Google AdWords, Facebook Pixel, and LinkedIn Insights.
              </p>
            </div>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">3.5. Social Media Cookies</h3>
            <p className="text-[#E5E7EB] mb-4">
              These cookies are set by social media services that we have added to our Services to enable you to share our content with your connections and networks. They are capable of tracking your browser across other sites and building a profile of your interests, which may impact the content and messages you see on other websites you visit.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg">
              <p className="text-[#9CA3AF] text-sm">
                <strong>Examples:</strong> Cookies from social sharing buttons for Facebook, Twitter, LinkedIn, and other social media platforms.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">4. Third-Party Cookies</h2>
            <p className="text-[#E5E7EB] mb-4">
              Some cookies we use are from third-party companies, such as Google Analytics, to provide us with analytics about our Services. These companies may also use cookies to collect information about your online activities across different websites and services.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              We do not control these third parties or how they may use their cookies. We suggest you check their websites for more information about their cookies and how to manage them.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              The third-party services we use that may set cookies include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#E5E7EB]">
              <li>Google Analytics</li>
              <li>Google Tag Manager</li>
              <li>HubSpot</li>
              <li>Intercom</li>
              <li>Mixpanel</li>
              <li>Stripe</li>
              <li>LinkedIn Insights</li>
              <li>Facebook Pixel</li>
              <li>Twitter Analytics</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">5. Cookie Duration</h2>
            <p className="text-[#E5E7EB] mb-4">
              The cookies we use fall into two categories based on how long they remain on your device:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#E5E7EB]">
              <li>
                <strong>Session Cookies:</strong> These cookies are temporary and are deleted from your device when you close your browser. They are used to remember you during a single browsing session.
              </li>
              <li>
                <strong>Persistent Cookies:</strong> These cookies remain on your device for a set period, which can range from days to years, or until you delete them manually. They are used to remember your preferences across multiple browsing sessions.
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">6. Managing Cookies</h2>
            <p className="text-[#E5E7EB] mb-4">
              You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and parts of our Services may no longer be fully accessible.
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.1. Browser Settings</h3>
            <p className="text-[#E5E7EB] mb-4">
              Most browsers allow you to control cookies through their settings. These settings are typically found in the "Options," "Preferences," or "Settings" menu of your browser. You can also consult the help section of your browser for more information.
            </p>
            <div className="bg-[#18181B] p-4 rounded-lg mb-6">
              <div className="space-y-3">
                <p className="text-[#9CA3AF] text-sm">
                  <strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">https://support.google.com/chrome/answer/95647</a>
                </p>
                <p className="text-[#9CA3AF] text-sm">
                  <strong>Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer</a>
                </p>
                <p className="text-[#9CA3AF] text-sm">
                  <strong>Safari:</strong> <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a>
                </p>
                <p className="text-[#9CA3AF] text-sm">
                  <strong>Edge:</strong> <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09</a>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.2. Opt-Out Tools</h3>
            <p className="text-[#E5E7EB] mb-4">
              You can opt out of targeted advertising cookies through industry tools such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#E5E7EB] mb-4">
              <li>
                <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">Digital Advertising Alliance's YourAdChoices</a>
              </li>
              <li>
                <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">Network Advertising Initiative's opt-out tool</a>
              </li>
            </ul>
            <p className="text-[#E5E7EB] mb-4">
              For Google Analytics specifically, you can use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:text-[#06B6D4]">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">6.3. Consent Management Platform</h3>
            <p className="text-[#E5E7EB] mb-4">
              We use a consent management platform that allows you to manage your cookie preferences on our website. When you first visit our website, you will be presented with a cookie banner that allows you to accept or decline non-essential cookies.
            </p>
            <p className="text-[#E5E7EB]">
              You can change your preferences at any time by clicking the "Cookie Settings" link in the footer of our website.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">7. Do Not Track</h2>
            <p className="text-[#E5E7EB] mb-4">
              Some browsers include the ability to transmit "Do Not Track" signals. We do our best to honor "Do Not Track" signals, but currently, there is no industry-standard approach to responding to these signals. As technologies and regulations evolve, we will reassess our approach to this issue.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">8. Changes to This Cookie Policy</h2>
            <p className="text-[#E5E7EB] mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page and, if the changes are significant, we will provide a more prominent notice, such as an email notification or a banner on our website.
            </p>
            <p className="text-[#E5E7EB] mb-4">
              We encourage you to periodically review this Cookie Policy to stay informed about our use of cookies.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#22D3EE] mb-4">9. Contact Information</h2>
            <p className="text-[#E5E7EB] mb-4">
              If you have any questions or concerns about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <div className="text-[#E5E7EB]">
              <p>Optiflow, Inc.</p>
              <p>Attn: Privacy Officer</p>
              <p>1234 Innovation Way</p>
              <p>San Francisco, CA 94107</p>
              <p>privacy@optiflow.com</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-[#18181B] p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-[#E5E7EB] mb-4">Cookie Preferences</h2>
          <p className="text-[#9CA3AF] mb-4">
            You can adjust your cookie preferences at any time. Click the button below to manage your settings.
          </p>
          <button
            className="px-5 py-3 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors inline-block"
            onClick={() => {
              // In a real implementation, this would open your cookie consent manager
              alert('Cookie preference manager would open here.');
            }}
          >
            Manage Cookie Preferences
          </button>
        </div>
      </div>
    </div>
  );
} 
'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';
import { useState } from 'react';

// Mock security status data
const mockSecurityData = {
  score: 65, // Out of 100
  checks: [
    { name: 'Strong Password', passed: true },
    { name: 'Multi-Factor Authentication', passed: false },
    { name: 'Recent Password Change', passed: true },
    { name: 'API Keys Regularly Rotated', passed: false },
    { name: 'Secure Email', passed: true },
  ],
  mfaEnabled: false,
  recoveryCodesAvailable: 10,
  passwordLastChanged: '2023-05-15T10:30:00Z',
};

// Mock security activity logs
const mockSecurityLogs = [
  {
    id: 'log-1',
    event: 'Login',
    timestamp: '2023-07-02T14:30:00Z',
    details: {
      ip: '192.168.1.1',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      successful: true,
    },
  },
  {
    id: 'log-2',
    event: 'Failed Login Attempt',
    timestamp: '2023-07-01T08:15:00Z',
    details: {
      ip: '203.0.113.42',
      location: 'Unknown',
      device: 'Unknown Browser',
      successful: false,
    },
  },
  {
    id: 'log-3',
    event: 'Password Changed',
    timestamp: '2023-05-15T10:30:00Z',
    details: {
      ip: '192.168.1.1',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      successful: true,
    },
  },
  {
    id: 'log-4',
    event: 'New API Key Created',
    timestamp: '2023-04-20T16:45:00Z',
    details: {
      ip: '192.168.1.1',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      successful: true,
      name: 'Development API Key',
    },
  },
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function SecuritySettings() {
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaStep, setMfaStep] = useState(1);
  const [showQrCode, setShowQrCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  
  // Toggle log details
  const toggleLogDetails = (logId: string) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle MFA setup
  const handleSetupMfa = () => {
    setShowMfaSetup(true);
  };
  
  // Handle MFA verification
  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would validate the verification code
    if (verificationCode.length === 6) {
      // Move to next step or complete setup
      if (mfaStep === 1) {
        setMfaStep(2);
      } else {
        // Complete MFA setup
        setShowMfaSetup(false);
        setMfaStep(1);
        setVerificationCode('');
        alert('MFA has been successfully set up!');
      }
    } else {
      alert('Please enter a valid 6-digit verification code.');
    }
  };
  
  // Generate security score color
  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-[#F87171]';
    if (score < 70) return 'text-[#F59E0B]';
    return 'text-[#10B981]';
  };
  
  // Calculate time since last changed
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#22D3EE] mb-6">Security Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Security Score */}
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-medium text-[#E5E7EB]">Security Score</h2>
            <div className={`text-2xl font-bold ${getScoreColor(mockSecurityData.score)}`}>
              {mockSecurityData.score}/100
            </div>
          </div>
          
          <div className="h-2 w-full bg-[#374151] rounded-full mb-4">
            <div 
              className={`h-full rounded-full ${
                mockSecurityData.score < 40 ? 'bg-[#F87171] w-[40%]' : 
                mockSecurityData.score < 70 ? 'bg-[#F59E0B] w-[65%]' : 
                'bg-[#10B981] w-full'
              }`}
            ></div>
          </div>
          
          <ul className="space-y-2">
            {mockSecurityData.checks.map((check, index) => (
              <li key={index} className="flex items-start">
                {check.passed ? (
                  <Icon name="check-circle-" className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5 mr-2" />
                ) : (
                  <Icon name="exclamation-triangle-" className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5 mr-2" />
                )}
                <span className={check.passed ? 'text-[#9CA3AF]' : 'text-[#E5E7EB]'}>
                  {check.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-5">
          <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            <Link 
              href="/settings/profile?tab=password" 
              className="flex items-center p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="lock-closed-" className="h-5 w-5 text-[#9CA3AF] mr-3" />
              <span className="text-[#E5E7EB]">Change Password</span>
            </Link>
            
            <Link 
              href="/settings/api-keys" 
              className="flex items-center p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="key-" className="h-5 w-5 text-[#9CA3AF] mr-3" />
              <span className="text-[#E5E7EB]">Manage API Keys</span>
            </Link>
            
            <Link 
              href="/settings/profile?tab=sessions" 
              className="flex items-center p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="device-phone-mobile-" className="h-5 w-5 text-[#9CA3AF] mr-3" />
              <span className="text-[#E5E7EB]">View Active Sessions</span>
            </Link>
            
            <Link 
              href="/settings/notifications" 
              className="flex items-center p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="user-group-" className="h-5 w-5 text-[#9CA3AF] mr-3" />
              <span className="text-[#E5E7EB]">Security Notifications</span>
            </Link>
          </div>
        </div>
        
        {/* Multi-Factor Authentication */}
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-5">
          <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Multi-Factor Authentication</h2>
          
          {mockSecurityData.mfaEnabled ? (
            <div>
              <div className="flex items-center mb-4">
                <Icon name="finger-print-" className="h-6 w-6 text-[#10B981] mr-2" />
                <span className="text-[#10B981] font-medium">MFA is enabled</span>
              </div>
              
              <p className="text-[#9CA3AF] mb-4">
                Your account is protected with an additional layer of security.
              </p>
              
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg">
                <div>
                  <p className="text-[#E5E7EB] font-medium">Recovery Codes</p>
                  <p className="text-sm text-[#9CA3AF]">
                    {mockSecurityData.recoveryCodesAvailable} remaining
                  </p>
                </div>
                <button className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors text-sm">
                  View Codes
                </button>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button className="text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors text-sm">
                  Change MFA Method
                </button>
                <button className="text-[#F87171] hover:text-[#FCA5A5] transition-colors text-sm">
                  Disable MFA
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <Icon name="exclamation-triangle-" className="h-6 w-6 text-[#F59E0B] mr-2" />
                <span className="text-[#F59E0B] font-medium">MFA is not enabled</span>
              </div>
              
              <p className="text-[#9CA3AF] mb-4">
                Protect your account with an additional layer of security. When MFA is enabled, you'll need your password and a security code to log in.
              </p>
              
              <button
                onClick={handleSetupMfa}
                className="w-full py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors flex items-center justify-center"
              >
                <Icon name="shield-check-" className="h-5 w-5 mr-2" />
                Enable MFA
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Recent Security Activity</h2>
        
        <div className="space-y-3">
          {mockSecurityLogs.map((log) => (
            <div key={log.id} className="border border-[#374151] rounded-lg">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleLogDetails(log.id)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-md mr-3 ${
                    log.event.includes('Failed') ? 'bg-[#371520] text-[#F87171]' : 'bg-[#1E293B] text-[#9CA3AF]'
                  }`}>
                    {log.event.includes('Login') ? (
                      <Icon name="finger-print-" className="h-5 w-5" />
                    ) : log.event.includes('Password') ? (
                      <Icon name="lock-closed-" className="h-5 w-5" />
                    ) : (
                      <Icon name="key-" className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-[#E5E7EB]">{log.event}</span>
                      {!log.details.successful && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-[#371520] text-[#F87171] rounded-full">
                          Failed
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedLog === log.id && (
                <div className="p-3 border-t border-[#374151] text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-[#9CA3AF]">IP Address</div>
                    <div className="text-[#E5E7EB]">{log.details.ip}</div>
                    
                    <div className="text-[#9CA3AF]">Location</div>
                    <div className="text-[#E5E7EB]">{log.details.location}</div>
                    
                    <div className="text-[#9CA3AF]">Device</div>
                    <div className="text-[#E5E7EB]">{log.details.device}</div>
                    
                    {log.details.name && (
                      <>
                        <div className="text-[#9CA3AF]">Name</div>
                        <div className="text-[#E5E7EB]">{log.details.name}</div>
                      </>
                    )}
                    
                    <div className="text-[#9CA3AF]">Status</div>
                    <div className="text-[#E5E7EB]">
                      {log.details.successful ? 'Successful' : 'Failed'}
                    </div>
                    
                    <div className="text-[#9CA3AF]">Time</div>
                    <div className="text-[#E5E7EB]">{formatDate(log.timestamp)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Password Info */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Password Information</h2>
        
        <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg mb-4">
          <div>
            <p className="text-[#E5E7EB] font-medium">Last Password Change</p>
            <p className="text-sm text-[#9CA3AF]">
              {formatDate(mockSecurityData.passwordLastChanged)} ({getTimeAgo(mockSecurityData.passwordLastChanged)})
            </p>
          </div>
          <Link 
            href="/settings/profile?tab=password"
            className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors text-sm"
          >
            Change
          </Link>
        </div>
        
        <div className="text-[#9CA3AF] text-sm">
          <p>
            It's recommended to change your password every 90 days for optimal security.
          </p>
        </div>
      </div>
      
      {/* MFA Setup Modal */}
      {showMfaSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#E5E7EB]">
                {mfaStep === 1 ? 'Set Up Multi-Factor Authentication' : 'Verify MFA Setup'}
              </h3>
              <button 
                onClick={() => {
                  setShowMfaSetup(false);
                  setMfaStep(1);
                  setVerificationCode('');
                }}
                className="text-[#9CA3AF] hover:text-[#E5E7EB]"
                aria-label="Close modal"
                title="Close modal"
              >
                <Icon name="xmark-" className="h-6 w-6" />
              </button>
            </div>
            
            {mfaStep === 1 ? (
              <div>
                <p className="text-[#9CA3AF] mb-4">
                  Protect your account with multi-factor authentication. You'll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
                </p>
                
                <ol className="space-y-6 mb-6">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mr-3">
                      1
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-medium">Install an authenticator app</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">
                        Download and install an authenticator app on your phone if you don't already have one.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mr-3">
                      2
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-medium">Scan the QR code</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">
                        Open your authenticator app and scan the QR code below, or enter the setup key manually.
                      </p>
                      
                      <div className="mt-3 bg-white p-4 rounded-lg w-48 h-48 mx-auto flex items-center justify-center">
                        {showQrCode ? (
                          <Icon name="qr-code-" className="h-32 w-32 text-[#111111]" />
                        ) : (
                          <button
                            onClick={() => setShowQrCode(true)}
                            className="px-3 py-1.5 bg-[#22D3EE] text-[#111111] rounded text-sm font-medium"
                          >
                            Show QR Code
                          </button>
                        )}
                      </div>
                      
                      {showQrCode && (
                        <div className="mt-3">
                          <p className="text-sm text-[#9CA3AF] mb-1">Manual entry key:</p>
                          <div className="bg-[#111111] p-2 rounded font-mono text-[#E5E7EB] text-sm break-all">
                            ABCDEF123456GHIJKL
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mr-3">
                      3
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-medium">Enter verification code</p>
                      <p className="text-sm text-[#9CA3AF] mt-1 mb-2">
                        Enter the 6-digit code from your authenticator app to verify setup.
                      </p>
                      
                      <form onSubmit={handleVerifyMfa}>
                        <div className="flex">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                            className="flex-1 px-3 py-2 bg-[#111111] border border-[#374151] rounded-l-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                            placeholder="000000"
                            maxLength={6}
                            required
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-r-md hover:bg-[#06B6D4] transition-colors"
                            disabled={verificationCode.length !== 6}
                          >
                            Verify
                          </button>
                        </div>
                      </form>
                    </div>
                  </li>
                </ol>
              </div>
            ) : (
              <div>
                <div className="bg-[#022c22] border border-[#10B981] rounded-lg p-4 flex items-start mb-6">
                  <Icon name="check-circle-" className="h-6 w-6 text-[#10B981] mr-3 mt-0.5" />
                  <div>
                    <p className="text-[#E5E7EB] font-medium">
                      Verification successful!
                    </p>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Your MFA device has been verified. Save your recovery codes before completing setup.
                    </p>
                  </div>
                </div>
                
                <p className="text-[#E5E7EB] font-medium mb-2">Recovery Codes</p>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Save these recovery codes in a secure place. They allow you to access your account if you lose your authenticator device.
                </p>
                
                <div className="bg-[#111111] p-3 rounded-lg border border-[#374151] mb-4">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    <div className="bg-[#1E293B] p-2 rounded">ABCD-EFGH-1234</div>
                    <div className="bg-[#1E293B] p-2 rounded">IJKL-MNOP-5678</div>
                    <div className="bg-[#1E293B] p-2 rounded">QRST-UVWX-9012</div>
                    <div className="bg-[#1E293B] p-2 rounded">YZAB-CDEF-3456</div>
                    <div className="bg-[#1E293B] p-2 rounded">GHIJ-KLMN-7890</div>
                    <div className="bg-[#1E293B] p-2 rounded">OPQR-STUV-1234</div>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <input 
                    type="checkbox" 
                    id="codesBackup" 
                    className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] rounded focus:ring-[#22D3EE]" 
                  />
                  <label htmlFor="codesBackup" className="ml-2 text-sm text-[#9CA3AF]">
                    I have saved these recovery codes in a secure location
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowMfaSetup(false);
                      setMfaStep(1);
                      setVerificationCode('');
                      alert('MFA has been successfully set up!');
                    }}
                    className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
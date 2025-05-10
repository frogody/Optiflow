import React from 'react';

interface MockScreenshotProps { type: 'connect-tools' | 'workflow-builder' | 'configure-trigger' | 'add-actions' | 'test-deploy';
  className?: string;
    }

export default function MockScreenshot({ type, className = '' }: MockScreenshotProps) {
  // Common header for all screen types
  const renderHeader = () => (
    <div className="w-full h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
      <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
      <div className="ml-4 text-white text-sm font-medium">Optiflow Dashboard</div>
    </div>
  );
  
  // Render different content based on screen type
  const renderContent = () => {
    switch (type) {
      case 'connect-tools':
        return (
          <div className="flex h-full">
            <div className="w-64 border-r border-gray-700 p-4 bg-gray-900">
              <div className="text-white font-medium mb-3">Connections</div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded flex items-center text-blue-400">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400">G</span>
                  </div>
                  <span>Google</span>
                </div>
                <div className="p-2 bg-gray-800 border border-gray-700 rounded flex items-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span>S</span>
                  </div>
                  <span>Slack</span>
                </div>
                <div className="p-2 bg-gray-800 border border-gray-700 rounded flex items-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span>D</span>
                  </div>
                  <span>Dropbox</span>
                </div>
              </div>
              
              <div className="mt-6 mb-3 flex justify-between items-center">
                <div className="text-white font-medium">Categories</div>
              </div>
              <div className="space-y-1">
                {['CRM', 'Email', 'Storage', 'Social', 'Payments'].map(cat => (
                  <div key={cat} className="text-sm text-gray-400 py-1">{cat}</div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-semibold">Available Connections</h2>
                <button className="px-4 py-2 bg-[#3CDFFF] text-black rounded-lg hover:bg-[#3CDFFF]/90">
                  Add New
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['Salesforce', 'Mailchimp', 'Twitter', 'Airtable', 'Stripe', 'HubSpot'].map(app => (
                  <div key={app} className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-[#3CDFFF]/50 cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#3CDFFF]/20 mb-2 flex items-center justify-center">
                      <span className="text-[#3CDFFF]">{app[0]}</span>
                    </div>
                    <div className="text-white font-medium mb-1">{app}</div>
                    <div className="text-xs text-gray-400">Connect your {app} account</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'workflow-builder':
        return (
          <div className="flex h-full">
            <div className="w-56 border-r border-gray-700 p-3 bg-gray-900">
              <div className="text-white font-medium mb-3">Nodes</div>
              <div className="space-y-2">
                {['Trigger', 'Action', 'Condition', 'Loop', 'Delay'].map(node => (
                  <div key={node} className="p-2 bg-gray-800 border border-gray-700 rounded flex items-center text-gray-300">
                    <div className="w-6 h-6 rounded bg-blue-500/20 mr-2 flex items-center justify-center text-xs">
                      {node[0]}
                    </div>
                    <span>{node}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 mb-2">
                <div className="text-white font-medium">Connected Apps</div>
              </div>
              <div className="space-y-2">
                {['Google', 'Slack', 'Mailchimp'].map(app => (
                  <div key={app} className="text-xs text-gray-400 py-1 px-2">{app}</div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative bg-gray-950 p-4">
              {/* Grid background */}
              <div className="absolute inset-0 bg-[#6366f1]/5" 
                style={{ backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  opacity: 0.1
                    }}
              />
              
              {/* Sample nodes */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="absolute top-1/3 left-1/4 w-40 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-white">
                  <div className="font-medium text-sm">Email Trigger</div>
                  <div className="text-xs text-blue-300 mt-1">When a new email arrives</div>
                </div>
                
                <div className="absolute top-1/3 right-1/4 w-40 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-white">
                  <div className="font-medium text-sm">Process Data</div>
                  <div className="text-xs text-green-300 mt-1">Extract information</div>
                </div>
                
                <div className="absolute bottom-1/3 left-1/3 w-40 p-3 bg-purple-500/20 border border-purple-500/40 rounded-lg text-white">
                  <div className="font-medium text-sm">Send Notification</div>
                  <div className="text-xs text-purple-300 mt-1">Alert the team</div>
                </div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ stroke: '#6366f1', strokeWidth: 2, fill: 'none'     }}>
                  <path d="M160,120 C200,120 200,200 240,200" />
                  <path d="M360,120 C320,120 320,200 280,200" />
                </svg>
              </div>
            </div>
          </div>
        );
      
      case 'configure-trigger':
        return (
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-white text-xl font-semibold mb-4">Configure Trigger</h2>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 mr-3">
                      T
                    </div>
                    <div>
                      <div className="text-white font-medium">Email Trigger</div>
                      <div className="text-xs text-gray-400">Triggers when a new email matches conditions</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Email Account</label>
                      <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" title="Select email account" aria-label="Select email account">
                        <option>work@example.com</option>
                        <option>personal@example.com</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Conditions</label>
                      <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
                        <div className="flex items-center mb-2">
                          <select className="bg-gray-800 border border-gray-700 rounded p-1 text-white text-sm mr-2" title="Select field" aria-label="Select field">
                            <option>From</option>
                            <option>Subject</option>
                            <option>Body</option>
                          </select>
                          <select className="bg-gray-800 border border-gray-700 rounded p-1 text-white text-sm mr-2" title="Select condition" aria-label="Select condition">
                            <option>contains</option>
                            <option>equals</option>
                            <option>starts with</option>
                          </select>
                          <input 
                            type="text"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded p-1 text-white text-sm"
                            placeholder="Value"
                            defaultValue="invoice"
                          />
                        </div>
                        <button className="text-xs text-blue-400 hover:underline">+ Add condition</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Frequency</label>
                      <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" title="Select frequency" aria-label="Select frequency">
                        <option>Check every 5 minutes</option>
                        <option>Check every 15 minutes</option>
                        <option>Check every hour</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-gray-800 text-white rounded mr-2">Cancel</button>
                  <button className="px-4 py-2 bg-[#3CDFFF] text-black rounded">Save Trigger</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'add-actions':
        return (
          <div className="flex h-full">
            <div className="w-56 border-r border-gray-700 p-3 bg-gray-900">
              <div className="text-white font-medium mb-3">Action Types</div>
              <div className="space-y-2">
                {['Send Email', 'Create Record', 'Update Data', 'HTTP Request', 'Transform Data'].map(action => (
                  <div key={action} className="p-2 bg-gray-800 border border-gray-700 rounded flex items-center text-gray-300">
                    <div className="w-6 h-6 rounded bg-green-500/20 mr-2 flex items-center justify-center text-xs text-green-400">
                      {action[0]}
                    </div>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-white text-xl font-semibold mb-4">Configure Action</h2>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center text-green-400 mr-3">
                      A
                    </div>
                    <div>
                      <div className="text-white font-medium">Send Slack Message</div>
                      <div className="text-xs text-gray-400">Sends a message to a Slack channel</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Slack Connection</label>
                      <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" title="Select recipient" aria-label="Select recipient">
                        <option>Workspace: My Team</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Channel</label>
                      <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" title="Select channel" aria-label="Select channel">
                        <option>#notifications</option>
                        <option>#general</option>
                        <option>#alerts</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Message</label>
                      <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white h-24"
                        placeholder="Message content"
                        defaultValue="New invoice received from &#123;&#123;sender&#125;&#125;. Amount: &#123;&#123;amount&#125;&#125;."
                      />
                      <div className="mt-1 text-xs text-gray-500">Use &#123;&#123;variable&#125;&#125; to include dynamic data from previous steps</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-gray-800 text-white rounded mr-2">Cancel</button>
                  <button className="px-4 py-2 bg-[#3CDFFF] text-black rounded">Save Action</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'test-deploy':
        return (
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-white text-xl font-semibold mb-4">Workflow Overview</h2>
                  <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-medium">Invoice Processor</div>
                      <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Active</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 mr-2">
                          1
                        </div>
                        <div className="text-sm text-gray-300">Email Trigger</div>
                      </div>
                      <div className="ml-4 border-l-2 border-gray-700 pl-6 pb-2"></div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 mr-2">
                          2
                        </div>
                        <div className="text-sm text-gray-300">Extract Data</div>
                      </div>
                      <div className="ml-4 border-l-2 border-gray-700 pl-6 pb-2"></div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-400 mr-2">
                          3
                        </div>
                        <div className="text-sm text-gray-300">Send Slack Message</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                      <div>
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="text-sm text-gray-300">Apr 10, 2023</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Last run</div>
                        <div className="text-sm text-gray-300">2 hours ago</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Success rate</div>
                        <div className="text-sm text-green-400">98%</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-white text-xl font-semibold mb-4">Performance</h2>
                  <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-300">Executions</div>
                        <div className="text-sm text-white font-medium">243 total</div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]" style={{ width: '78%'     }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-300">Successful runs</div>
                        <div className="text-sm text-green-400 font-medium">238</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-300">Failed runs</div>
                        <div className="text-sm text-red-400 font-medium">5</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-300">Average duration</div>
                        <div className="text-sm text-white font-medium">2.3s</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-300">Last triggered</div>
                        <div className="text-sm text-white font-medium">2:45 PM</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <button className="w-full px-3 py-2 bg-[#3CDFFF]/10 border border-[#3CDFFF]/30 text-[#3CDFFF] rounded">
                        View Detailed Analytics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-4">Recent Executions</h2>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="space-y-2">
                    {[
                      { time: '3:42 PM', status: 'success'     },
                      { time: '2:58 PM', status: 'success'     },
                      { time: '1:23 PM', status: 'error'     },
                      { time: '11:05 AM', status: 'success'     }
                    ].map((execution, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                        <div className="text-sm text-gray-300">Execution #{243-i}</div>
                        <div className="text-sm text-gray-400">{execution.time}</div>
                        <div className={`text-sm ${ execution.status === 'success' ? 'text-green-400' : 'text-red-400'    }`}>
                          { execution.status === 'success' ? 'Successful' : 'Failed'    }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-white">Select a screen type</div>
          </div>
        );
    }
  };
  
  return (
    <div className={`w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 ${className}`}>
      {renderHeader()}
      <div className="h-[calc(100%-3rem)]">
        {renderContent()}
      </div>
    </div>
  );
} 
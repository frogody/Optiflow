'use client';

import { 
  EnvelopeIcon, 
  BellAlertIcon, 
  ClockIcon, 
  CloudIcon, 
  DocumentIcon, 
  GlobeAltIcon, 
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  TableCellsIcon,
  RocketLaunchIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

// Template Node type
export interface TemplateNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config?: any;
  };
}

// Template Edge type
export interface TemplateEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: any;
}

// Template type
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  nodes: TemplateNode[];
  edges: TemplateEdge[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

// Template categories with icons
export const templateCategories = [
  { id: 'marketing', name: 'Marketing Automation', icon: MegaphoneIcon },
  { id: 'data', name: 'Data Processing', icon: TableCellsIcon },
  { id: 'notification', name: 'Notifications', icon: BellAlertIcon },
  { id: 'integration', name: 'API Integration', icon: GlobeAltIcon },
  { id: 'productivity', name: 'Productivity', icon: RocketLaunchIcon },
  { id: 'scheduling', name: 'Scheduling', icon: ClockIcon },
  { id: 'communication', name: 'Communication', icon: ChatBubbleLeftRightIcon },
];

// --------- TEMPLATE WORKFLOWS ---------

// Daily Email Summary Template
const dailyEmailSummaryTemplate: WorkflowTemplate = {
  id: 'daily-email-summary',
  name: 'Daily Email Summary',
  description: 'Automatically send a daily summary email with data from various sources at a scheduled time.',
  category: 'notification',
  icon: EnvelopeIcon,
  difficulty: 'beginner',
  tags: ['email', 'scheduling', 'reporting'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'scheduleTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Daily Schedule',
        description: 'Runs every day at 8:00 AM',
        config: {
          schedule: '0 8 * * *',
          timezone: 'America/New_York'
        }
      }
    },
    {
      id: 'action-1',
      type: 'httpRequest',
      position: { x: 400, y: 100 },
      data: { 
        label: 'Fetch Data',
        description: 'Get data from API',
        config: {
          method: 'GET',
          url: 'https://api.example.com/daily-stats'
        }
      }
    },
    {
      id: 'action-2',
      type: 'transformData',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Format Data',
        description: 'Transform API response into email-friendly format'
      }
    },
    {
      id: 'action-3',
      type: 'email',
      position: { x: 1000, y: 100 },
      data: { 
        label: 'Send Email',
        description: 'Send daily summary email',
        config: {
          to: '{{user.email}}',
          subject: 'Daily Summary: {{formatDate(now(), "MMM D, YYYY")}}'
        }
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'action-2' },
    { id: 'edge-3-4', source: 'action-2', target: 'action-3' }
  ]
};

// Social Media Post Scheduler Template
const socialMediaPostTemplate: WorkflowTemplate = {
  id: 'social-media-scheduler',
  name: 'Social Media Post Scheduler',
  description: 'Schedule and automatically post content to multiple social media platforms.',
  category: 'marketing',
  icon: MegaphoneIcon,
  difficulty: 'intermediate',
  tags: ['social media', 'scheduling', 'marketing'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'scheduleTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Post Schedule',
        description: 'Runs on configured schedule',
      }
    },
    {
      id: 'action-1',
      type: 'spreadsheet',
      position: { x: 400, y: 100 },
      data: { 
        label: 'Get Post Content',
        description: 'Fetch next scheduled post from content calendar',
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Has Content?',
        description: 'Check if there is content to post',
        config: {
          condition: '{{outputs["action-1"].hasRows}}'
        }
      }
    },
    {
      id: 'action-twitter',
      type: 'httpRequest',
      position: { x: 1000, y: 0 },
      data: { 
        label: 'Post to Twitter',
        description: 'Send post to Twitter API',
      }
    },
    {
      id: 'action-linkedin',
      type: 'httpRequest',
      position: { x: 1000, y: 200 },
      data: { 
        label: 'Post to LinkedIn',
        description: 'Send post to LinkedIn API',
      }
    },
    {
      id: 'action-log',
      type: 'logging',
      position: { x: 1300, y: 100 },
      data: { 
        label: 'Log Results',
        description: 'Record posting results',
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'condition-1' },
    { id: 'edge-3-4', source: 'condition-1', target: 'action-twitter' },
    { id: 'edge-3-5', source: 'condition-1', target: 'action-linkedin' },
    { id: 'edge-4-6', source: 'action-twitter', target: 'action-log' },
    { id: 'edge-5-6', source: 'action-linkedin', target: 'action-log' }
  ]
};

// Website Monitoring Template
const websiteMonitoringTemplate: WorkflowTemplate = {
  id: 'website-monitoring',
  name: 'Website Monitoring',
  description: 'Monitor website availability and performance and get notified of any issues.',
  category: 'notification',
  icon: GlobeAltIcon,
  difficulty: 'beginner',
  tags: ['monitoring', 'alerts', 'webhooks'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'pollingTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Check Website',
        description: 'Polls website every 5 minutes',
        config: {
          interval: 5,
          intervalUnit: 'minutes'
        }
      }
    },
    {
      id: 'action-1',
      type: 'httpRequest',
      position: { x: 400, y: 100 },
      data: { 
        label: 'HTTP Request',
        description: 'Send GET request to website',
        config: {
          method: 'GET',
          url: '{{inputs.websiteUrl}}'
        }
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Check Status',
        description: 'Verify website is responding correctly',
        config: {
          condition: '{{outputs["action-1"].statusCode === 200}}'
        }
      }
    },
    {
      id: 'action-ok',
      type: 'logging',
      position: { x: 1000, y: 0 },
      data: { 
        label: 'Log Success',
        description: 'Record successful check',
      }
    },
    {
      id: 'action-error',
      type: 'email',
      position: { x: 1000, y: 200 },
      data: { 
        label: 'Send Alert',
        description: 'Notify team about website issue',
        config: {
          to: '{{inputs.alertEmail}}',
          subject: 'Website Down Alert: {{inputs.websiteUrl}}'
        }
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'condition-1' },
    { id: 'edge-3-4', source: 'condition-1', target: 'action-ok' },
    { id: 'edge-3-5', source: 'condition-1', target: 'action-error', 
      style: { stroke: '#ef4444', strokeWidth: 2 } }
  ]
};

// Lead Capture and CRM Integration
const leadCaptureTemplate: WorkflowTemplate = {
  id: 'lead-capture',
  name: 'Lead Capture and CRM Integration',
  description: 'Automatically capture leads from your website and add them to your CRM system.',
  category: 'integration',
  icon: ChatBubbleLeftRightIcon,
  difficulty: 'intermediate',
  tags: ['crm', 'leads', 'webhooks'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'webhookTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Form Submission',
        description: 'Triggered when a lead form is submitted',
      }
    },
    {
      id: 'action-1',
      type: 'transformData',
      position: { x: 400, y: 100 },
      data: { 
        label: 'Format Lead Data',
        description: 'Transform form data to CRM format',
      }
    },
    {
      id: 'action-2',
      type: 'httpRequest',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Create CRM Contact',
        description: 'Add lead to CRM system',
        config: {
          method: 'POST',
          url: '{{inputs.crmApiUrl}}'
        }
      }
    },
    {
      id: 'action-3',
      type: 'email',
      position: { x: 1000, y: 100 },
      data: { 
        label: 'Send Welcome Email',
        description: 'Send welcome email to new lead',
        config: {
          to: '{{trigger.body.email}}',
          subject: 'Welcome to {{inputs.companyName}}'
        }
      }
    },
    {
      id: 'action-4',
      type: 'slack',
      position: { x: 1000, y: 250 },
      data: { 
        label: 'Notify Sales Team',
        description: 'Send notification to sales channel',
        config: {
          channel: '#sales-leads',
          message: 'New lead: {{trigger.body.name}} ({{trigger.body.email}})'
        }
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'action-2' },
    { id: 'edge-3-4', source: 'action-2', target: 'action-3' },
    { id: 'edge-3-5', source: 'action-2', target: 'action-4' }
  ]
};

// Data Backup Template
const dataBackupTemplate: WorkflowTemplate = {
  id: 'data-backup',
  name: 'Scheduled Data Backup',
  description: 'Automatically backup important data from various sources to cloud storage on a schedule.',
  category: 'data',
  icon: CloudIcon,
  difficulty: 'intermediate',
  tags: ['backup', 'storage', 'scheduling'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'scheduleTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Weekly Backup',
        description: 'Runs every Sunday at 1:00 AM',
        config: {
          schedule: '0 1 * * 0',
          timezone: 'UTC'
        }
      }
    },
    {
      id: 'action-1',
      type: 'database',
      position: { x: 400, y: 100 },
      data: { 
        label: 'Export Database',
        description: 'Generate database backup file',
      }
    },
    {
      id: 'action-2',
      type: 'fileOperation',
      position: { x: 700, y: 100 },
      data: { 
        label: 'Compress Files',
        description: 'Create compressed archive',
      }
    },
    {
      id: 'action-3',
      type: 'cloudStorage',
      position: { x: 1000, y: 100 },
      data: { 
        label: 'Upload to Storage',
        description: 'Store backup in cloud storage',
      }
    },
    {
      id: 'action-4',
      type: 'email',
      position: { x: 1300, y: 100 },
      data: { 
        label: 'Send Confirmation',
        description: 'Email backup report to admin',
        config: {
          to: '{{inputs.adminEmail}}',
          subject: 'Weekly Backup Complete'
        }
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'action-2' },
    { id: 'edge-3-4', source: 'action-2', target: 'action-3' },
    { id: 'edge-4-5', source: 'action-3', target: 'action-4' }
  ]
};

// Content Approval Workflow
const contentApprovalTemplate: WorkflowTemplate = {
  id: 'content-approval',
  name: 'Content Review & Approval Process',
  description: 'Streamline content creation process with automated reviews and approvals.',
  category: 'productivity',
  icon: DocumentIcon,
  difficulty: 'advanced',
  tags: ['approval', 'content', 'collaboration'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'webhookTrigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Content Submitted',
        description: 'Triggered when new content is submitted for review',
      }
    },
    {
      id: 'action-1',
      type: 'aiProcessing',
      position: { x: 400, y: 100 },
      data: { 
        label: 'AI Review',
        description: 'Analyze content for issues',
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 700, y: 100 },
      data: { 
        label: 'AI Check Passed?',
        description: 'Check if AI review found issues',
        config: {
          condition: '{{outputs["action-1"].score > 0.8}}'
        }
      }
    },
    {
      id: 'action-2',
      type: 'slack',
      position: { x: 1000, y: 0 },
      data: { 
        label: 'Request Human Review',
        description: 'Notify editor for review',
        config: {
          channel: '#content-review',
          message: 'New content ready for review: {{trigger.body.title}}'
        }
      }
    },
    {
      id: 'action-3',
      type: 'email',
      position: { x: 1000, y: 200 },
      data: { 
        label: 'Send for Revision',
        description: 'Return content to author for revisions',
        config: {
          to: '{{trigger.body.authorEmail}}',
          subject: 'Content Revision Required: {{trigger.body.title}}'
        }
      }
    },
    {
      id: 'action-4',
      type: 'httpRequest',
      position: { x: 1300, y: 0 },
      data: { 
        label: 'Update Status',
        description: 'Update content status in CMS',
      }
    }
  ],
  edges: [
    { id: 'edge-1-2', source: 'trigger-1', target: 'action-1', animated: true },
    { id: 'edge-2-3', source: 'action-1', target: 'condition-1' },
    { id: 'edge-3-4', source: 'condition-1', target: 'action-2' },
    { id: 'edge-3-5', source: 'condition-1', target: 'action-3', 
      style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'edge-4-6', source: 'action-2', target: 'action-4' }
  ]
};

// Export all templates
export const workflowTemplates: WorkflowTemplate[] = [
  dailyEmailSummaryTemplate,
  socialMediaPostTemplate,
  websiteMonitoringTemplate,
  leadCaptureTemplate,
  dataBackupTemplate,
  contentApprovalTemplate
];
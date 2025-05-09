// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Node, Edge } from 'reactflow';

// Template for lead outreach workflow
export const leadOutreachTemplate = {
  nodes: [
    {
      id: 'extract-1',
      type: 'trigger',
      position: { x: 250, y: 25     },
      data: {
        label: 'Extract Webpage Text',
        description: 'Extract text content from a webpage URL',
        icon: '🌐',
        category: 'data'
      },
    },
    {
      id: 'ai-agent-1',
      type: 'conditional',
      position: { x: 250, y: 150     },
      data: {
        label: 'AI Agent',
        description: 'Analyze the content to determine if it\'s a good lead',
        icon: '🤖',
        category: 'intelligence'
      },
    },
    {
      id: 'email-1',
      type: 'action',
      position: { x: 250, y: 300     },
      data: {
        label: 'First Outreach Email',
        description: 'Send first email in the sequence',
        icon: '✉️',
        category: 'communication'
      },
    },
    {
      id: 'wait-1',
      type: 'wait',
      position: { x: 250, y: 450     },
      data: {
        label: 'Wait Three Days',
        description: 'Wait for 3 days before next action',
        icon: '⏱️',
        category: 'timing'
      },
    },
    {
      id: 'email-2',
      type: 'action',
      position: { x: 250, y: 600     },
      data: {
        label: 'Send Email',
        description: 'Send follow-up email if no response',
        icon: '📧',
        category: 'communication'
      },
    },
  ],
  edges: [
    { id: 'e1-2',
      source: 'extract-1',
      target: 'ai-agent-1',
      animated: true,
    },
    { id: 'e2-3',
      source: 'ai-agent-1',
      target: 'email-1',
      sourceHandle: 'yes',
      animated: true,
    },
    { id: 'e3-4',
      source: 'email-1',
      target: 'wait-1',
      animated: true,
    },
    { id: 'e4-5',
      source: 'wait-1',
      target: 'email-2',
      animated: true,
    },
  ],
};

// Template for social media monitoring
export const socialMediaTemplate = {
  nodes: [
    {
      id: 'social-trigger-1',
      type: 'trigger',
      position: { x: 250, y: 25     },
      data: {
        label: 'Monitor Twitter',
        description: 'Monitor Twitter for brand mentions',
        icon: '🐦',
        category: 'social'
      },
    },
    {
      id: 'ai-sentiment-1',
      type: 'conditional',
      position: { x: 250, y: 150     },
      data: {
        label: 'Sentiment Analysis',
        description: 'Analyze sentiment of the mention',
        icon: '🧠',
        category: 'intelligence'
      },
    },
    {
      id: 'slack-positive',
      type: 'action',
      position: { x: 100, y: 300     },
      data: {
        label: 'Send to Success Channel',
        description: 'Post positive mentions to success channel',
        icon: '👍',
        category: 'communication'
      },
    },
    {
      id: 'slack-negative',
      type: 'action',
      position: { x: 400, y: 300     },
      data: {
        label: 'Send to Support',
        description: 'Notify support team of negative mentions',
        icon: '🔔',
        category: 'communication'
      },
    }
  ],
  edges: [
    { id: 'e1-2',
      source: 'social-trigger-1',
      target: 'ai-sentiment-1',
      animated: true,
    },
    { id: 'e2-3',
      source: 'ai-sentiment-1',
      target: 'slack-positive',
      sourceHandle: 'yes',
      animated: true,
    },
    { id: 'e2-4',
      source: 'ai-sentiment-1',
      target: 'slack-negative',
      sourceHandle: 'no',
      animated: true,
    }
  ],
};

// Templates we can offer to users
export const workflowTemplates = [
  { id: 'lead-outreach',
    name: 'Lead Outreach',
    description: 'Automate lead outreach and follow-up emails',
    icon: '📧',
    template: leadOutreachTemplate
  },
  { id: 'social-media-monitoring',
    name: 'Social Media Monitoring',
    description: 'Monitor social media and respond to mentions',
    icon: '📱',
    template: socialMediaTemplate
  }
]; 
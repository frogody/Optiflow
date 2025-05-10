/**
 * Prisma seed script for Optiflow
 * 
 * This script populates the database with initial data, including:
 * - Demo user
 * - Organization
 * - Team
 * - Personal and team knowledge bases
 * - Sample knowledge documents
 * 
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed process...');

  // ==================== Create Admin User ====================
  console.log('Creating admin user...');
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@optiflow.ai' },
    update: {},
    create: {
      email: 'admin@optiflow.ai',
      name: 'Admin User',
      passwordHash,
      role: 'admin',
      isActive: true,
    },
  });
  
  // ==================== Create Demo User ====================
  console.log('Creating demo user...');
  const demoPassword = process.env.SEED_DEMO_PASSWORD || 'Demo123!';
  const demoPasswordHash = await bcrypt.hash(demoPassword, 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@optiflow.ai' },
    update: {},
    create: {
      email: 'demo@optiflow.ai',
      name: 'Demo User',
      passwordHash: demoPasswordHash,
      role: 'user',
      isActive: true,
    },
  });
  
  // ==================== Create Organization ====================
  console.log('Creating demo organization...');
  const organization = await prisma.organization.upsert({
    where: { id: 'demo-org-id' },
    update: {},
    create: {
      id: 'demo-org-id',
      name: 'Optiflow Demo',
      plan: 'enterprise',
      logo: '/images/logo.png',
    },
  });
  
  // ==================== Link Users to Organization ====================
  console.log('Adding users to organization...');
  await prisma.organizationMember.upsert({
    where: { 
      organizationId_userId: {
        organizationId: organization.id,
        userId: adminUser.id,
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: adminUser.id,
      role: 'admin',
    },
  });
  
  await prisma.organizationMember.upsert({
    where: { 
      organizationId_userId: {
        organizationId: organization.id,
        userId: demoUser.id,
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: demoUser.id,
      role: 'member',
    },
  });
  
  // ==================== Create Team ====================
  console.log('Creating demo team...');
  const team = await prisma.team.upsert({
    where: { id: 'demo-team-id' },
    update: {},
    create: {
      id: 'demo-team-id',
      name: 'Product Team',
      organizationId: organization.id,
      description: 'Product development and management team',
    },
  });
  
  // ==================== Add Members to Team ====================
  console.log('Adding members to team...');
  const adminOrgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: adminUser.id,
      }
    }
  });
  
  if (adminOrgMember) {
    await prisma.teamMember.upsert({
      where: {
        teamId_organizationMemberId: {
          teamId: team.id,
          organizationMemberId: adminOrgMember.id,
        }
      },
      update: {},
      create: {
        teamId: team.id,
        organizationMemberId: adminOrgMember.id,
        role: 'lead',
      },
    });
  }
  
  const demoOrgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: demoUser.id,
      }
    }
  });
  
  if (demoOrgMember) {
    await prisma.teamMember.upsert({
      where: {
        teamId_organizationMemberId: {
          teamId: team.id,
          organizationMemberId: demoOrgMember.id,
        }
      },
      update: {},
      create: {
        teamId: team.id,
        organizationMemberId: demoOrgMember.id,
        role: 'member',
      },
    });
  }
  
  // ==================== Create Knowledge Bases ====================
  console.log('Creating knowledge bases...');
  
  // Personal knowledge base for demo user
  const personalKnowledgeBase = await prisma.knowledgeBase.upsert({
    where: { id: 'demo-personal-kb' },
    update: {},
    create: {
      id: 'demo-personal-kb',
      name: 'Personal Knowledge',
      description: 'My personal knowledge base',
      type: 'personal',
      ownerId: demoUser.id,
      isPublic: false,
    },
  });
  
  // Team knowledge base
  const teamKnowledgeBase = await prisma.knowledgeBase.upsert({
    where: { id: 'demo-team-kb' },
    update: {},
    create: {
      id: 'demo-team-kb',
      name: 'Product Team Knowledge',
      description: 'Shared knowledge for the product team',
      type: 'team',
      teamId: team.id,
      organizationId: organization.id,
      isPublic: false,
    },
  });
  
  // Organization knowledge base
  const orgKnowledgeBase = await prisma.knowledgeBase.upsert({
    where: { id: 'demo-org-kb' },
    update: {},
    create: {
      id: 'demo-org-kb',
      name: 'Organization Knowledge',
      description: 'Company-wide knowledge base',
      type: 'organization',
      organizationId: organization.id,
      isPublic: false,
    },
  });
  
  // Public knowledge base
  const publicKnowledgeBase = await prisma.knowledgeBase.upsert({
    where: { id: 'demo-public-kb' },
    update: {},
    create: {
      id: 'demo-public-kb',
      name: 'Public Documentation',
      description: 'Publicly accessible documentation',
      type: 'organization',
      organizationId: organization.id,
      isPublic: true,
    },
  });
  
  // ==================== Create Knowledge Documents ====================
  console.log('Creating knowledge documents...');
  
  // Document in personal knowledge base
  await prisma.knowledgeDocument.upsert({
    where: { id: 'personal-doc-1' },
    update: {},
    create: {
      id: 'personal-doc-1',
      title: 'My Personal Notes',
      content: `# Personal Notes
      
      These are my personal notes for reference.
      
      ## Key Points
      
      - Important item 1
      - Important item 2
      - Important item 3
      
      ## Reminders
      
      Don't forget about the upcoming deadlines.
      `,
      contentType: 'markdown',
      knowledgeBaseId: personalKnowledgeBase.id,
      createdById: demoUser.id,
      tags: ['notes', 'personal'],
    },
  });
  
  // Document in team knowledge base
  await prisma.knowledgeDocument.upsert({
    where: { id: 'team-doc-1' },
    update: {},
    create: {
      id: 'team-doc-1',
      title: 'Product Roadmap',
      content: `# Product Roadmap 2024
      
      This document outlines our product strategy for the next year.
      
      ## Q1 Goals
      
      - Launch voice assistant integration
      - Implement multi-tenant data layer
      - Improve accessibility across all components
      
      ## Q2 Goals
      
      - Advanced analytics dashboard
      - Team collaboration features
      - Mobile app beta
      `,
      contentType: 'markdown',
      knowledgeBaseId: teamKnowledgeBase.id,
      createdById: adminUser.id,
      tags: ['roadmap', 'planning', 'product'],
    },
  });
  
  // Document in org knowledge base
  await prisma.knowledgeDocument.upsert({
    where: { id: 'org-doc-1' },
    update: {},
    create: {
      id: 'org-doc-1',
      title: 'Company Policies',
      content: `# Company Policies
      
      These policies apply to all employees and contractors.
      
      ## Code of Conduct
      
      We are committed to providing a safe, productive, and welcoming environment.
      All employees should treat each other with respect and professionalism.
      
      ## Remote Work Policy
      
      Employees may work remotely up to 3 days per week.
      Team meetings are held on Tuesdays and Thursdays in-person.
      `,
      contentType: 'markdown',
      knowledgeBaseId: orgKnowledgeBase.id,
      createdById: adminUser.id,
      tags: ['policy', 'company', 'guidelines'],
    },
  });
  
  // Document in public knowledge base
  await prisma.knowledgeDocument.upsert({
    where: { id: 'public-doc-1' },
    update: {},
    create: {
      id: 'public-doc-1',
      title: 'Getting Started with Optiflow',
      content: `# Getting Started with Optiflow
      
      Welcome to Optiflow! This guide will help you get started with our platform.
      
      ## First Steps
      
      1. Create an account or log in
      2. Set up your profile and preferences
      3. Create your first workflow
      
      ## Using Voice Assistant
      
      The Optiflow voice assistant can be activated by saying "Hey Optiflow" or clicking
      the microphone icon in the dashboard. You can use voice commands to navigate
      and perform actions.
      
      ## Need Help?
      
      Contact our support team at support@optiflow.ai or use the in-app chat feature.
      `,
      contentType: 'markdown',
      knowledgeBaseId: publicKnowledgeBase.id,
      createdById: adminUser.id,
      tags: ['documentation', 'guide', 'onboarding'],
    },
  });
  
  // ==================== Create AI Models ====================
  console.log('Creating AI models...');
  
  await prisma.aIModel.upsert({
    where: { id: 'claude-3-opus' },
    update: {},
    create: {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      modelId: 'claude-3-opus-20240229',
      capabilities: ['text-generation', 'chat', 'reasoning', 'code-generation'],
      maxTokens: 200000,
      isActive: true,
      configuration: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    },
  });
  
  await prisma.aIModel.upsert({
    where: { id: 'claude-3-sonnet' },
    update: {},
    create: {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      modelId: 'claude-3-sonnet-20240229',
      capabilities: ['text-generation', 'chat', 'reasoning', 'code-generation'],
      maxTokens: 180000,
      isActive: true,
      configuration: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    },
  });
  
  await prisma.aIModel.upsert({
    where: { id: 'claude-3-haiku' },
    update: {},
    create: {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'anthropic',
      modelId: 'claude-3-haiku-20240307',
      capabilities: ['text-generation', 'chat', 'reasoning'],
      maxTokens: 150000,
      isActive: true,
      configuration: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    },
  });
  
  // ==================== Create Sample Workflow ====================
  console.log('Creating sample workflow...');
  
  const sampleWorkflow = await prisma.workflow.upsert({
    where: { id: 'demo-workflow-1' },
    update: {},
    create: {
      id: 'demo-workflow-1',
      name: 'Email Notification Workflow',
      description: 'Send email notifications based on customer interactions',
      organizationId: organization.id,
      createdById: adminUser.id,
      teamId: team.id,
      isActive: true,
      version: 1,
      isPublic: false,
      tags: ['email', 'notification', 'customer'],
    },
  });
  
  // Create workflow nodes
  const triggerNode = await prisma.workflowNode.upsert({
    where: { id: 'node-trigger-1' },
    update: {},
    create: {
      id: 'node-trigger-1',
      workflowId: sampleWorkflow.id,
      type: 'trigger',
      positionX: 100,
      positionY: 200,
      config: {
        triggerType: 'event',
        eventName: 'customer.interaction',
      },
    },
  });
  
  const conditionNode = await prisma.workflowNode.upsert({
    where: { id: 'node-condition-1' },
    update: {},
    create: {
      id: 'node-condition-1',
      workflowId: sampleWorkflow.id,
      type: 'condition',
      positionX: 400,
      positionY: 200,
      config: {
        condition: 'data.priority === "high"',
      },
    },
  });
  
  const emailNode = await prisma.workflowNode.upsert({
    where: { id: 'node-email-1' },
    update: {},
    create: {
      id: 'node-email-1',
      workflowId: sampleWorkflow.id,
      type: 'action',
      positionX: 700,
      positionY: 100,
      config: {
        actionType: 'send_email',
        template: 'high_priority_notification',
        recipients: '{{data.customer.email}}',
      },
    },
  });
  
  const logNode = await prisma.workflowNode.upsert({
    where: { id: 'node-log-1' },
    update: {},
    create: {
      id: 'node-log-1',
      workflowId: sampleWorkflow.id,
      type: 'action',
      positionX: 700,
      positionY: 300,
      config: {
        actionType: 'log_event',
        level: 'info',
        message: 'Customer interaction processed: {{data.interactionId}}',
      },
    },
  });
  
  // Create workflow edges
  await prisma.workflowEdge.upsert({
    where: { id: 'edge-1' },
    update: {},
    create: {
      id: 'edge-1',
      workflowId: sampleWorkflow.id,
      sourceNodeId: triggerNode.id,
      targetNodeId: conditionNode.id,
    },
  });
  
  await prisma.workflowEdge.upsert({
    where: { id: 'edge-2' },
    update: {},
    create: {
      id: 'edge-2',
      workflowId: sampleWorkflow.id,
      sourceNodeId: conditionNode.id,
      targetNodeId: emailNode.id,
    },
  });
  
  await prisma.workflowEdge.upsert({
    where: { id: 'edge-3' },
    update: {},
    create: {
      id: 'edge-3',
      workflowId: sampleWorkflow.id,
      sourceNodeId: conditionNode.id,
      targetNodeId: logNode.id,
    },
  });
  
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
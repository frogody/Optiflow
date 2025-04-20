import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create default user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@optiflow.ai',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Created default user:', user.email);

  // Create default organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Default Organization',
      plan: 'free',
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log('Created default organization:', organization.name);

  // Create default AI models
  const aiModels = await prisma.aIModel.createMany({
    data: [
      {
        name: 'Claude-3 Opus',
        provider: 'ANTHROPIC',
        modelId: 'claude-3-opus-20240229',
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        maxTokens: 4096,
        configuration: {
          costPer1kTokens: 0.015,
          contextWindow: 200000,
        },
      },
      {
        name: 'Claude-3 Sonnet',
        provider: 'ANTHROPIC',
        modelId: 'claude-3-sonnet-20240229',
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        maxTokens: 4096,
        configuration: {
          costPer1kTokens: 0.003,
          contextWindow: 200000,
        },
      },
    ],
  });

  console.log('Created AI models');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
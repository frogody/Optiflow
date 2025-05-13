const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// The email of the user to set as admin
const targetEmail = 'gody@isyncso.com';

async function main() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!existingUser) {
      console.log(`User with email ${targetEmail} does not exist. Creating the user...`);
      
      // Create the user if they don't exist
      const newUser = await prisma.user.create({
        data: {
          email: targetEmail,
          name: 'Gody Duinsbergen',
          role: 'admin',
          organizations: {
            create: {
              organization: {
                create: {
                  name: 'Optiflow Admin Organization',
                  plan: 'enterprise',
                }
              },
              role: 'OWNER',
            }
          }
        },
      });
      
      console.log(`✅ Created new admin user with ID: ${newUser.id}`);
      console.log('Note: You will need to set a password for this user or use password reset.');
      return;
    }

    // Update the existing user to admin role
    const updatedUser = await prisma.user.update({
      where: { email: targetEmail },
      data: { role: 'admin' },
    });

    console.log(`✅ User with email ${targetEmail} has been updated to admin role.`);
    console.log(`User ID: ${updatedUser.id}`);
    console.log(`User Name: ${updatedUser.name || 'Not set'}`);
    console.log(`Current Role: ${updatedUser.role}`);
    
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
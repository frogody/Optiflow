const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Email and new password
const targetEmail = 'gody@isyncso.com';
const newPassword = 'OptiflowAdmin123!';  // You should change this to a secure password

async function main() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!existingUser) {
      console.error(`User with email ${targetEmail} does not exist.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email: targetEmail },
      data: { passwordHash: hashedPassword },
    });

    console.log(`✅ Password for user ${targetEmail} has been updated.`);
    console.log(`You can now log in with:`);
    console.log(`Email: ${targetEmail}`);
    console.log(`Password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error setting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
process.env.NEXTAUTH_URL = 'http://localhost:3987';
console.log('NEXTAUTH_URL set to:', process.env.NEXTAUTH_URL);

// This script will set the environment variable for the current process only
// You need to manually update your .env.local file or run this script before starting the dev server 
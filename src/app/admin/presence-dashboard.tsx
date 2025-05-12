import Redis from 'ioredis';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

const redis = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379');

async function getAllUserPresence() {
  const keys = await redis.keys('user:*:presence');
  const users = [];
  for (const key of keys) {
    const userId = key.split(':')[1];
    const data = await redis.hgetall(key);
    users.push({
      userId,
      lastActive: data['lastActive'] ? new Date(Number(data['lastActive'])).toLocaleString() : 'N/A',
      inactive: data['inactive'] === '1',
    });
  }
  return users;
}

export default async function AdminPresenceDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return <div>Unauthorized</div>;
  }
  const users = await getAllUserPresence();
  return (
    <div style={{ padding: 32 }}>
      <h1>Presence Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>User ID</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Last Active</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Inactive</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{u.userId}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{u.lastActive}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{u.inactive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
import { GetServerSideProps } from 'next';
import { redis } from '@/lib/upstash';

export const getServerSideProps: GetServerSideProps = async () => {
  // Get all presence keys
  const keys = await redis.keys('user:*:presence');
  const users = [];

  // Fetch data for each user
  for (const key of keys) {
    const data = await redis.hgetall(key);
    if (data) {
      const userId = key.split(':')[1];
      users.push({
        userId,
        lastActive: data.lastActive ? new Date(parseInt(data.lastActive)).toISOString() : null,
        inactive: data.inactive === '1',
      });
    }
  }

  return {
    props: {
      users,
      timestamp: new Date().toISOString(),
    },
  };
};

export default function AdminPresenceDashboard({ users }) {
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
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{u.lastActive ? u.lastActive.split('T')[1].split('.')[0] : 'N/A'}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{u.inactive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
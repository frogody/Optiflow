import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const DashboardCard = ({ title, description, icon, link, color }: DashboardCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-lg p-6 bg-gradient-to-br ${color} bg-opacity-20 transition-all duration-200 border border-white/10 backdrop-blur-sm`}
    >
      <Link href={link} className="block h-full">
        <div className="flex flex-col h-full">
          <div className="text-3xl mb-4">{icon}</div>
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-sm flex-grow">{description}</p>
          <div className="mt-4 flex justify-end">
            <span className="text-white text-sm opacity-75">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DashboardCard; 
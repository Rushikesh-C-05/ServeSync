import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, label, value, color = 'neon-blue', trend }) => {
  return (
    <motion.div
      className="glass-card p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`text-${color} text-2xl`} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard

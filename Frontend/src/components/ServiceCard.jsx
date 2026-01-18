import { motion } from 'framer-motion'
import { FiStar, FiClock, FiDollarSign } from 'react-icons/fi'

const ServiceCard = ({ service, onClick }) => {
  return (
    <motion.div
      className="glass-card overflow-hidden cursor-pointer group"
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image || 'https://via.placeholder.com/400x300'}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-yellow-400">
            <FiStar className="fill-current" />
            <span className="font-semibold">{service.rating}</span>
            <span className="text-gray-500 text-sm">({service.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <FiClock size={14} />
            <span className="text-sm">{service.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <FiDollarSign className="text-neon-green" />
            <span className="text-2xl font-bold text-neon-green">{service.price}</span>
          </div>
          <motion.button
            className="btn-primary text-sm py-2 px-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceCard

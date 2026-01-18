import { FiStar, FiClock, FiDollarSign, FiPackage } from "react-icons/fi";

const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiPackage className="w-16 h-16 text-white/50" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-amber-500">
            <FiStar className="fill-current" />
            <span className="font-semibold text-gray-900">
              {service.rating}
            </span>
            <span className="text-gray-400 text-sm">({service.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <FiClock size={14} />
            <span className="text-sm">{service.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <FiDollarSign className="text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {service.price}
            </span>
          </div>
          <button className="btn-primary text-sm py-2 px-4">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

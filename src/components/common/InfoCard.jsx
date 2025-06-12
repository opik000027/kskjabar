import React from 'react';

const InfoCard = ({ title, value, icon: IconComponent, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 ${className}`}>
      {IconComponent && (
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <IconComponent size={24} /> {/* Render the icon component */}
        </div>
      )}
      <div>
        <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
        <p className="text-gray-900 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;

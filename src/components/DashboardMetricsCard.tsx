import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const DashboardMetricsCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  color 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="card flex items-start">
      <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <p 
              className={`ml-2 text-sm font-medium ${
                change.positive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.positive ? '+' : ''}{change.value}
            </p>
          )}
        </div>
        {change && (
          <p className="mt-1 text-xs text-gray-500">
            Compared to last month
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardMetricsCard;
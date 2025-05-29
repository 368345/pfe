import React from 'react';
import { DollarSign, Users, FileText } from 'lucide-react';
import DashboardMetricsCard from '../components/DashboardMetricsCard';
import InvoiceList from '../components/InvoiceList';
import ColumnChart from '../components/charts/ColumnChart';
import {useDashboardSummary, useTopClients, useRecentInvoices} from '../services/api';
import { formatAmount } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { recentInvoices, loading } = useRecentInvoices();
  const { stats: generalStats } = useDashboardSummary();
  const { clients: topClients } = useTopClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div>
          <button className="btn-primary">
            Download Report
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardMetricsCard
        title="Total Revenue"
        value={formatAmount(generalStats?.totalRevenue || 0)}
        icon={<DollarSign size={24} />}
        color="blue"
      />
      <DashboardMetricsCard
        title="Invoices Processed"
        value={generalStats?.totalInvoices || 0}
        icon={<FileText size={24} />}
        color="green"
      />
      <DashboardMetricsCard
        title="Active Clients"
        value={generalStats?.totalClients || 0}
        icon={<Users size={24} />}
        color="purple"
      />
    </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Invoice Activity</h2>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
            <ColumnChart />
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Top Clients</h2>
            <select className="text-sm border-gray-300 rounded-md">
              <option>By Revenue</option>
              <option>By Volume</option>
            </select>
          </div>
          <div className="space-y-4">
          {topClients?.slice(0, 5).map((client, index) => (
            <div key={index} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                {client.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm font-medium text-gray-900">{formatAmount(client.totalValue)}</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${(client.totalValue / (generalStats?.totalRevenue ?? 0) ) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      
      {/* Recent Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
          <a href="/invoices" className="text-sm text-blue-600 hover:text-blue-800">View all</a>
        </div>
        <InvoiceList invoices={recentInvoices} loading={loading} />
    </div>
    </div>
  );
};

export default Dashboard;
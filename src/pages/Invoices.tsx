import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvoiceList from '../components/InvoiceList';
import {useInvoices} from '../services/api';

const Invoices: React.FC = () => {
  const { invoices, loading, error } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
      const matchesStatus = filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Link to="/upload" className="btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Upload Invoice
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices..."
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block pl-10 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>

        <InvoiceList invoices={filteredInvoices} loading={loading} />
      </div>
    </div>
  );
};

export default Invoices;

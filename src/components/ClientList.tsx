import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ClientListProps {
  clients: Client[];
  loading?: boolean;
}

const ClientList: React.FC<ClientListProps> = ({ clients, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium text-gray-900">No clients found</h3>
        <p className="mt-1 text-sm text-gray-500">Add your first client to get started.</p>
        <div className="mt-6">
          <button className="btn-primary">
            Add Client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Link 
          key={client?.id} 
          to={`/clients/${client?.id}`}
          className="block"
        >
          <div className="card hover:border-blue-500 hover:border transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {client?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{client?.name}</h3>
                <p className="text-sm text-gray-500">{client?.email}</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Invoices</p>
                  <p className="text-lg font-medium">{client?.invoiceCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-lg font-medium">{formatCurrency(client?.totalValue)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Last invoice: {formatDate(client?.lastInvoiceDate ?? client?.created_at )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ClientList;
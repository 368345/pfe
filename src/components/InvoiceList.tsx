import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Filter, FileCheck, FileWarning } from 'lucide-react';
import { formatAmount, formatDate } from '../utils/formatters';
import { Invoice } from '../types/Invoice';

interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, loading = false }) => {
  const [sortField, setSortField] = useState<keyof Invoice>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Invoice) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedInvoices = () => {
    return [...invoices].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIcon = ({ field }: { field: keyof Invoice }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileWarning size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first invoice?.</p>
        <div className="mt-6">
          <Link to="/upload" className="btn-primary">
            Upload Invoice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Invoices</h3>
        <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
          <Filter size={16} className="mr-1" />
          Filter
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => handleSort('invoiceNumber')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
            >
              <div className="flex items-center">
                Invoice #
                <SortIcon field="invoiceNumber" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('clientName')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
            >
              <div className="flex items-center">
                Client
                <SortIcon field="clientName" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('date')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
            >
              <div className="flex items-center">
                Date
                <SortIcon field="date" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('amount')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
            >
              <div className="flex items-center">
                Amount
                <SortIcon field="amount" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('status')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedInvoices().map((invoice) => (
            <tr key={invoice?.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                <Link to={`/invoices/${invoice?.id}`}>
                  {invoice?.invoiceNumber ?? invoice?.invoice_number}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {invoice?.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(invoice?.date ?? invoice?.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatAmount(invoice?.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice?.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    invoice?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {invoice?.status === 'paid' && <FileCheck size={12} className="mr-1" />}
                  {invoice?.status.charAt(0).toUpperCase() + invoice?.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link 
                  to={`/invoices/${invoice?.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </Link>
                <span className="mx-2">|</span>
                <Link 
                  to={`/invoices/${invoice?.id}?edit=true`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
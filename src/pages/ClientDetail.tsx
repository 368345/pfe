import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Mail, Phone, MapPin, FileText, DollarSign, BarChart } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import InvoiceList from '../components/InvoiceList';
import { formatAmount } from '../utils/formatters';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, getClientInvoices } = useInvoice();
  
  const client = getClientById(id || '');
  const clientInvoices = getClientInvoices(id || '');
  
  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium text-gray-900">Client not found</h3>
        <button 
          onClick={() => navigate('/clients')}
          className="mt-4 btn-primary"
        >
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Clients
        </button>
        
        <button className="btn-primary flex items-center">
          <Edit size={16} className="mr-1" />
          Edit Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-700 p-6 text-white">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold text-3xl">
                {client.name.charAt(0)}
              </div>
              <h1 className="mt-4 text-2xl font-bold">{client.name}</h1>
              <p className="text-blue-100">{client.company}</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{client.phone || "(555) 123-4567"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">123 Business St.</p>
                    <p className="text-gray-900">New York, NY 10001</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Client Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <p className="ml-2 text-sm font-medium text-gray-500">Total Invoices</p>
                    </div>
                    <p className="mt-1 text-2xl font-semibold">{client.invoiceCount}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <p className="ml-2 text-sm font-medium text-gray-500">Revenue</p>
                    </div>
                    <p className="mt-1 text-2xl font-semibold">{formatAmount(client.totalValue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Client Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Activity Overview</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <BarChart size={48} className="text-gray-300" />
              <p className="ml-3 text-gray-500">Invoice activity chart will appear here</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Client Invoices</h2>
              <button 
                onClick={() => navigate('/upload')}
                className="btn-primary flex items-center text-sm"
              >
                New Invoice
              </button>
            </div>
            
            <InvoiceList invoices={clientInvoices} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Download, Share, Edit, Trash, FileText, Calendar, DollarSign, CheckCircle, CheckCircle as ClockCircle, AlertCircle } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { formatAmount, formatDate } from '../utils/formatters';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const navigate = useNavigate();
  const { getInvoiceById, updateInvoice, deleteInvoice } = useInvoice();
  
  const invoice = getInvoiceById(id || '');
  const [formData, setFormData] = useState(invoice);
  
  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium text-gray-900">Invoice not found</h3>
        <button 
          onClick={() => navigate('/invoices')}
          className="mt-4 btn-primary"
        >
          Back to Invoices
        </button>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInvoice(formData);
    navigate(`/invoices/${id}`);
  };
  
  const confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id || '');
      navigate('/invoices');
    }
  };
  
  // Status icon based on invoice status
  const StatusIcon = () => {
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'pending':
        return <ClockCircle size={20} className="text-yellow-500" />;
      case 'overdue':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Invoices
        </button>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center">
            <Download size={16} className="mr-1" />
            Download
          </button>
          <button className="btn-secondary flex items-center">
            <Share size={16} className="mr-1" />
            Share
          </button>
          {!isEditing && (
            <>
              <button 
                onClick={() => navigate(`/invoices/${id}?edit=true`)}
                className="btn-primary flex items-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button 
                onClick={confirmDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
              <div className="flex items-center mt-2">
                <StatusIcon />
                <span className="ml-2 text-sm font-medium">
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 text-blue-100">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Issued: {formatDate(invoice.date)}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Due: {formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Content */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Client Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Email</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="mt-1 input-field"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/invoices/${id}`)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Billed To</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{invoice.clientName}</h4>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                  <p className="text-gray-600">123 Business St.</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">Credit Card</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Card Number:</span>
                    <span className="text-gray-900">**** **** **** 1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="text-gray-900">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Invoice Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="text-gray-900">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="text-gray-900">{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-700">{formatAmount(invoice.amount)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Document Preview</h3>
                  <div className="border border-gray-200 rounded-lg flex items-center justify-center h-64 bg-gray-50">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to view full document</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Professional Services</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAmount(invoice.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatAmount(invoice.amount)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Subtotal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatAmount(invoice.amount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tax (0%)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatAmount(0)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">{formatAmount(invoice.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
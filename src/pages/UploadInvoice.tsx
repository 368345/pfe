import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, FileText, Check, X, Loader } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';

const UploadInvoice: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addInvoice } = useInvoice();
  
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    simulateProcessing();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simulate processing the invoice
  const simulateProcessing = () => {
    setProcessing(true);
    
    setTimeout(() => {
      // Mock extracted data
      const mockData = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        clientName: 'Acme Corporation',
        clientEmail: 'billing@acmecorp.com',
        amount: Math.floor(Math.random() * 10000) / 100,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending'
      };
      
      setExtractedData(mockData);
      setProcessing(false);
      setProcessed(true);
    }, 2000);
  };

  const handleSave = () => {
    addInvoice({
      id: `${Date.now()}`,
      ...extractedData
    });
    navigate('/invoices');
  };

  const handleCancel = () => {
    setFile(null);
    setProcessed(false);
    setExtractedData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Upload Invoice</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {!processed ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleInputChange}
              />
              
              {processing ? (
                <div className="space-y-4">
                  <Loader size={48} className="mx-auto text-blue-500 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900">Processing Invoice...</h3>
                  <p className="text-gray-500">
                    We're extracting data from your invoice. This may take a moment.
                  </p>
                </div>
              ) : file ? (
                <div className="space-y-4">
                  <FileText size={48} className="mx-auto text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                  <p className="text-gray-500">
                    File is ready to process. We'll extract all the important information automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileUp size={48} className="mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Upload Invoice Document</h3>
                  <p className="text-gray-500">
                    Drag and drop your invoice here, or click to browse files
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, JPG or PNG files
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check size={24} className="text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Invoice Processed Successfully
                </h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-700 mb-4">Extracted Data</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                      <input
                        type="text"
                        value={extractedData.invoiceNumber}
                        onChange={(e) => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        value={extractedData.date}
                        onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        value={extractedData.dueDate}
                        onChange={(e) => setExtractedData({...extractedData, dueDate: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client Name</label>
                      <input
                        type="text"
                        value={extractedData.clientName}
                        onChange={(e) => setExtractedData({...extractedData, clientName: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client Email</label>
                      <input
                        type="email"
                        value={extractedData.clientEmail}
                        onChange={(e) => setExtractedData({...extractedData, clientEmail: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        value={extractedData.amount}
                        onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})}
                        className="mt-1 input-field"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <Check size={16} className="mr-1" />
                    Save Invoice
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadInvoice;
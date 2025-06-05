import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, FileText, Check, X, Loader } from "lucide-react";
import { useExtractInvoice, useUpdateInvoice } from "../services/api";

const UploadInvoice: React.FC = () => {
  const extractMutation = useExtractInvoice();
  const updateMutation = useUpdateInvoice();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    processFile(selectedFile);
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

  const processFile = async (file: File) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      const fileType = file.type.includes("pdf") ? "pdf" : "image";

      try {
        const data = await extractMutation.mutateAsync({
          base64: `data:${file.type};base64,${base64String}`,
          fileType,
        });

        if (data) {
          const extracted = {
            invoiceId: data["invoice_id"] || "",
            invoiceNumber: data["Invoice Number"] || "",
            companyName: data["Company Name"] || "",
            companyAddress: data["Company Address"] || "",
            clientName: data["Customer Name"] || "",
            clientAddress: data["Customer Address"] || "",
            description: data["Description"] || "",
            quantity: data["Quantity"] || 0,
            unitPrice: data["Unit Price"] || 0,
            taxes: data["Taxes"] || 0,
            amount: data["Amount"] || 0,
            total: data["Total"] || 0,
            date: data["Invoice Date"] || "",
            dueDate: data["Due Date"] || "",
            clientEmail: "",
            status: "pending",
          };

          setExtractedData(extracted);
        }
      } catch (err) {
        console.error("Error extracting invoice", err);
      }
    };

    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    if (!extractedData?.invoiceId) {
      alert("No invoice ID found to update.");
      return;
    }

    await updateMutation.mutateAsync(extractedData, {
      onSuccess: () => {
        navigate("/invoices");
      },
      onError: (error: any) => {
        console.error("Failed to save invoice", error);
        alert("Failed to save invoice. Please try again.");
      },
    });
  };

  const handleCancel = () => {
    setFile(null);
    setExtractedData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Upload Invoice</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {!extractMutation.isSuccess ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
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

              {extractMutation.isPending ? (
                <div className="space-y-4">
                  <Loader
                    size={48}
                    className="mx-auto text-blue-500 animate-spin"
                  />
                  <h3 className="text-lg font-medium text-gray-900">
                    Processing Invoice...
                  </h3>
                  <p className="text-gray-500">
                    We're extracting data from your invoice. This may take a
                    moment.
                  </p>
                </div>
              ) : file ? (
                <div className="space-y-4">
                  <FileText size={48} className="mx-auto text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {file.name}
                  </h3>
                  <p className="text-gray-500">
                    File is ready to process. We'll extract all the important
                    information automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileUp size={48} className="mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload Invoice Document
                  </h3>
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
                <h4 className="text-md font-medium text-gray-700 mb-4">
                  Extracted Data
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        value={extractedData.invoiceNumber}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            invoiceNumber: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        value={extractedData.date}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            date: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={extractedData.dueDate}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            dueDate: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={extractedData.companyName}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            companyName: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Address
                      </label>
                      <input
                        type="text"
                        value={extractedData.companyAddress}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            companyAddress: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={extractedData.clientName}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            clientName: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Client Address
                      </label>
                      <input
                        type="text"
                        value={extractedData.clientAddress}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            clientAddress: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        value={extractedData.description}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={extractedData.quantity}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            quantity: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={extractedData.unitPrice}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            unitPrice: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Taxes
                      </label>
                      <input
                        type="number"
                        value={extractedData.taxes}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            taxes: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={extractedData.amount}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            amount: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total
                      </label>
                      <input
                        type="number"
                        value={extractedData.total}
                        onChange={(e) =>
                          setExtractedData({
                            ...extractedData,
                            total: e.target.value,
                          })
                        }
                        className="mt-1 input-field"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={handleCancel} className="btn-secondary">
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={updateMutation.isPending}
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

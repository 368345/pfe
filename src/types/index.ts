export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  invoiceCount: number;
  totalValue: number;
  lastInvoiceDate: string;
}
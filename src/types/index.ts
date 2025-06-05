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
  id: number;
  name: string;
  email: string;
  address: string;
  createdAt: string | null;
  invoiceCount: number;
  totalValue: number;
  lastInvoiceDate: string | null;
}
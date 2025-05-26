export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | string;
}

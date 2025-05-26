import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice, Client, InvoiceStatus } from '../types';

interface InvoiceStats {
  totalRevenue: number;
  processedInvoices: number;
  activeClients: number;
  processingRate: number;
}

interface InvoiceContextType {
  invoices: Invoice[];
  clients: Client[];
  stats: InvoiceStats;
  loading: boolean;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getClientById: (id: string) => Client | undefined;
  getClientInvoices: (clientId: string) => Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<InvoiceStats>({
    totalRevenue: 0,
    processedInvoices: 0,
    activeClients: 0,
    processingRate: 0,
  });

  useEffect(() => {
    // Load mock data
    const mockInvoices = generateMockInvoices(12);
    const mockClients = generateMockClients(5);
    
    // Calculate stats
    const totalRevenue = mockInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const processedInvoices = mockInvoices.length;
    const activeClients = mockClients.length;
    const processingRate = 92;
    
    setInvoices(mockInvoices);
    setClients(mockClients);
    setStats({
      totalRevenue,
      processedInvoices,
      activeClients,
      processingRate,
    });
    
    setLoading(false);
  }, []);

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + invoice.amount,
      processedInvoices: prev.processedInvoices + 1,
    }));
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => {
      const oldInvoice = prev.find(inv => inv.id === updatedInvoice.id);
      const updatedInvoices = prev.map(inv => 
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      );
      
      // Update stats if amount changed
      if (oldInvoice && oldInvoice.amount !== updatedInvoice.amount) {
        setStats(prev => ({
          ...prev,
          totalRevenue: prev.totalRevenue - oldInvoice.amount + updatedInvoice.amount,
        }));
      }
      
      return updatedInvoices;
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => {
      const invoiceToDelete = prev.find(inv => inv.id === id);
      const updatedInvoices = prev.filter(inv => inv.id !== id);
      
      // Update stats
      if (invoiceToDelete) {
        setStats(prev => ({
          ...prev,
          totalRevenue: prev.totalRevenue - invoiceToDelete.amount,
          processedInvoices: prev.processedInvoices - 1,
        }));
      }
      
      return updatedInvoices;
    });
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getClientInvoices = (clientId: string) => {
    const client = getClientById(clientId);
    if (!client) return [];
    
    return invoices.filter(invoice => invoice.clientName === client.name);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients,
        stats,
        loading,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getClientById,
        getClientInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

// Mock data generators
const generateMockInvoices = (count: number): Invoice[] => {
  const statuses: InvoiceStatus[] = ['paid', 'pending', 'overdue'];
  const clients = ['Acme Corporation', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Wayne Enterprises'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const clientName = clients[Math.floor(Math.random() * clients.length)];
    
    return {
      id: `inv-${i + 1}`,
      invoiceNumber: `INV-${1000 + i}`,
      clientName,
      clientEmail: `billing@${clientName.toLowerCase().replace(/\s+/g, '')}.com`,
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 10000) / 100 + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  });
};

const generateMockClients = (count: number): Client[] => {
  const companies = [
    'Acme Corporation',
    'Globex Inc',
    'Initech',
    'Umbrella Corp',
    'Wayne Enterprises',
  ];
  
  return companies.slice(0, count).map((name, i) => {
    const invoiceCount = Math.floor(Math.random() * 5) + 1;
    const totalValue = Math.floor(Math.random() * 10000) + 1000;
    
    const lastInvoiceDate = new Date();
    lastInvoiceDate.setDate(lastInvoiceDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `client-${i + 1}`,
      name,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      company: name,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      invoiceCount,
      totalValue,
      lastInvoiceDate: lastInvoiceDate.toISOString().split('T')[0],
    };
  });
};
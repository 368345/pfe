import axios from "axios";
import { useEffect, useState } from "react";
import { Invoice } from "../types/Invoice";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

const API_URL = 'http://localhost:9090'; // URL de l'API backend


const extractInvoiceData = async (base64Image: string) => {
  const response = await axios.post(`${API_URL}/ocr`, { image: base64Image }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const useExtractInvoice = () => {
  return useMutation({
    mutationFn: (base64: string) => extractInvoiceData(base64)
  });
};

/**
 * Hook to fetch revenue data per day of the week
 */
export const useRevenuePerDay = () => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/revenue-per-day`);
        const values = res.data.map((entry: any) => entry.total);
        setData(values);
      } catch (err) {
        console.error("Failed to fetch revenue per day:", err);
        setError("Unable to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { data, loading, error };
};

/**
 * Hook to fetch summary dashboard metrics
 */
export const useDashboardSummary = () => {
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalInvoices: number;
    totalClients: number;
  }>({
    totalRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/summary`);
        setStats({
          totalRevenue: res.data.total_revenue || 0,
          totalInvoices: res.data.total_invoices || 0,
          totalClients: res.data.total_clients || 0,
        });
      } catch (err) {
        console.error("Failed to fetch summary stats:", err);
        setError("Unable to load dashboard summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return { stats, loading, error };
};


/**
 * Hook to fetch top clients by revenue
 */
export const useTopClients = () => {
  const [clients, setClients] = useState<{ name: string; totalValue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/top-clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch top clients:", err);
        setError("Unable to load top clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
};

export const useRecentInvoices = () => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/recent-invoices`);
        setRecentInvoices(res.data);
      } catch (err) {
        console.error("Failed to fetch recent invoices", err);
        setError("Unable to load recent invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return { recentInvoices, loading, error };
};

import { useState, useEffect } from 'react';

export interface Invoice {
  id: number;
  company_name: string;
  invoice_number: string;
  invoice_date: string | null;
  total_amount: number;
  status: string;
  created_at: string | null;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`${API_URL}/invoices`);
        setInvoices(res.data);
      } catch (err) {
        console.error("Failed to fetch recent invoices", err);
        setError("Unable to load recent invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return { invoices, loading, error };
}


export interface Client {
  id: number;
  name: string;
  address?: string;
  created_at?: string;
  email?: string;
  invoice_count: number;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_URL}/clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
        setError("Unable to load clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
}

const updateInvoice = async (
  invoiceData: any
): Promise<any> => {
  const response = await axios.put(`${API_URL}/invoices/${invoiceData.invoiceId}`, {
    invoiceNumber: invoiceData.invoiceNumber,
    companyName: invoiceData.companyName,
    companyAddress: invoiceData.companyAddress,
    clientName: invoiceData.clientName,
    clientAddress: invoiceData.clientAddress,
    date: invoiceData.date,
    dueDate: invoiceData.dueDate,
    taxes: invoiceData.taxes,
    total: invoiceData.total,
    description: invoiceData.description,
    quantity: invoiceData.quantity,
    unitPrice: invoiceData.unitPrice,
    amount: invoiceData.amount,
  });

  return response.data;
};

export const useUpdateInvoice = (): UseMutationResult<
  any,
  Error,
  any,
  unknown
> => {
  const mutationConfig: UseMutationOptions<
    any,
    Error,
    any,
    unknown
  > = {
    mutationFn: (values) => updateInvoice(values),
  };

  return useMutation(mutationConfig);
};
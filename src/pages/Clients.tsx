import React, { useState } from 'react';
import { Search, Plus, Grid, List } from 'lucide-react';
import ClientList from '../components/ClientList';
import {useClients} from '../services/api';

const Clients: React.FC = () => {
  const { clients, loading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredClients = clients.filter(client => {
    const name = (client.name || "").toLowerCase();
    const address = (client.address || "").toLowerCase();
    const search = searchTerm.toLowerCase();
  
    return name.includes(search) || address.includes(search);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button className="btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search clients..."
              />
            </div>
            
            <div className="flex items-center">
              <div className="flex border border-gray-300 rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <ClientList clients={filteredClients} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Clients;
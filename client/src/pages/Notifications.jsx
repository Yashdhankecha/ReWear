import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/seller/transactions');
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (transactionId, action) => {
    try {
      await axios.put(`/api/dashboard/transactions/${transactionId}/respond`, {
        action
      });
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => 
          t._id === transactionId 
            ? { ...t, status: action === 'accept' ? 'accepted' : 'rejected' }
            : t
        )
      );
      
      // Show success message
      alert(`Transaction ${action}ed successfully!`);
    } catch (err) {
      setError(`Failed to ${action} transaction`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      accepted: { color: 'bg-green-500', text: 'Accepted' },
      rejected: { color: 'bg-red-500', text: 'Rejected' },
      completed: { color: 'bg-blue-500', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-500', text: 'Unknown' };
    
    return (
      <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Notifications</h1>
            <p className="text-slate-300 text-lg">
              Manage your incoming purchase requests and offers
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Notifications List */}
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Notifications</h3>
              <p className="text-slate-400">
                You don't have any pending purchase requests or offers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
                >
                  <div className="flex items-start gap-6">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={transaction.item.images[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={transaction.item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {transaction.item.title}
                          </h3>
                          <p className="text-slate-400 mb-2">
                            Buyer: {transaction.buyer.name} ({transaction.buyer.email})
                          </p>
                          <p className="text-slate-400">
                            Type: {transaction.type === 'buy' ? 'Direct Purchase' : 'Offer'}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(transaction.status)}
                          <div className="text-2xl font-bold text-blue-400 mt-2">
                            {transaction.offerAmount} points
                          </div>
                        </div>
                      </div>

                      {transaction.message && (
                        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                          <p className="text-slate-300">
                            <strong>Message:</strong> {transaction.message}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-slate-400 mb-4">
                        Requested: {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>

                      {/* Action Buttons */}
                      {transaction.status === 'pending' && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleResponse(transaction._id, 'accept')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleResponse(transaction._id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Mock API for demonstration
const mockFetchOrders = async (query = '', status = '', payment = '', page = 1, limit = 8) => {
  await new Promise(res => setTimeout(res, 500));
  const allOrders = [
  { id: 'ORD001', buyer: 'Alice', seller: 'Bob', status: 'Shipped', payment: 'Held' },
  { id: 'ORD002', buyer: 'Charlie', seller: 'Dave', status: 'Pending', payment: 'Pending' },
  { id: 'ORD003', buyer: 'Eve', seller: 'Frank', status: 'Delivered', payment: 'Released' },
    { id: 'ORD004', buyer: 'Grace', seller: 'Henry', status: 'Pending', payment: 'Pending' },
    { id: 'ORD005', buyer: 'Ivy', seller: 'Jack', status: 'Shipped', payment: 'Held' },
    { id: 'ORD006', buyer: 'Mike', seller: 'Nina', status: 'Delivered', payment: 'Released' },
    { id: 'ORD007', buyer: 'Oscar', seller: 'Paul', status: 'Pending', payment: 'Pending' },
    { id: 'ORD008', buyer: 'Quinn', seller: 'Rita', status: 'Shipped', payment: 'Held' },
    { id: 'ORD009', buyer: 'Steve', seller: 'Tina', status: 'Delivered', payment: 'Released' },
    { id: 'ORD010', buyer: 'Uma', seller: 'Victor', status: 'Pending', payment: 'Pending' },
  ];
  let filtered = allOrders.filter(o =>
    (!query || o.id.toLowerCase().includes(query.toLowerCase()) || o.buyer.toLowerCase().includes(query.toLowerCase()) || o.seller.toLowerCase().includes(query.toLowerCase())) &&
    (!status || o.status === status) &&
    (!payment || o.payment === payment)
  );
  const total = filtered.length;
  filtered = filtered.slice((page - 1) * limit, page * limit);
  return { orders: filtered, total };
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 8;

  // Role-based redirect: only 'admin' or 'owner' role allowed
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'owner')) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { orders, total } = await mockFetchOrders(search, statusFilter, paymentFilter, page, limit);
      setOrders(orders);
      setTotal(total);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [search, statusFilter, paymentFilter, page]);

  const handleRelease = (order) => {
    toast.success(`Payment for order ${order.id} released (mock)`);
    fetchOrders();
  };
  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      {/* Full-width header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Card */}
            <div className="flex items-center gap-4 bg-white/90 rounded-2xl shadow-lg p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div>
                <div className="text-xl font-bold text-blue-900">{user?.name || 'Admin'}</div>
                <div className="text-blue-500 font-medium">Administrator</div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/admin/dashboard" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>🏠</span> Admin Home
              </Link>
              <Link to="/admin/users" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>👥</span> Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - full width */}
      <div className="p-6">
        {/* Search & Filter Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Search by order ID, buyer, or seller..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full md:w-72 px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
              />
              <div className="flex gap-2">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300">
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300">
                  <option value="">All Payment</option>
                  <option value="Pending">Pending</option>
                  <option value="Held">Held</option>
                  <option value="Released">Released</option>
                </select>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Export feature coming soon!')}
              className="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2"
            >
              <span>📊</span> Export Data
            </motion.button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <span>📦</span> Order Management
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="h-20 bg-blue-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-blue-400 text-center py-8">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <AnimatePresence initial={false}>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {orders.map((o) => (
                      <motion.tr
                        key={o.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-blue-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-900">{o.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{o.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{o.seller}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.payment === 'Held' ? 'bg-yellow-100 text-yellow-700' : o.payment === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {o.payment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition-all duration-300"
                            onClick={() => handleView(o)}
                          >
                            View
                          </motion.button>
                          {o.payment === 'Held' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow transition-all duration-300"
                              onClick={() => handleRelease(o)}
                            >
                              Release
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-blue-400 text-sm">Page {page} of {Math.ceil(total / limit) || 1}</div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-bold disabled:opacity-50 transition-all duration-300"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-bold disabled:opacity-50 transition-all duration-300"
              >
                Next
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl transition-colors duration-300" onClick={() => setShowModal(false)}>&times;</button>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {selectedOrder.id[0].toUpperCase()}
              </div>
              <div className="text-xl font-bold text-blue-900">Order {selectedOrder.id}</div>
              <div className="text-blue-500 font-medium">Buyer: {selectedOrder.buyer}</div>
              <div className="text-blue-500 font-medium">Seller: {selectedOrder.seller}</div>
              <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedOrder.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOrder.payment === 'Held' ? 'bg-yellow-100 text-yellow-700' : selectedOrder.payment === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedOrder.payment}
                </span>
              </div>
              {selectedOrder.payment === 'Held' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 shadow-lg transition-all duration-300 mt-4"
                  onClick={() => { handleRelease(selectedOrder); setShowModal(false); }}
                >
                  Release Payment
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminOrders; 
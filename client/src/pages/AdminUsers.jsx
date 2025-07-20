import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';

// Mock API for demonstration
const mockFetchUsers = async (query = '', role = '', status = '', page = 1, limit = 8) => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  // Mock data
  const allUsers = [
    { id: 'USR001', name: 'Alice', email: 'alice@example.com', role: 'user', status: 'Active' },
    { id: 'USR002', name: 'Bob', email: 'bob@example.com', role: 'admin', status: 'Active' },
    { id: 'USR003', name: 'Charlie', email: 'charlie@example.com', role: 'user', status: 'Suspended' },
    { id: 'USR004', name: 'Diana', email: 'diana@example.com', role: 'user', status: 'Active' },
    { id: 'USR005', name: 'Eve', email: 'eve@example.com', role: 'user', status: 'Active' },
    { id: 'USR006', name: 'Frank', email: 'frank@example.com', role: 'user', status: 'Suspended' },
    { id: 'USR007', name: 'Grace', email: 'grace@example.com', role: 'user', status: 'Active' },
    { id: 'USR008', name: 'Henry', email: 'henry@example.com', role: 'user', status: 'Active' },
    { id: 'USR009', name: 'Ivy', email: 'ivy@example.com', role: 'user', status: 'Active' },
    { id: 'USR010', name: 'Jack', email: 'jack@example.com', role: 'user', status: 'Active' },
  ];
  let filtered = allUsers.filter(u =>
    (!query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())) &&
    (!role || u.role === role) &&
    (!status || u.status === status)
  );
  const total = filtered.length;
  filtered = filtered.slice((page - 1) * limit, page * limit);
  return { users: filtered, total };
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', role: 'user', status: 'Active' });
  const [addLoading, setAddLoading] = useState(false);
  const limit = 8;

  // Role-based redirect: only 'admin' or 'owner' role allowed
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'owner')) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.users);
      setTotal(res.users.length);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, roleFilter, statusFilter, page]);

  const handleBan = (user) => {
    toast.success(`${user.name} has been banned (mock)`);
    fetchUsers();
  };
  const handleReactivate = (user) => {
    toast.success(`${user.name} has been reactivated (mock)`);
    fetchUsers();
  };
  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    await new Promise(res => setTimeout(res, 800));
    toast.success(`${addForm.name} added (mock)`);
    setShowAddModal(false);
    setAddForm({ name: '', email: '', role: 'user', status: 'Active' });
    setAddLoading(false);
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateUserRole(userId, newRole);
      toast.success('Role updated');
      fetchUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      {/* Full-width header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 bg-white/90 rounded-2xl shadow-lg p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div>
                <div className="text-xl font-bold text-blue-900">{user?.name || 'Admin'}</div>
                <div className="text-blue-500 font-medium">Administrator</div>
              </div>
            </motion.div>
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex gap-4 flex-wrap justify-center">
              <Link to="/admin/dashboard" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>🏠</span> Admin Home
              </Link>
              <Link to="/admin/orders" className="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>📦</span> Manage Orders
              </Link>
            </motion.div>
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
                placeholder="Search by name or email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full md:w-72 px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
              />
              <div className="flex gap-2">
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300">
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2"
            >
              <span>➕</span> Add User
            </motion.button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <span>👥</span> User Management
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="h-20 bg-blue-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-blue-400 text-center py-8">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <AnimatePresence initial={false}>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {users.map((u) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-blue-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-900">{u.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition-all duration-300"
                            onClick={() => handleView(u)}
                          >
                            View
                          </motion.button>
                          {u.status === 'Active' ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow transition-all duration-300"
                              onClick={() => handleBan(u)}
                            >
                              Ban
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow transition-all duration-300"
                              onClick={() => handleReactivate(u)}
                            >
                              Reactivate
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

      {/* Floating Add User Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-10 right-10 z-50 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-5 rounded-full shadow-2xl text-3xl flex items-center justify-center hover:shadow-3xl focus:outline-none transition-all duration-300"
        onClick={() => setShowAddModal(true)}
        title="Add User"
      >
        +
      </motion.button>

      {/* User Modal */}
      {showModal && selectedUser && (
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
                {selectedUser.name[0].toUpperCase()}
              </div>
              <div className="text-xl font-bold text-blue-900">{selectedUser.name}</div>
              <div className="text-blue-500 font-medium">{selectedUser.email}</div>
              <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : selectedUser.role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedUser.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedUser.status}
                </span>
              </div>
              {/* Role change dropdown for admins */}
              {user?.role === 'admin' && (
                <div className="mt-4 w-full">
                  <label className="block text-sm font-medium text-blue-900 mb-2">Change Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={e => handleRoleChange(selectedUser.id, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl transition-colors duration-300" onClick={() => setShowAddModal(false)}>&times;</button>
            <h3 className="text-xl font-bold text-blue-900 mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Email</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  {user?.role === 'owner' && <option value="owner">Owner</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={addLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
              >
                {addLoading ? 'Adding...' : 'Add User'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsers; 
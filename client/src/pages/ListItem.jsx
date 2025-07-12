import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  title: '',
  description: '',
  brand: '',
  size: '',
  color: '',
  category: '',
  condition: '',
  points: '',
  images: [''],
};

const conditions = ['New', 'Like New', 'Good', 'Fair'];
const categories = [
  'Outerwear', 'Dresses', 'Shoes', 'Tops', 'Bottoms', 'Accessories', 'Other'
];

const ListItemForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fatalError, setFatalError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    console.log('ListItemPage mounted');
    return () => {
      console.log('ListItemPage unmounted');
    };
  }, []);

  useEffect(() => {
    if (fatalError) {
      console.error('Fatal error in ListItemPage:', fatalError);
    }
  }, [fatalError]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.size.trim()) errs.size = 'Size is required.';
    if (!form.category.trim()) errs.category = 'Category is required.';
    if (!form.condition.trim()) errs.condition = 'Condition is required.';
    if (!form.points || isNaN(form.points) || Number(form.points) <= 0) errs.points = 'Points must be a positive number.';
    if (!form.images[0] || !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(form.images[0])) errs.images = 'Valid image URL is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setForm(f => ({ ...f, images: [value] }));
      setImagePreview(value);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(e => ({ ...e, images: 'File must be an image.' }));
      return;
    }
    // Use imgbb API for demo (replace with your own key for production)
    const apiKey = '1e7e2e7e2e7e2e7e2e7e2e7e2e7e2e7e'; // Demo key, replace with your own
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      const url = res.data.data.url;
      setForm(f => ({ ...f, images: [url] }));
      setImagePreview(url);
      setErrors(e => ({ ...e, images: undefined }));
    } catch (err) {
      setErrors(e => ({ ...e, images: 'Image upload failed.' }));
    }
  };

  const handleImageInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await axios.post('/api/dashboard/items', {
        ...form,
        points: Number(form.points),
      });
      setSuccess(true);
      setForm(initialState);
      setImagePreview('');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to list item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 px-2 md:px-8">
      <div className="bg-slate-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-slide-up">
        {fatalError && (
          <div className="bg-red-700 text-white p-4 mb-4 rounded text-center animate-fade-in">
            {fatalError}
          </div>
        )}
        <h2 className="text-3xl font-bold text-white mb-6 text-center animate-fade-in">List an Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <input
              className={`w-full px-4 py-2 rounded bg-slate-900 text-white border ${errors.title ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Title*"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.title && <div className="text-red-400 text-xs animate-fade-in">{errors.title}</div>}
          </div>
          <div>
            <textarea
              className={`w-full px-4 py-2 rounded bg-slate-900 text-white border ${errors.description ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Description*"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.description && <div className="text-red-400 text-xs animate-fade-in">{errors.description}</div>}
          </div>
          <div className="flex gap-2">
            <input
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.brand ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              disabled={submitting}
            />
            <input
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.size ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Size*"
              name="size"
              value={form.size}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
          <div className="flex gap-2">
            <input
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.color ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Color"
              name="color"
              value={form.color}
              onChange={handleChange}
              disabled={submitting}
            />
            <input
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.category ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Category*"
              name="category"
              list="category-list"
              value={form.category}
              onChange={handleChange}
              disabled={submitting}
            />
            <datalist id="category-list">
              {categories.map(cat => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          <div className="flex gap-2">
            <select
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.condition ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              name="condition"
              value={form.condition}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="">Condition*</option>
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
            <input
              className={`w-1/2 px-4 py-2 rounded bg-slate-900 text-white border ${errors.points ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
              placeholder="Points*"
              name="points"
              type="number"
              min="1"
              value={form.points}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
          {/* Drag and Drop Image Upload */}
          <div
            className={`w-full px-4 py-6 rounded border-2 border-dashed transition-all bg-slate-900 text-white flex flex-col items-center justify-center relative ${dragActive ? 'border-blue-400 bg-blue-900/30' : errors.images ? 'border-red-500' : 'border-blue-700'}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageInput}
              disabled={submitting}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow mb-2 animate-fade-in" />
            ) : (
              <>
                <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="text-blue-300">Drag & drop or click to upload image</span>
              </>
            )}
            <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP, GIF. Max 5MB.</span>
          </div>
          <input
            className={`w-full px-4 py-2 rounded bg-slate-900 text-white border ${errors.images ? 'border-red-500' : 'border-blue-700'} focus:ring-2 focus:ring-blue-500 mb-1 transition-all`}
            placeholder="Or paste image URL*"
            name="images"
            value={form.images[0]}
            onChange={handleChange}
            disabled={submitting}
          />
          {errors.images && <div className="text-red-400 text-xs animate-fade-in">{errors.images}</div>}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <span className="flex items-center justify-center"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>Submitting...</span>
            ) : (
              'Submit'
            )}
          </button>
          {apiError && <div className="text-red-400 text-center mt-2 animate-fade-in">{apiError}</div>}
          {success && <div className="text-green-400 text-center mt-2 animate-fade-in">Item listed successfully! Pending approval.</div>}
      </form>
    </div>
  </div>
);
};

export default ListItemForm; 
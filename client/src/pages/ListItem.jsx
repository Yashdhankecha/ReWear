import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineUpload, HiOutlineTag, HiOutlinePhotograph, HiOutlineCurrencyRupee, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineInformationCircle, HiOutlineTrash } from 'react-icons/hi';

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

const categories = [
  'Outerwear', 'Dresses', 'Shoes', 'Tops', 'Bottoms', 'Accessories', 'Bags', 'Jewelry', 'Activewear', 'Swimwear', 'Suits', 'Sleepwear', 'Denim', 'Sweaters', 'Hats', 'Scarves', 'Socks', 'Underwear', 'Blazers', 'Coats'
];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size', 'Free Size'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

// Tooltip component
const Tooltip = ({ text }) => (
  <span className="relative group cursor-pointer">
    <HiOutlineInformationCircle className="inline ml-1 text-blue-400" />
    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-slate-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
      {text}
    </span>
  </span>
);

const ListItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fatalError, setFatalError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (id) {
      axios.get(`/api/dashboard/items/${id}`)
        .then(res => {
          const item = res.data.data;
          setForm({
            title: item.title || '',
            description: item.description || '',
            brand: item.brand || '',
            size: item.size || '',
            color: item.color || '',
            category: item.category || '',
            condition: item.condition || '',
            points: item.price ? String(item.price) : '',
            images: item.images && item.images.length > 0 ? [item.images[0]] : [''],
          });
          setImagePreview(item.images && item.images[0] ? item.images[0] : '');
        })
        .catch(() => setFatalError('Failed to load item for editing.'));
    } else {
      setForm(initialState);
      setImagePreview('');
    }
  }, [id]);

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

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(e => ({ ...e, images: 'File must be an image.' }));
      return;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      if (id) {
        await axios.put(`/api/dashboard/items/${id}`, {
          ...form,
          price: Number(form.points),
        });
        toast.success('Item updated successfully!');
        navigate('/profile');
      } else {
        await axios.post('/api/dashboard/items', {
          ...form,
          points: Number(form.points),
        });
        toast.success('Item listed successfully!');
        setForm(initialState);
        setImagePreview('');
        navigate('/profile');
      }
    } catch (err) {
      setErrors(e => ({ ...e, api: err.response?.data?.error || 'Failed to list/update item.' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-0 px-0 bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-slate-200/60 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 rounded-none shadow-2xl p-0 border-0 animate-fade-in-up w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto p-10">
          <div className="mb-10 text-center">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 tracking-tight drop-shadow-lg animate-fade-in-up">{id ? 'Edit Item' : 'List an Item'}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium animate-fade-in-up delay-100">Share your fashion with the community. Fill in the details below to list your item.</p>
            <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1">* indicates required fields <Tooltip text="Fields marked with * are required" /></p>
          </div>
          {fatalError && (
            <div className="bg-red-700 text-white p-4 mb-4 rounded text-center animate-fade-in">
              {fatalError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-10" autoComplete="off">
            {/* Section: Item Details */}
            <div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><HiOutlineClipboardList /> Item Details</h3>
              <hr className="mb-6 border-blue-200 dark:border-blue-900" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="mb-4 relative">
                  <label htmlFor="title" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.title ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Title* <HiOutlineTag className="inline ml-1 text-blue-400" /></label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.title ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-transparent`}
                    placeholder="Title*"
                    value={form.title}
                    onChange={handleChange}
                    disabled={submitting}
                    autoComplete="off"
                  />
                  {errors.title && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.title}</div>}
                </div>
                {/* Category */}
                <div className="mb-4 relative">
                  <label htmlFor="category" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.category ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Category* <HiOutlineClipboardList className="inline ml-1 text-blue-400" /></label>
                  <select
                    name="category"
                    id="category"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.category ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.category && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.category}</div>}
                </div>
                {/* Description */}
                <div className="md:col-span-2 mb-4 relative">
                  <label htmlFor="description" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.description ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Description* <HiOutlineClipboardList className="inline ml-1 text-blue-400" /></label>
                  <textarea
                    name="description"
                    id="description"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.description ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-transparent`}
                    placeholder="Description*"
                    value={form.description}
                    onChange={handleChange}
                    disabled={submitting}
                    rows={3}
                  />
                  {errors.description && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.description}</div>}
                </div>
                {/* Brand */}
                <div className="mb-4 relative">
                  <label htmlFor="brand" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.brand ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    className="w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-transparent"
                    placeholder="Brand"
                    value={form.brand}
                    onChange={handleChange}
                    disabled={submitting}
                    autoComplete="off"
                  />
                </div>
                {/* Size */}
                <div className="mb-4 relative">
                  <label htmlFor="size" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.size ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Size* <HiOutlineClipboardList className="inline ml-1 text-blue-400" /></label>
                  <select
                    name="size"
                    id="size"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.size ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    value={form.size}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select size</option>
                    {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                  {errors.size && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.size}</div>}
                </div>
                {/* Color */}
                <div className="mb-4 relative">
                  <label htmlFor="color" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.color ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Color</label>
                  <input
                    type="text"
                    name="color"
                    id="color"
                    className="w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-transparent"
                    placeholder="Color"
                    value={form.color}
                    onChange={handleChange}
                    disabled={submitting}
                    autoComplete="off"
                  />
                </div>
                {/* Condition */}
                <div className="mb-4 relative">
                  <label htmlFor="condition" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.condition ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Condition* <HiOutlineClipboardList className="inline ml-1 text-blue-400" /></label>
                  <select
                    name="condition"
                    id="condition"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.condition ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    value={form.condition}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                  </select>
                  {errors.condition && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.condition}</div>}
                </div>
                {/* Points */}
                <div className="mb-4 relative">
                  <label htmlFor="points" className={`absolute left-4 top-2 text-slate-500 dark:text-slate-400 text-sm pointer-events-none transition-all duration-200 ${form.points ? '-translate-y-6 scale-90 bg-white dark:bg-slate-900 px-1' : 'translate-y-0 scale-100'}`}>Points* <HiOutlineCurrencyRupee className="inline ml-1 text-blue-400" /></label>
                  <input
                    type="number"
                    name="points"
                    id="points"
                    className={`w-full px-4 pt-7 pb-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border-2 ${errors.points ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-transparent`}
                    placeholder="Points*"
                    value={form.points}
                    onChange={handleChange}
                    disabled={submitting}
                    min="1"
                  />
                  {errors.points && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.points}</div>}
                </div>
              </div>
            </div>
            {/* Section: Image Upload */}
            <div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><HiOutlinePhotograph /> Image Upload</h3>
              <hr className="mb-6 border-blue-200 dark:border-blue-900" />
              <div className="mt-2">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-2 flex items-center gap-1"><HiOutlinePhotograph />Image* <Tooltip text="Upload a clear image of your item. Paste a URL or upload a file." /></label>
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300 cursor-pointer bg-white/60 dark:bg-slate-800/60 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 ${dragActive ? 'border-blue-400 bg-blue-100/60 dark:bg-blue-900/40' : errors.images ? 'border-red-500' : 'border-blue-300'}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload image"
                >
                  <HiOutlineUpload className="text-4xl text-blue-400 mb-2 animate-bounce" />
                  <span className="text-blue-500 font-medium mb-1">Drag & drop or click to upload</span>
                  <span className="text-xs text-slate-400 mb-2">JPG, PNG, WEBP, GIF. Max 5MB.</span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageInput}
                    className="hidden"
                  />
                  <input
                    type="text"
                    name="images"
                    placeholder="Paste image URL"
                    className={`w-full mt-2 px-4 py-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border ${errors.images ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-200 transition-all`}
                    value={form.images[0]}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.images && <div className="text-red-400 text-xs animate-fade-in mt-1">{errors.images}</div>}
                  {imagePreview && (
                    <div className="mt-4 flex flex-col items-center w-full">
                      <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-2xl border-2 border-blue-400 shadow-lg transition-all duration-300 hover:scale-105" />
                      <button
                        type="button"
                        className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded transition-all bg-red-100/60 dark:bg-red-900/30 hover:bg-red-200/80 dark:hover:bg-red-900/60"
                        onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, images: [''] })); setImagePreview(''); }}
                      >
                        <HiOutlineTrash className="inline" /> Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* API Error */}
            {errors.api && <div className="bg-red-600 text-white p-3 rounded-lg text-center animate-fade-in mt-4">{errors.api}</div>}
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 text-xl flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-gradient-x"
                disabled={submitting}
              >
                <HiOutlineCheckCircle className="text-3xl" />
                {id ? 'Update Item' : 'List Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListItem; 
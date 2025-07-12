import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [buyMessage, setBuyMessage] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const response = await axios.get(`/api/dashboard/items/${id}`);
        console.log('Product response:', response.data);
        setProduct(response.data.data);
      } catch (err) {
        console.error('Error fetching product:', err.response || err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBuyModal(true);
  };

  const handleSell = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowSellModal(true);
  };

  const confirmBuy = async () => {
    try {
      const response = await axios.post(`/api/dashboard/items/${id}/buy`, {
        message: buyMessage
      });
      setShowBuyModal(false);
      setSuccessMessage('Purchase request sent to seller!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process purchase');
    }
  };

  const confirmSell = async () => {
    try {
      if (!offerAmount || offerAmount <= 0) {
        setError('Please enter a valid offer amount');
        return;
      }
      
      const response = await axios.post(`/api/dashboard/items/${id}/offer`, {
        offerAmount: parseInt(offerAmount),
        message: offerMessage
      });
      setShowSellModal(false);
      setSuccessMessage('Offer sent to seller!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process offer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Product Not Found</h3>
          <p className="text-slate-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative">
                <div
                  className={`relative overflow-hidden rounded-2xl bg-slate-800 ${
                    isImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <img
                    src={product.images[selectedImage] || 'https://via.placeholder.com/600x600?text=No+Image'}
                    alt={product.title}
                    className={`w-full h-96 lg:h-[500px] object-cover transition-all duration-300 ${
                      isImageZoomed ? 'scale-150' : 'hover:scale-105'
                    }`}
                  />
                  {isImageZoomed && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                        Click to zoom out
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-500 scale-110'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              {/* Title and Status */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{product.title}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    {product.status === 'approved' ? 'Available' : product.status}
                  </span>
                  <span className="text-slate-400">Listed by {product.user?.name || 'Anonymous'}</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <div className="text-3xl font-bold text-blue-400 mb-2">{product.points} points</div>
                <div className="text-slate-400">Estimated value</div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                <p className="text-slate-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">BRAND</h4>
                  <p className="text-white">{product.brand || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">SIZE</h4>
                  <p className="text-white">{product.size}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">COLOR</h4>
                  <p className="text-white">{product.color || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">CONDITION</h4>
                  <p className="text-white">{product.condition}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">CATEGORY</h4>
                  <p className="text-white">{product.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">LISTED</h4>
                  <p className="text-white">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleBuy}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleSell}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h3>
              <p className="text-slate-300 mb-4">
                Are you sure you want to buy "{product.title}" for {product.points} points?
              </p>
              <textarea
                placeholder="Add a message to the seller (optional)"
                value={buyMessage}
                onChange={(e) => setBuyMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
                rows="3"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBuy}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Confirm Buy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Make an Offer</h3>
              <p className="text-slate-300 mb-4">
                Enter your offer for "{product.title}" (current price: {product.points} points)
              </p>
              <input
                type="number"
                placeholder="Your offer in points"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <textarea
                placeholder="Add a message to the seller (optional)"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
                rows="3"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSell}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addItem } from '../cart/actions';
import Price from '../common/price';

interface ProductDescriptionProps {
  product: Product;
}

// Common clothing sizes
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }

    setIsAddingToCart(true);
    setShowSuccess(false);
    setErrorMessage(''); // Reset error message
    try {
      const result = await addItem(null, {
        productId: product.id,
        quantity,
        size: selectedSize
      });
      
      if (result && result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Dispatch custom event
      } else {
        setErrorMessage(result?.error || 'Failed to add item to cart.'); // Set error message
        console.error('Error adding to cart:', result?.error || 'Unknown error');
      }
    } catch (e: any) {
      setErrorMessage('Failed to add item to cart: ' + e.message); // Set error message
      console.error('Failed to add to cart:', e);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="bg-black text-white p-8 rounded-lg shadow-2xl border border-gray-800">
      {/* Title & Description */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-3">{product.title}</h1>
        <p className="text-gray-300 text-lg">{product.description}</p>
      </div>

      {/* Price & Category */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Price amount={(product.price || 0).toString()} currencyCode="INR" className="text-2xl font-bold text-[#daa520]" />
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
        <div className="grid grid-cols-6 gap-2">
          {CLOTHING_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm items-center flex justify-center
                ${selectedSize === size
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-gray-600 text-gray-300 hover:border-[#daa520] hover:text-[#daa520]'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
        {showSizeError && (
          <p className="text-red-500 text-sm mt-2">Please select a size.</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center font-bold text-lg"
          >
            -
          </button>
          <span className="text-xl font-semibold text-white min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total:</span>
          <Price amount={totalPrice.toString()} currencyCode="INR" className="text-2xl font-bold text-[#daa520]" />
        </div>
      </div>

      {/* Add to Cart & WhatsApp Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedSize}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
            ${isAddingToCart || !selectedSize
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#daa520] text-black hover:bg-[#b38a1d]'
            }
          `}
        >
          {isAddingToCart ? 'Adding...' : (isAuthenticated() ? 'Add to Cart' : 'Login to Add to Cart')}
        </button>
        {showSuccess && (
          <p className="text-green-500 text-center text-sm font-semibold">✅ Item added to cart successfully!</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center text-sm font-semibold">❌ {errorMessage}</p>
        )}
        <a
          href={`https://wa.me/917991812899?text=I'm interested in the product: ${product.title} (Size: ${selectedSize}, Quantity: ${quantity}). Product ID: ${product.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"></path>
          </svg>
          Contact Us on WhatsApp
        </a>
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated() && (
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-sm text-center">
            Please{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-[#daa520] hover:text-[#b38a1d] font-semibold underline"
            >
              login
            </button>{' '}
            or{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-[#daa520] hover:text-[#b38a1d] font-semibold underline"
            >
              sign up
            </button>{' '}
            to add items to your cart
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { getCart, placeOrder } from '@/lib/supabase/api';
import { Cart, ShippingAddress } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Force dynamic rendering to avoid localStorage issues
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'upi'>('cash_on_delivery');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionId = getSessionId();
      if (sessionId) {
        const cartData = await getCart(sessionId);
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const getSessionId = () => {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('sessionId='));
    if (sessionCookie) {
      return sessionCookie.split('=')[1];
    }
    return null;
  };

  const handleAddressSubmit = () => {
    if (validateAddress()) {
      setCurrentStep('payment');
    }
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'upi') {
      if (!paymentConfirmed) {
        alert('Please confirm that you have completed the UPI payment');
        return;
      }
    }

    setIsLoading(true);
    try {
      const sessionId = getSessionId();
      if (!sessionId || !cart) {
        throw new Error('Cart or session not found');
      }

      const orderData = {
        sessionId,
        items: cart.lines.map(item => ({
          product: item.merchandise.product,
          quantity: item.quantity,
          size: 'M', // Default size since CartLine doesn't have size
          totalPrice: parseFloat(item.cost.totalAmount.amount)
        })),
        shippingAddress,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? 'danish-icici@ybl' : undefined
      };

      const order = await placeOrder(orderData);
      if (order) {
        setCurrentStep('confirmation');
        // Clear cart after successful order
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions for safe cart data access
  const getCartItems = () => {
    if (!cart?.lines || !Array.isArray(cart.lines)) return [];
    return cart.lines.filter(item => 
      item && 
      item.merchandise && 
      item.merchandise.product && 
      item.cost && 
      item.cost.totalAmount
    );
  };

  const getCartTotal = () => {
    if (!cart?.cost?.totalAmount?.amount) return 0;
    return parseFloat(cart.cost.totalAmount.amount);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#daa520] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading your cart...</h1>
        </div>
      </div>
    );
  }

  // Comprehensive cart validation
  const isCartValid = cart && 
                     getCartItems().length > 0 &&
                     getCartTotal() > 0;

  // Empty cart state
  if (!isCartValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-4">Add some items to your cart to proceed with checkout</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#daa520] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b38a1d]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#daa520]">Checkout</h1>
          <div className="flex justify-center mt-4 space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'address' ? 'bg-[#daa520] text-black' : 'bg-gray-600'
            }`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'payment' ? 'bg-[#daa520] text-black' : 'bg-gray-600'
            }`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'confirmation' ? 'bg-[#daa520] text-black' : 'bg-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Shipping Address */}
        {currentStep === 'address' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code *</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleAddressSubmit}
                className="w-full bg-[#daa520] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#b38a1d] transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 'payment' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash_on_delivery' | 'upi')}
                  className="text-[#daa520] focus:ring-[#daa520]"
                />
                <label htmlFor="cod" className="text-lg">Cash on Delivery</label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash_on_delivery' | 'upi')}
                  className="text-[#daa520] focus:ring-[#daa520]"
                />
                <label htmlFor="upi" className="text-lg">UPI Payment</label>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">UPI ID</label>
                <input
                  type="text"
                  value="danish-icici@ybl"
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">This is our registered UPI ID for payments</p>
                
                {/* UPI QR Code Section */}
                <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#daa520] mb-3 text-center">Scan QR Code to Pay</h4>
                  <div className="flex flex-col items-center space-y-4">
                    {/* QR Code Placeholder - You can replace this with actual QR code generation */}
                    <div className="w-48 h-48 bg-white p-4 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-800">
                        <div className="text-4xl mb-2">📱</div>
                        <div className="text-sm font-mono">danish-icici@ybl</div>
                        <div className="text-xs mt-1">Scan with any UPI app</div>
                      </div>
                    </div>
                    
                    {/* UPI ID Display */}
                    <div className="text-center">
                      <p className="text-gray-300 text-sm mb-2">UPI ID:</p>
                      <p className="text-[#daa520] font-mono font-semibold text-lg">danish-icici@ybl</p>
                    </div>
                    
                    {/* Payment Instructions */}
                    <div className="text-center text-gray-400 text-sm">
                      <p>• Open any UPI app (PhonePe, Google Pay, Paytm)</p>
                      <p>• Scan the QR code or enter UPI ID manually</p>
                      <p>• Pay ₹{cart ? parseFloat(cart.cost.totalAmount.amount) : 0}</p>
                      <p>• Complete the payment to proceed</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Confirmation Checkbox */}
                <div className="mt-4 flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="paymentConfirmed"
                    checked={paymentConfirmed}
                    onChange={(e) => setPaymentConfirmed(e.target.checked)}
                    className="w-4 h-4 text-[#daa520] bg-gray-800 border-gray-700 rounded focus:ring-[#daa520] focus:ring-2"
                  />
                  <label htmlFor="paymentConfirmed" className="text-sm text-gray-300">
                    I confirm that I have completed the UPI payment of ₹{cart ? parseFloat(cart.cost.totalAmount.amount) : 0}
                  </label>
                </div>
              </div>
            )}

            {/* Order Summary */}
            {cart && cart.lines && cart.lines.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cart.lines.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.merchandise.product.title} x {item.quantity}</span>
                      <span>₹{parseFloat(item.cost.totalAmount.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-[#daa520]">₹{parseFloat(cart.cost.totalAmount.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep('address')}
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#daa520] text-black hover:bg-[#b38a1d]'
                }`}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-[#daa520]">Order Placed Successfully!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your order. We&apos;ll process it and ship it to your address soon.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-[#daa520] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#b38a1d] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

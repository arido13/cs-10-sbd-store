'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

type CartView = 'items' | 'checkout';

export default function CartPopup() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CartView>('items');

  const totalPrice = getTotalPrice();
  const itemCount = items.length;

  const handleCheckout = () => {
    setView('checkout');
  };

  const handleBackToCart = () => {
    setView('items');
  };

  const handleCloseCart = () => {
    setIsOpen(false);
    setView('items');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2 transition"
      >
        <span className="text-2xl">🛒</span>
        {itemCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 max-h-96 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              {view === 'items' ? 'Shopping Cart' : 'Checkout'}
            </h2>
            <button
              onClick={handleCloseCart}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {view === 'items' ? (
              <>
                {items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-4xl mb-2">🛍️</p>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 border-b pb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-amber-100 rounded hover:bg-amber-200 text-amber-700 font-bold text-xs"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-amber-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-amber-100 rounded hover:bg-amber-200 text-amber-700 font-bold text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Development Notice</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Web masih dalam tahap pengembangan. Opsi pembayaran belum tersedia.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
            {view === 'items' ? (
              <>
                {items.length > 0 && (
                  <>
                    <div className="mb-3 flex justify-between font-bold text-lg">
                      <span className="text-amber-700">Total:</span>
                      <span className="text-amber-700">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Checkout
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={handleBackToCart}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Back to Cart
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, Item } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartPopup from '@/components/CartPopup';

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchItems = async () => {
      try {
        const response = await api.getAllItems();
        if (response.success && response.payload) {
          setItems(response.payload);
        } else {
          setError(response.message || 'Failed to fetch items');
        }
      } catch (err) {
        setError('An error occurred while fetching items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [token, authLoading, router]);

  const handleAddToCart = (item: Item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: `/products/item-${item.id}.jpg`,
    });
  };

  return (
    <>
      <Navbar />
      <CartPopup />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Products</h1>
          <p className="text-gray-600 mb-8">Browse our collection of items</p>

          {authLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          )}

          {!authLoading && (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-lg text-gray-600">Loading products...</div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">No products available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                    >
                      <div className="w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                        <img
                          src={`/products/item-${item.id}.jpg`}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-teal-600">
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Stock: <span className="font-semibold">{item.stock}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
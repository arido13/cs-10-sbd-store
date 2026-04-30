'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { token, user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-amber-600">SBD Store</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              beli di sini woy
            </p>

            {token && user ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  Hello, <span className="font-semibold">{user.name}</span>! 👋
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">Get started by logging in or creating an account</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/login"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Secure</h3>
              <p className="font-semibold text-gray-500">Your data is protected with industry-standard security</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Fast</h3>
              <p className="font-semibold text-gray-500">Quick and smooth shopping experience</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">😊</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Easy</h3>
              <p className="font-semibold text-gray-500">Simple and intuitive user interface</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

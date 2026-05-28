/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import Shops from './pages/Shops';
import Products from './pages/Products';
import Orders from './pages/Orders';
import LiveTracking from './pages/LiveTracking';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import DriverJobBoard from './pages/DriverJobBoard';
import BookingRequest from './pages/BookingRequest';
import Careers from './pages/Careers';
import WorkWithUs from './pages/WorkWithUs';
import ShopRegistration from './pages/ShopRegistration';
import Onboarding from './pages/Onboarding';
import MaterialsMarketplace from './pages/MaterialsMarketplace';
import SiteLogistics from './pages/SiteLogistics';
import Consultancy from './pages/Consultancy';
import HireMachinery from './pages/HireMachinery';
import OurStory from './pages/OurStory';
import HelpCenter from './pages/HelpCenter';
import Safety from './pages/Safety';
import Contact from './pages/Contact';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        setFetchingUser(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Auto-verify legacy or existing demo accounts
            if (user.isAnonymous && (data.verificationStatus !== 'verified' || !data.verified || !data.onboardingComplete)) {
              const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
              await updateDoc(doc(db, 'users', user.uid), {
                verified: true,
                verificationStatus: 'verified',
                onboardingComplete: true,
                updatedAt: serverTimestamp()
              });
              setUserData({ ...data, verified: true, verificationStatus: 'verified', onboardingComplete: true });
            }
          }
        } catch (err) {
          console.error("App Auth Fetch Error:", err);
        }
        setFetchingUser(false);
      } else {
        setUserData(null);
      }
    }
    fetchUserData();
  }, [user]);

  if (loading || (user && fetchingUser && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-yellow">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow border-t-transparent"></div>
      </div>
    );
  }

  // Common redirect logic for onboarding
  const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    if (!userData?.onboardingComplete && user) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Layout user={user}>{children}</Layout>;
  };

  const router = (
    <Router>
      <Routes>
        {/* Marketplace & Informational Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/materials-marketplace" element={<MaterialsMarketplace />} />
        <Route path="/site-logistics" element={<SiteLogistics />} />
        <Route path="/consultancy" element={<Consultancy />} />
        <Route path="/hire-machinery" element={<HireMachinery />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookingRequest />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/work-with-us" element={<WorkWithUs />} />
        <Route path="/shop-registration" element={<ShopRegistration />} />
        
        {/* Auth */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        {/* Unified Dashboard Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin Dashboard Routes (Legacy/Specific) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/jobs" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <DriverJobBoard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/shops" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Shops />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <LiveTracking />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Chat />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          </ProtectedRoute>
        } />


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );

  return hasValidKey ? (
    <APIProvider apiKey={API_KEY} version="weekly">
      {router}
    </APIProvider>
  ) : router;
}

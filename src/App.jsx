
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Movies from '@/pages/Movies';
import Series from '@/pages/Series';
import Anime from '@/pages/Anime';
import Watch from '@/pages/Watch';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Search from '@/pages/Search';
import EmailConfirmation from '@/pages/EmailConfirmation';
import ForgotPassword from '@/pages/ForgotPassword';
import UpdatePassword from '@/pages/UpdatePassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Helmet>
              <title>CarsaiPlay - Sua Plataforma de Streaming Favorita</title>
              <meta name="description" content="Assista aos melhores filmes, séries e animes em alta qualidade. Plataforma de streaming completa com conteúdo exclusivo." />
            </Helmet>
            
            <Navbar />
            
            <main className="pt-16 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/watch/:slug" element={<Watch />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/search" element={<Search />} />
                <Route path="/confirm-email" element={<EmailConfirmation />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
              </Routes>
            </main>
            
            <Footer />
            <Toaster />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Confirme seu E-mail - CarsaiPlay</title>
        <meta name="description" content="Confirmação de e-mail para ativar sua conta no CarsaiPlay." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="glass-effect rounded-xl p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-6"
          >
            <MailCheck className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white">Quase lá! Confirme seu e-mail</h2>
          <p className="mt-4 text-gray-300">
            Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, verifique sua caixa de entrada (e a pasta de spam) para ativar sua conta.
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            Depois de confirmar, você poderá fazer login.
          </p>
          
          <div className="mt-8">
            <Link to="/login">
              <button className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                Ir para a página de Login
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailConfirmation;
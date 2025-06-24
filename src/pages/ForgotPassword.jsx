import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Play, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordResetEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail de recuperação. Verifique o e-mail digitado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Recuperar Senha - CarsaiPlay</title>
        <meta name="description" content="Recupere sua senha do CarsaiPlay." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">CarsaiPlay</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Esqueceu sua senha?</h2>
          <p className="mt-2 text-gray-400">
            Sem problemas. Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {submitted ? (
          <div className="glass-effect rounded-xl p-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-xl font-bold text-white">Verifique seu e-mail</h3>
            <p className="mt-2 text-gray-300">
              Se uma conta com este e-mail existir, você receberá um link para redefinir sua senha.
            </p>
            <Link to="/login" className="mt-6 inline-block">
              <Button>Voltar para o Login</Button>
            </Link>
          </div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="seu@email.com"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
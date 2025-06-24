import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/10 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CarsaiPlay</span>
          </div>

          <div className="flex items-center space-x-6 text-gray-400">
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CarsaiPlay. Todos os direitos reservados.</p>
          <p className="mt-2">
            CarsaiPlay é uma plataforma de exibição de links de vídeos encontrados na web. Não hospedamos nenhum conteúdo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
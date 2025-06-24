import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = ({ featuredContent }) => {
  if (!featuredContent) return null;

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img  alt={`Backdrop de ${featuredContent.title}`} className="w-full h-full object-cover" src={featuredContent.backdrop} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full font-medium">
                  {featuredContent.type === 'movie' ? 'Filme' : featuredContent.type === 'series' ? 'Série' : 'Anime'}
                </span>
                <span className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-full font-medium">
                  Destaque
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {featuredContent.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{featuredContent.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300">{featuredContent.views} visualizações</span>
                </div>
                <span className="text-gray-300">{featuredContent.year}</span>
                <span className="px-2 py-1 border border-gray-500 text-gray-300 text-sm rounded">
                  {featuredContent.category}
                </span>
              </div>

              <p className="text-lg text-gray-200 mb-8 max-w-xl leading-relaxed line-clamp-3">
                {featuredContent.synopsis}
              </p>

              <div className="flex items-center space-x-4">
                <Link to={`/watch/${featuredContent.id}`}>
                  <Button size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Assistir Agora
                  </Button>
                </Link>
                
                <Link to={`/watch/${featuredContent.id}`}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Info className="w-5 h-5 mr-2" />
                    Mais Informações
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import ContentGrid from '@/components/ContentGrid';

const Series = () => {
  const { content, categories, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const series = content.filter(item => item.type === 'series');

  const filteredSeries = series
    .filter(serie => selectedCategory === 'all' || serie.category_ids?.includes(parseInt(selectedCategory)))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return new Date(b.release_date).getFullYear() - new Date(a.release_date).getFullYear();
        default:
          return new Date(b.release_date) - new Date(a.release_date);
      }
    });

  return (
    <div className="min-h-screen pt-8">
      <Helmet>
        <title>Séries - CarsaiPlay</title>
        <meta name="description" content="Descubra as melhores séries de TV em alta qualidade. Maratone seus shows favoritos." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-6">📺 Séries</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Filtros:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-gray-900">
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent" className="bg-gray-900">Mais Recentes</option>
              <option value="rating" className="bg-gray-900">Melhor Avaliados</option>
              <option value="views" className="bg-gray-900">Mais Assistidos</option>
              <option value="title" className="bg-gray-900">A-Z</option>
              <option value="year" className="bg-gray-900">Ano</option>
            </select>
          </div>

          <p className="text-gray-400 mb-6">
            {filteredSeries.length} série{filteredSeries.length !== 1 ? 's' : ''} encontrada{filteredSeries.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-white">Carregando séries...</div>
        ) : (
          <ContentGrid
            content={filteredSeries}
            title=""
            className="py-0"
          />
        )}
      </div>
    </div>
  );
};

export default Series;

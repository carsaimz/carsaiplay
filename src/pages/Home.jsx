import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import Hero from '@/components/Hero';
import ContentGrid from '@/components/ContentGrid';

const Home = () => {
  const { content } = useData();

  const featuredContent = content.find(item => item.featured);
  const recentMovies = content.filter(item => item.type === 'movie').slice(0, 6);
  const recentSeries = content.filter(item => item.type === 'series').slice(0, 6);
  const recentAnime = content.filter(item => item.type === 'anime').slice(0, 6);
  const trending = content.sort((a, b) => b.views - a.views).slice(0, 6);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>CarsaiPlay - Início</title>
        <meta name="description" content="Descubra os melhores filmes, séries e animes em alta qualidade. Sua plataforma de streaming favorita." />
      </Helmet>

      {/* Hero Section */}
      {featuredContent && <Hero featuredContent={featuredContent} />}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12"
        >
          {trending.length > 0 && (
            <ContentGrid
              content={trending}
              title="🔥 Em Alta"
            />
          )}

          {recentMovies.length > 0 && (
            <ContentGrid
              content={recentMovies}
              title="🎬 Filmes Recentes"
            />
          )}

          {recentSeries.length > 0 && (
            <ContentGrid
              content={recentSeries}
              title="📺 Séries Populares"
            />
          )}

          {recentAnime.length > 0 && (
            <ContentGrid
              content={recentAnime}
              title="🎌 Animes em Destaque"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
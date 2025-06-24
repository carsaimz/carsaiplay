import React from 'react';
import { motion } from 'framer-motion';
import ContentCard from '@/components/ContentCard';

const ContentGrid = ({ content, title, className = '' }) => {
  if (!content || content.length === 0) {
    return (
      <div className={`py-8 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum conteúdo encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className}`}>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        {title}
      </motion.h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map((item, index) => (
          <ContentCard key={item.id} content={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ContentGrid;
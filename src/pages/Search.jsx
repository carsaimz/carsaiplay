import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import ContentGrid from '@/components/ContentGrid';
import { toast } from '@/components/ui/use-toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const { searchContent } = useData();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const searchResults = await searchContent(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Error performing search:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, searchContent]);

  return (
    <div className="min-h-screen pt-8">
      <Helmet>
        <title>Resultados para "{query}" - CarsaiPlay</title>
        <meta name="description" content={`Resultados da busca por "${query}" no CarsaiPlay.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {loading ? (
            <h1 className="text-3xl font-bold text-white">Buscando por "{query}"...</h1>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">Resultados para "{query}"</h1>
              <p className="text-gray-400 mt-2">{results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}.</p>
            </>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-white">Carregando...</div>
        ) : (
          <ContentGrid
            content={results}
            title=""
            className="py-0"
          />
        )}
      </div>
    </div>
  );
};

export default Search;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Eye, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ContentCard = ({ content, index = 0 }) => {
  const { profile, updateUserProfile } = useAuth();

  const handleListUpdate = (e, listName) => {
    e.preventDefault();
    if (!profile) {
      toast({
        title: "Login necessário",
        description: `Faça login para usar suas listas!`
      });
      return;
    }

    const currentList = profile[listName] || [];
    const contentId = content.id;
    const isInList = currentList.includes(contentId);
    const newList = isInList ? currentList.filter(id => id !== contentId) : [...currentList, contentId];

    updateUserProfile({ [listName]: newList })
      .then(() => {
        toast({
          title: "Lista atualizada!",
          description: `${content.title} foi ${isInList ? 'removido da' : 'adicionado à'} sua lista.`
        });
      })
      .catch(error => {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar sua lista."
        });
        console.error(error);
      });
  };

  const isFavorited = profile?.favorites?.includes(content.id);
  const isInWatchLater = profile?.watch_later?.includes(content.id);
  const isWatched = profile?.watched?.includes(content.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/watch/${content.slug}`}>
        <div className="relative overflow-hidden rounded-xl bg-gray-900 card-hover">
          <div className="aspect-[2/3] overflow-hidden">
            <img  alt={`Poster de ${content.title}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src="https://images.unsplash.com/photo-1692263428780-14888a39b7ee" />
            {isWatched && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Eye className="w-12 h-12 text-green-400" />
              </div>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
              {content.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
              <div className="flex items-center space-x-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /><span>{content.rating}</span></div>
              <span>•</span>
              <span>{new Date(content.release_date).getFullYear()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => handleListUpdate(e, 'favorites')}
                className={`p-1 h-8 w-8 shrink-0 ${isFavorited ? 'text-red-500 hover:text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => handleListUpdate(e, 'watch_later')}
                className={`p-1 h-8 w-8 shrink-0 ${isInWatchLater ? 'text-blue-500 hover:text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button size="sm" className="h-8 flex-grow">
                <Play className="w-3 h-3 mr-1" />
                Assistir
              </Button>
            </div>
          </div>

          <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
            {content.type === 'movie' ? 'Filme' : content.type === 'series' ? 'Série' : 'Anime'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ContentCard;
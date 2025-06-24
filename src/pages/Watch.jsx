import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Star, Eye, Heart, Clock, ArrowLeft, Send, CheckCircle, Tv, Film, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ContentGrid from '@/components/ContentGrid';
import AdblockPlayer from '@/components/player/AdblockPlayer';
import SeasonsEpisodesList from '@/components/player/SeasonsEpisodesList';
import Comment from '@/components/Comment';
import ShareButtons from '@/components/ShareButtons';
import { Textarea } from '@/components/ui/textarea';
import { getFlagEmoji } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InfoItem = ({ label, children }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-md text-white">{children}</p>
  </div>
);

const Watch = () => {
  const { slug } = useParams();
  const { getContentBySlug, getCommentsByContentId, addComment, incrementViews, content, categories } = useData();
  const { user, profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentEmbed, setCurrentEmbed] = useState({ url: '', name: '' });
  const [loading, setLoading] = useState(true);

  const getInitialEmbed = (contentItem) => {
    if (contentItem.type === 'movie') {
      const dubbed = contentItem.servers?.dubbed?.[0];
      const subtitled = contentItem.servers?.subtitled?.[0];
      return dubbed || subtitled || { url: '', name: '' };
    }
    if ((contentItem.type === 'series' || contentItem.type === 'anime') && contentItem.seasons?.[0]?.episodes?.[0]) {
      return { url: contentItem.seasons[0].episodes[0].embed_url, name: `EP ${contentItem.seasons[0].episodes[0].episode_number}` };
    }
    return { url: '', name: '' };
  };
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const contentItem = await getContentBySlug(slug);
      if (contentItem) {
        setCurrentContent(contentItem);
        setCurrentEmbed(getInitialEmbed(contentItem));
        const commentsData = await getCommentsByContentId(contentItem.id);
        setComments(commentsData);
        incrementViews(contentItem.id);
      } else {
        toast({ title: "Erro", description: "Conteúdo não encontrado.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error loading watch page data:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, getContentBySlug, getCommentsByContentId, incrementViews]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleListUpdate = async (listName) => {
    if (!profile) {
      toast({ title: "Login necessário", description: `Faça login para usar suas listas!` });
      return;
    }

    const currentList = profile[listName] || [];
    const contentId = currentContent.id;
    const isInList = currentList.includes(contentId);
    const newList = isInList ? currentList.filter(id => id !== contentId) : [...currentList, contentId];

    try {
      await updateUserProfile({ [listName]: newList });
      toast({
        title: "Lista atualizada!",
        description: `${currentContent.title} foi ${isInList ? 'removido da' : 'adicionado à'} sua lista.`
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para comentar." });
      return;
    }
    if (!newComment.trim()) {
      toast({ title: "Comentário vazio", description: "Escreva algo antes de enviar." });
      return;
    }
    try {
      await addComment({
        content_id: currentContent.id,
        comment_text: newComment,
        parent_id: null,
      });
      setNewComment('');
      loadData();
      toast({ title: "Comentário enviado!" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar seu comentário.", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen pt-8 flex items-center justify-center text-white">Carregando...</div>;
  if (!currentContent) return <div className="min-h-screen pt-8 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-4">Conteúdo não encontrado</h2><Link to="/"><Button>Voltar ao Início</Button></Link></div></div>;

  const isFavorited = profile?.favorites?.includes(currentContent.id);
  const isInWatchLater = profile?.watch_later?.includes(currentContent.id);
  const isWatched = profile?.watched?.includes(currentContent.id);
  const relatedContent = content.filter(item => item.id !== currentContent.id && item.category_ids?.some(catId => currentContent.category_ids?.includes(catId))).slice(0, 6);
  const categoryNames = currentContent.category_ids?.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ');

  const renderLinkList = (links, type) => (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <Button key={index} asChild variant="outline" size="sm" className="bg-white/5 border-white/10">
          <a href={type === 'server' ? '#' : link.url} onClick={(e) => { if(type === 'server') { e.preventDefault(); setCurrentEmbed(link); }}} target={type === 'download' ? '_blank' : '_self'} rel="noopener noreferrer">
            {type === 'server' ? <Tv className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            {link.name}
          </a>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-8">
      <Helmet><title>{currentContent.title} - CarsaiPlay</title><meta name="description" content={currentContent.description} /></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> Voltar</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black"><AdblockPlayer src={currentEmbed.url} title={currentContent.title} /></div>
            </motion.div>
            
            {(currentContent.type === 'series' || currentContent.type === 'anime') && currentContent.seasons?.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6"><SeasonsEpisodesList seasons={currentContent.seasons} onEpisodeSelect={setCurrentEmbed} currentEmbedUrl={currentEmbed.url} /></motion.div>
            ) : (
            <Tabs defaultValue="servers" className="w-full mb-6 glass-effect rounded-xl p-4">
              <TabsList className="grid w-full grid-cols-2 bg-black/20">
                <TabsTrigger value="servers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Tv className="w-4 h-4 mr-2"/>Assistir</TabsTrigger>
                <TabsTrigger value="downloads" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Download className="w-4 h-4 mr-2"/>Baixar</TabsTrigger>
              </TabsList>
              {['servers', 'downloads'].map(type => (
                <TabsContent key={type} value={type} className="mt-4">
                  <Tabs defaultValue="dubbed" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black/20">
                      <TabsTrigger value="dubbed" className="data-[state=active]:bg-purple-500/50 data-[state=active]:text-white">Dublado</TabsTrigger>
                      <TabsTrigger value="subtitled" className="data-[state=active]:bg-purple-500/50 data-[state=active]:text-white">Legendado</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dubbed" className="mt-4">{renderLinkList(currentContent[type]?.dubbed || [], type === 'servers' ? 'server' : 'download')}</TabsContent>
                    <TabsContent value="subtitled" className="mt-4">{renderLinkList(currentContent[type]?.subtitled || [], type === 'servers' ? 'server' : 'download')}</TabsContent>
                  </Tabs>
                </TabsContent>
              ))}
            </Tabs>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{getFlagEmoji('BR')} {currentContent.title}</h1>
                  {currentContent.original_title && <h2 className="text-lg text-gray-400 font-medium mb-4">{getFlagEmoji(currentContent.original_language)} {currentContent.original_title}</h2>}
                </div>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="w-7 h-7 fill-current" />
                  <span className="text-2xl font-bold text-white">{currentContent.rating?.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center space-x-2"><Eye className="w-5 h-5 text-gray-300" /><span className="text-gray-300">{currentContent.views || 0}</span></div>
                <div className="flex items-center space-x-2"><Film className="w-5 h-5 text-gray-300" /><span className="text-gray-300">{new Date(currentContent.release_date).getFullYear()}</span></div>
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">{currentContent.type === 'movie' ? 'Filme' : currentContent.type === 'series' ? 'Série' : 'Anime'}</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{currentContent.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <InfoItem label="Categorias">{categoryNames}</InfoItem>
                <InfoItem label="Elenco">{currentContent.cast?.join(', ')}</InfoItem>
                <InfoItem label="Diretores">{currentContent.directors?.join(', ')}</InfoItem>
                <InfoItem label="Produtoras">{currentContent.producers?.join(', ')}</InfoItem>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Button onClick={() => handleListUpdate('favorites')} variant={isFavorited ? "destructive" : "outline"}><Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />{isFavorited ? 'Nos Favoritos' : 'Favoritar'}</Button>
                <Button onClick={() => handleListUpdate('watch_later')} variant={isInWatchLater ? "default" : "outline"}><Clock className="w-4 h-4 mr-2" />{isInWatchLater ? 'Na Lista' : 'Ver Depois'}</Button>
                <Button onClick={() => handleListUpdate('watched')} variant={isWatched ? "secondary" : "outline"}><CheckCircle className="w-4 h-4 mr-2" />{isWatched ? 'Assistido' : 'Marcar como assistido'}</Button>
              </div>

              <ShareButtons url={window.location.href} title={currentContent.title} />

            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-effect rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Comentários</h3>
              {user ? (
                <form onSubmit={handleAddComment} className="mb-6">
                  <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escreva seu comentário..." className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-purple-500 resize-none" rows={3} />
                  <Button type="submit" className="mt-3 w-full"><Send className="w-4 h-4 mr-2" /> Enviar Comentário</Button>
                </form>
              ) : (<div className="text-center py-4 border border-dashed border-white/20 rounded-lg"><p className="text-gray-300">Faça <Link to="/login" className="text-purple-400 hover:underline">login</Link> para comentar.</p></div>)}
              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
                {comments.length > 0 ? (comments.map((comment) => (<Comment key={comment.id} comment={comment} contentId={currentContent.id} onCommentPosted={loadData} />))) : (<p className="text-gray-400 text-center py-4">Nenhum comentário ainda. Seja o primeiro a comentar!</p>)}
              </div>
            </motion.div>
          </div>
        </div>
        {relatedContent.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12"><ContentGrid content={relatedContent} title="Conteúdo Relacionado" /></motion.div>
        )}
      </div>
    </div>
  );
};

export default Watch;
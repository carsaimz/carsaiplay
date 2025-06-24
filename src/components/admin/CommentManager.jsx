
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CommentManager = () => {
  const { getAllComments, deleteComment } = useData();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const allComments = await getAllComments();
      setComments(allComments);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os comentários.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário e todas as suas respostas?')) {
      try {
        await deleteComment(id);
        toast({ title: "Sucesso", description: "Comentário excluído." });
        fetchComments();
      } catch (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    }
  };

  if (loading) {
    return <div>Carregando comentários...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gerenciar Comentários</h2>
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comentário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Conteúdo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{comment.profile?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{comment.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{comment.content?.title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(comment.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentManager;

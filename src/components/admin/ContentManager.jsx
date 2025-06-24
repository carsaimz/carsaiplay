
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ContentForm from '@/components/admin/ContentForm';

const ContentManager = () => {
  const { content, categories, deleteContent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const handleEdit = (item) => {
    setEditingContent(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      try {
        await deleteContent(id);
        toast({
          title: "Conteúdo excluído",
          description: "O conteúdo foi excluído com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContent(null);
  };
  
  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || !categories) return '';
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Conteúdo</h2>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Conteúdo
        </Button>
      </div>

      {showForm && (
        <ContentForm
          editingContent={editingContent}
          onClose={handleCloseForm}
        />
      )}

      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categorias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avaliação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Visualizações</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {content.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-sm text-gray-400">{new Date(item.release_date).getFullYear()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded-full">
                      {item.type === 'movie' ? 'Filme' : item.type === 'series' ? 'Série' : 'Anime'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getCategoryNames(item.category_ids)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default ContentManager;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState(category ? category.name : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Erro", description: "O nome da categoria não pode estar vazio.", variant: "destructive" });
      return;
    }
    onSave({ ...category, name });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass-effect rounded-xl p-6 mb-6 space-y-4"
    >
      <h3 className="text-lg font-bold text-white">{category ? 'Editar Categoria' : 'Nova Categoria'}</h3>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome da categoria"
        className="bg-white/10 border-white/20 text-white"
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancelar</Button>
        <Button type="submit"><Save className="w-4 h-4 mr-2" />Salvar</Button>
      </div>
    </motion.form>
  );
};

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (categoryData) => {
    try {
      if (categoryData.id) {
        await updateCategory(categoryData.id, { name: categoryData.name });
        toast({ title: "Sucesso", description: "Categoria atualizada." });
      } else {
        await addCategory({ name: categoryData.name });
        toast({ title: "Sucesso", description: "Categoria criada." });
      }
      setEditingCategory(null);
      setIsCreating(false);
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar conteúdos existentes.')) {
      try {
        await deleteCategory(id);
        toast({ title: "Sucesso", description: "Categoria excluída." });
      } catch (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Categorias</h2>
        <Button onClick={() => { setIsCreating(true); setEditingCategory(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      {(isCreating || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(cat); setIsCreating(false); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300">
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

export default CategoryManager;

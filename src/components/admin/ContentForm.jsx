
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SeasonsEpisodesManager from './SeasonsEpisodesManager';
import { slugify, getFlagEmoji } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiSelect from '@/components/ui/multi-select';

const ContentForm = ({ editingContent, onClose }) => {
  const { categories, addContent, updateContent } = useData();
  const { profile } = useAuth();
  
  const getInitialFormData = () => ({
    title: '',
    original_title: '',
    original_language: 'en',
    portuguese_title: '',
    slug: '',
    type: 'movie',
    category_ids: [],
    release_date: new Date().toISOString().split('T')[0],
    rating: 0,
    description: '',
    poster_url: '',
    cast: [],
    directors: [],
    producers: [],
    uploader_id: profile?.id || null,
    servers: { dubbed: [], subtitled: [] },
    downloads: { dubbed: [], subtitled: [] },
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [seasons, setSeasons] = useState([]);
  
  useEffect(() => {
    if (editingContent) {
      setFormData({
        title: editingContent.title || '',
        original_title: editingContent.original_title || '',
        original_language: editingContent.original_language || 'en',
        portuguese_title: editingContent.portuguese_title || '',
        slug: editingContent.slug || '',
        type: editingContent.type || 'movie',
        category_ids: editingContent.category_ids || [],
        release_date: editingContent.release_date || new Date().toISOString().split('T')[0],
        rating: editingContent.rating || 0,
        description: editingContent.description || '',
        poster_url: editingContent.poster_url || '',
        cast: editingContent.cast || [],
        directors: editingContent.directors || [],
        producers: editingContent.producers || [],
        uploader_id: editingContent.uploader_id || profile?.id,
        servers: editingContent.servers || { dubbed: [], subtitled: [] },
        downloads: editingContent.downloads || { dubbed: [], subtitled: [] },
      });
      if (editingContent.seasons) {
        setSeasons(editingContent.seasons);
      }
    } else {
      setFormData(getInitialFormData());
      setSeasons([]);
    }
  }, [editingContent, categories, profile]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { ...formData, [name]: type === 'checkbox' ? checked : value };
    if (name === 'title') {
      newFormData.slug = slugify(value);
    }
    setFormData(newFormData);
  };
  
  const handleArrayFieldChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value.split(',').map(item => item.trim()).filter(Boolean) });
  };
  
  const handleLinkChange = (index, type, audio, field, value) => {
    const newLinks = { ...formData[type] };
    newLinks[audio][index][field] = value;
    setFormData(prev => ({ ...prev, [type]: newLinks }));
  };

  const addLinkItem = (type, audio) => {
    const newItem = { name: `Opção ${formData[type][audio].length + 1}`, url: '' };
    const newLinks = { ...formData[type] };
    newLinks[audio].push(newItem);
    setFormData(prev => ({ ...prev, [type]: newLinks }));
  };

  const removeLinkItem = (index, type, audio) => {
    const newLinks = { ...formData[type] };
    newLinks[audio] = newLinks[audio].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentData = {
      ...formData,
      seasons: (formData.type === 'series' || formData.type === 'anime') ? seasons : null
    };

    try {
      if (editingContent) {
        await updateContent(editingContent.id, contentData);
        toast({ title: "Conteúdo atualizado", description: "O conteúdo foi atualizado com sucesso!" });
      } else {
        await addContent(contentData);
        toast({ title: "Conteúdo adicionado", description: "Novo conteúdo foi adicionado com sucesso!" });
      }
      onClose();
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-effect rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{editingContent ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Título Principal (Português)</label>
          <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Título Original</label>
          <input type="text" name="original_title" value={formData.original_title} onChange={handleFormChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL (Slug)</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleFormChange} required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Pôster (URL)</label>
          <input type="url" name="poster_url" value={formData.poster_url} onChange={handleFormChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
          <select name="type" value={formData.type} onChange={handleFormChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="movie" className="bg-gray-900">Filme</option>
            <option value="series" className="bg-gray-900">Série</option>
            <option value="anime" className="bg-gray-900">Anime</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Categorias</label>
          <MultiSelect
            options={categoryOptions}
            selected={formData.category_ids}
            onChange={(selectedIds) => setFormData({...formData, category_ids: selectedIds})}
            placeholder="Selecione as categorias"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Data de Lançamento</label>
          <input type="date" name="release_date" value={formData.release_date} onChange={handleFormChange} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Avaliação (0-10)</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleFormChange} min="0" max="10" step="0.1" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
        </div>
        
        {['cast', 'directors', 'producers'].map(field => (
          <div key={field} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{field} (separado por vírgula)</label>
            <input type="text" value={formData[field].join(', ')} onChange={(e) => handleArrayFieldChange(e, field)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
          </div>
        ))}
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Sinopse</label>
          <textarea name="description" value={formData.description} onChange={handleFormChange} rows={4} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none" />
        </div>

        <Tabs defaultValue="servers" className="md:col-span-2">
          <TabsList className="grid w-full grid-cols-2 bg-black/20">
            <TabsTrigger value="servers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Links para Assistir</TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Links para Baixar</TabsTrigger>
          </TabsList>
          {['servers', 'downloads'].map(type => (
            <TabsContent key={type} value={type} className="mt-4">
              <Tabs defaultValue="dubbed" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/20">
                  <TabsTrigger value="dubbed" className="data-[state=active]:bg-purple-500/50 data-[state=active]:text-white">Dublado</TabsTrigger>
                  <TabsTrigger value="subtitled" className="data-[state=active]:bg-purple-500/50 data-[state=active]:text-white">Legendado</TabsTrigger>
                </TabsList>
                {['dubbed', 'subtitled'].map(audio => (
                  <TabsContent key={audio} value={audio} className="space-y-2 mt-4">
                    {formData[type][audio].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="text" value={item.name} onChange={(e) => handleLinkChange(index, type, audio, 'name', e.target.value)} placeholder="Nome" className="w-1/3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                        <input type="url" value={item.url} onChange={(e) => handleLinkChange(index, type, audio, 'url', e.target.value)} placeholder="URL" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeLinkItem(index, type, audio)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addLinkItem(type, audio)}><Plus className="w-4 h-4 mr-2" />Adicionar</Button>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
        
        {(formData.type === 'series' || formData.type === 'anime') && (<SeasonsEpisodesManager seasons={seasons} setSeasons={setSeasons} />)}
        
        <div className="md:col-span-2 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit"><Save className="w-4 h-4 mr-2" />{editingContent ? 'Atualizar' : 'Adicionar'}</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContentForm;

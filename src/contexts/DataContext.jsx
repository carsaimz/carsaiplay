import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [contentRes, categoriesRes, settingsRes] = await Promise.all([
        supabase.from('content_with_details').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('settings').select('*').eq('id', 1).single(),
      ]);

      if (contentRes.error) throw contentRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (settingsRes.error && settingsRes.error.code !== 'PGRST116') throw settingsRes.error;

      setContent(contentRes.data || []);
      setCategories(categoriesRes.data || []);
      setSettings(settingsRes.data || { id: 1, site_name: 'CarsaiPlay', logo_url: null });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addContent = async (contentData) => {
    const { seasons, category_ids, ...restOfContent } = contentData;
    const { data, error } = await supabase.from('content').insert(restOfContent).select().single();
    if (error) throw error;

    if (category_ids && category_ids.length > 0) {
      const categoryLinks = category_ids.map(catId => ({ content_id: data.id, category_id: catId }));
      const { error: catError } = await supabase.from('content_categories').insert(categoryLinks);
      if (catError) throw catError;
    }
    
    if (seasons && seasons.length > 0) {
      for (const season of seasons) {
        const { episodes, ...restOfSeason } = season;
        const { data: seasonData, error: seasonError } = await supabase.from('seasons').insert({ ...restOfSeason, content_id: data.id }).select().single();
        if (seasonError) throw seasonError;
        if (episodes && episodes.length > 0) {
          const episodeLinks = episodes.map(ep => ({ ...ep, season_id: seasonData.id }));
          const { error: epError } = await supabase.from('episodes').insert(episodeLinks);
          if (epError) throw epError;
        }
      }
    }
    await fetchData();
  };

  const updateContent = async (id, contentData) => {
    const { seasons, category_ids, ...restOfContent } = contentData;
    const { error } = await supabase.from('content').update(restOfContent).eq('id', id);
    if (error) throw error;

    const { error: deleteCatError } = await supabase.from('content_categories').delete().eq('content_id', id);
    if (deleteCatError) throw deleteCatError;
    if (category_ids && category_ids.length > 0) {
      const categoryLinks = category_ids.map(catId => ({ content_id: id, category_id: catId }));
      const { error: catError } = await supabase.from('content_categories').insert(categoryLinks);
      if (catError) throw catError;
    }

    const { data: existingSeasons } = await supabase.from('seasons').select('id').eq('content_id', id);
    if (existingSeasons) {
      const seasonIds = existingSeasons.map(s => s.id);
      if (seasonIds.length > 0) {
        await supabase.from('episodes').delete().in('season_id', seasonIds);
        await supabase.from('seasons').delete().eq('content_id', id);
      }
    }
    if (seasons && seasons.length > 0) {
      for (const season of seasons) {
        const { episodes, ...restOfSeason } = season;
        const { data: seasonData, error: seasonError } = await supabase.from('seasons').insert({ ...restOfSeason, content_id: id }).select().single();
        if (seasonError) throw seasonError;
        if (episodes && episodes.length > 0) {
          const episodeLinks = episodes.map(ep => ({ ...ep, season_id: seasonData.id }));
          const { error: epError } = await supabase.from('episodes').insert(episodeLinks);
          if (epError) throw epError;
        }
      }
    }
    await fetchData();
  };

  const deleteContent = async (id) => {
    const { error } = await supabase.from('content').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const addCategory = async (name) => {
    const { error } = await supabase.from('categories').insert({ name });
    if (error) throw error;
    await fetchData();
  };

  const updateCategory = async (id, name) => {
    const { error } = await supabase.from('categories').update({ name }).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const getContentBySlug = async (slug) => {
    const { data, error } = await supabase.from('content_with_details').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching content by slug:", error);
      return null;
    }
    return data;
  };

  const getCommentsByContentId = async (contentId) => {
    const { data, error } = await supabase.from('comments').select('*, profile:profiles(*)').eq('content_id', contentId).order('created_at');
    if (error) throw error;
    return data;
  };

  const addComment = async (commentData) => {
    const { error } = await supabase.from('comments').insert({ ...commentData, user_id: user.id });
    if (error) throw error;
  };

  const voteOnComment = async (comment_id, vote_type) => {
    const { error } = await supabase.from('comment_votes').upsert({ comment_id, user_id: user.id, vote_type }, { onConflict: 'comment_id, user_id' });
    if (error) throw error;
  };

  const incrementViews = async (id) => {
    await supabase.rpc('increment_views', { content_id_in: id });
  };

  const searchContent = async (query) => {
    const { data, error } = await supabase.rpc('search_content', { query_term: query });
    if (error) throw error;
    return data;
  };

  const getAllUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data;
  };

  const getAllComments = async () => {
    const { data, error } = await supabase.from('comments').select('*, profile:profiles(name), content:content(title)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const deleteComment = async (id) => {
    await supabase.rpc('delete_comment_with_replies', { p_comment_id: id });
    await fetchData();
  };

  const updateSiteSettings = async (updates) => {
    const { error } = await supabase.from('settings').update(updates).eq('id', 1);
    if (error) throw error;
    await fetchData();
  };

  const uploadFile = async (bucket, file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  };

  const value = {
    content, categories, settings, loading, fetchData,
    addContent, updateContent, deleteContent,
    addCategory, updateCategory, deleteCategory,
    getContentBySlug, getCommentsByContentId, addComment, voteOnComment,
    incrementViews, searchContent, getAllUsers, getAllComments, deleteComment,
    updateSiteSettings, uploadFile
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
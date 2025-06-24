import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Heart, Clock, Eye, Edit2, Save, X, KeyRound, EyeOff, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import ContentGrid from '@/components/ContentGrid';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const { user, profile, updateUserProfile, updateUserPassword } = useAuth();
  const { content, uploadFile } = useData();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditData({ name: profile.name || '' });
    }
  }, [profile]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!profile) {
    return <div className="min-h-screen pt-8 flex items-center justify-center"><p className="text-white">Carregando perfil...</p></div>;
  }

  const favoriteContent = content.filter(item => profile.favorites?.includes(item.id));
  const watchLaterContent = content.filter(item => profile.watch_later?.includes(item.id));
  const watchedContent = content.filter(item => profile.watched?.includes(item.id));

  const handleSaveProfile = async () => {
    if (editData.name === profile.name) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile({ name: editData.name });
      setIsEditing(false);
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas!" });
    } catch (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Erro", description: "As novas senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(passwordData.newPassword);
      setIsChangingPassword(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      toast({ title: "Senha alterada!", description: "Sua senha foi atualizada com sucesso." });
    } catch (error) {
      toast({ title: "Erro ao alterar senha", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const newAvatarUrl = await uploadFile(file, 'avatars');
      await updateUserProfile({ avatar_url: newAvatarUrl });
      toast({ title: "Sucesso", description: "Avatar atualizado!" });
    } catch (error) {
      toast({ title: "Erro no Upload", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen pt-8">
      <Helmet>
        <title>Meu Perfil - CarsaiPlay</title>
        <meta name="description" content="Gerencie seu perfil, favoritos e listas de reprodução." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 text-3xl">
                  <AvatarImage src={profile.avatar_url} alt={profile.name} />
                  <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Upload className="w-8 h-8" />
                  <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                </label>
              </div>
              <div className="space-y-2">
                {isEditing ? (
                  <Input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="text-2xl font-bold bg-white/10 border border-white/20" />
                ) : (
                  <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                )}
                <p className="text-gray-300">{profile.email}</p>
                <p className="text-sm text-gray-400">Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} size="sm" disabled={loading}><Save className="w-4 h-4 mr-2" />Salvar</Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm"><X className="w-4 h-4 mr-2" />Cancelar</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm"><Edit2 className="w-4 h-4 mr-2" />Editar Perfil</Button>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <Button onClick={() => setIsChangingPassword(!isChangingPassword)} variant="ghost" className="text-purple-400 hover:text-purple-300">
              <KeyRound className="w-4 h-4 mr-2" />
              {isChangingPassword ? 'Cancelar Alteração de Senha' : 'Alterar Senha'}
            </Button>

            {isChangingPassword && (
              <motion.form onSubmit={handlePasswordChange} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
                  <div className="relative"><Input type={showPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="bg-white/10 border-white/20 pr-10" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
                  <div className="relative"><Input type={showConfirmPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="bg-white/10 border-white/20 pr-10" required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
                </div>
                <Button type="submit" disabled={loading} size="sm">{loading ? 'Salvando...' : 'Salvar Nova Senha'}</Button>
              </motion.form>
            )}
          </div>
        </motion.div>

        <div className="space-y-12">
          {favoriteContent.length > 0 && <ContentGrid content={favoriteContent} title="❤️ Meus Favoritos" />}
          {watchLaterContent.length > 0 && <ContentGrid content={watchLaterContent} title="⏰ Assistir Mais Tarde" />}
          {watchedContent.length > 0 && <ContentGrid content={watchedContent} title="✅ Já Assistidos" />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
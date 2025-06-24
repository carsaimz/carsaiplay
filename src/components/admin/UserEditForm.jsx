
import React, { useState, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

const UserEditForm = ({ user, onClose }) => {
  const { updateUserProfile, uploadFile } = useData();
  const [isAdmin, setIsAdmin] = useState(user.is_admin);
  const [isBlocked, setIsBlocked] = useState(user.is_blocked);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newAvatarUrl = await uploadFile(file, `avatars/${user.id}`);
      setAvatarUrl(newAvatarUrl);
      toast({ title: "Sucesso", description: "Avatar enviado. Salve para aplicar." });
    } catch (error) {
      toast({ title: "Erro no Upload", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        is_admin: isAdmin,
        is_blocked: isBlocked,
        avatar_url: avatarUrl,
      });
      toast({ title: "Usuário atualizado!", description: `Os dados de ${user.name} foram salvos.` });
      onClose();
    } catch (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-white">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-300 mb-2">Avatar</Label>
        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Enviando...' : 'Trocar Avatar'}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isAdmin" className="text-gray-300">Administrador</Label>
        <Switch id="isAdmin" checked={isAdmin} onCheckedChange={setIsAdmin} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="isBlocked" className="text-gray-300">Bloquear Conta</Label>
        <Switch id="isBlocked" checked={isBlocked} onCheckedChange={setIsBlocked} />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};

export default UserEditForm;

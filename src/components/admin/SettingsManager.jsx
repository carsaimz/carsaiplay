import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Upload } from 'lucide-react';

const SettingsManager = () => {
  const { settings, updateSiteSettings, uploadFile } = useData();
  const [siteName, setSiteName] = useState('CarsaiPlay');
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.site_name || 'CarsaiPlay');
      setLogoUrl(settings.logo_url || '');
    }
  }, [settings]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newLogoUrl = await uploadFile(file, 'logos');
      setLogoUrl(newLogoUrl);
      toast({ title: "Sucesso", description: "Logo enviado com sucesso." });
    } catch (error) {
      toast({ title: "Erro no Upload", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSiteSettings({ site_name: siteName, logo_url: logoUrl });
      toast({ title: "Configurações salvas!", description: "As configurações do site foram atualizadas." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar as configurações.", variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configurações da Plataforma</h2>
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Identidade Visual</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Plataforma</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Logo do Site</label>
            <div className="flex items-center space-x-4">
              {logoUrl && <img src={logoUrl} alt="Logo atual" className="h-12 w-auto bg-gray-500 rounded-md p-1" />}
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Enviando...' : 'Trocar Logo'}
              </Button>
            </div>
          </div>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsManager;
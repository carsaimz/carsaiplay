
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, BarChart3, Settings, List, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import AdminStats from '@/components/admin/AdminStats';
import ContentManager from '@/components/admin/ContentManager';
import UserManager from '@/components/admin/UserManager';
import SettingsManager from '@/components/admin/SettingsManager';
import CategoryManager from '@/components/admin/CategoryManager';
import CommentManager from '@/components/admin/CommentManager';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { content, categories, getAllUsers } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      if (isAdmin) {
        const users = await getAllUsers();
        setUserCount(users.length);
      }
    };
    fetchUserCount();
  }, [isAdmin, getAllUsers]);

  if (!user || !isAdmin) {
    navigate('/');
    return null;
  }

  const totalViews = content.reduce((sum, item) => sum + (item.views || 0), 0);

  const tabs = [
    { id: 'content', label: 'Conteúdo', icon: BarChart3 },
    { id: 'categories', label: 'Categorias', icon: List },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'comments', label: 'Comentários', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen pt-8">
      <Helmet>
        <title>Painel Administrativo - CarsaiPlay</title>
        <meta name="description" content="Gerencie conteúdos, usuários e configurações da plataforma CarsaiPlay." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-6">⚙️ Painel Administrativo</h1>
          
          <AdminStats
            contentCount={content.length}
            userCount={userCount}
            viewCount={totalViews}
            categoryCount={categories.length}
          />

          <div className="flex space-x-1 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'comments' && <CommentManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
};

export default Admin;

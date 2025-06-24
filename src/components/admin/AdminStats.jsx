import React from 'react';

const AdminStats = ({ contentCount, userCount, viewCount, categoryCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Total de Conteúdo</h3>
        <p className="text-3xl font-bold text-purple-400">{contentCount}</p>
      </div>
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Usuários</h3>
        <p className="text-3xl font-bold text-cyan-400">{userCount}</p>
      </div>
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Visualizações</h3>
        <p className="text-3xl font-bold text-green-400">{viewCount}</p>
      </div>
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Categorias</h3>
        <p className="text-3xl font-bold text-yellow-400">{categoryCount}</p>
      </div>
    </div>
  );
};

export default AdminStats;
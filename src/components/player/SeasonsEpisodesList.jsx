
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Tv } from 'lucide-react';

const SeasonsEpisodesList = ({ seasons, onEpisodeSelect, currentEmbedUrl }) => {
  const [activeSeason, setActiveSeason] = useState(seasons.length > 0 ? seasons[0].id : null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSeasons = seasons.map(season => ({
    ...season,
    episodes: season.episodes.filter(ep =>
      ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.episode_number.toString().includes(searchTerm)
    )
  })).filter(season => season.episodes.length > 0);

  return (
    <div className="glass-effect rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Episódios</h3>
        <div className="relative w-full max-w-xs">
          <Input type="text" placeholder="Pesquisar episódio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/10 border-white/20 text-white pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {seasons.map(season => (
          <button key={season.id} onClick={() => setActiveSeason(season.id)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSeason === season.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
            Temporada {season.season_number}
          </button>
        ))}
      </div>
      <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
        {filteredSeasons.filter(season => season.id === activeSeason).map(season => (
          <div key={season.id} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {season.episodes.map(episode => (
              <button key={episode.id} onClick={() => onEpisodeSelect({ url: episode.embed_url, name: `EP ${episode.episode_number}` })} className={`text-left p-3 rounded-lg transition-colors group ${currentEmbedUrl === episode.embed_url ? 'bg-purple-600/70' : 'bg-black/30 hover:bg-purple-600/50'}`}>
                <div className="flex items-center space-x-2">
                  <Tv className="w-5 h-5 text-purple-400 group-hover:text-white" />
                  <span className="font-semibold text-white">EP {episode.episode_number}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1 truncate group-hover:text-white">{episode.title || `Episódio ${episode.episode_number}`}</p>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonsEpisodesList;

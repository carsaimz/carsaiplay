
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

const SeasonsEpisodesManager = ({ seasons, setSeasons }) => {
  const handleSeasonChange = (seasonIndex, field, value) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex][field] = value;
    setSeasons(newSeasons);
  };

  const addSeason = () => {
    setSeasons([...seasons, { season_number: seasons.length + 1, title: '', episodes: [] }]);
  };

  const removeSeason = (seasonIndex) => {
    setSeasons(seasons.filter((_, index) => index !== seasonIndex));
  };

  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(newSeasons);
  };

  const addEpisode = (seasonIndex) => {
    const newSeasons = [...seasons];
    const newEpisode = {
      episode_number: newSeasons[seasonIndex].episodes.length + 1,
      title: '',
      embed_url: '',
      poster: ''
    };
    newSeasons[seasonIndex].episodes.push(newEpisode);
    setSeasons(newSeasons);
  };

  const removeEpisode = (seasonIndex, episodeIndex) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes = newSeasons[seasonIndex].episodes.filter((_, index) => index !== episodeIndex);
    setSeasons(newSeasons);
  };

  return (
    <div className="md:col-span-2 space-y-6">
      <h3 className="text-lg font-semibold text-white">Temporadas e Episódios</h3>
      {seasons.map((season, seasonIndex) => (
        <div key={seasonIndex} className="glass-effect rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">Temporada {season.season_number}</h4>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeSeason(seasonIndex)}>
              <Trash2 className="w-4 h-4 mr-2" /> Remover Temporada
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`season_number_${seasonIndex}`} className="text-gray-300">Número da Temporada</Label>
              <Input id={`season_number_${seasonIndex}`} type="number" value={season.season_number} onChange={(e) => handleSeasonChange(seasonIndex, 'season_number', parseInt(e.target.value))} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor={`season_title_${seasonIndex}`} className="text-gray-300">Título da Temporada (Opcional)</Label>
              <Input id={`season_title_${seasonIndex}`} type="text" value={season.title} onChange={(e) => handleSeasonChange(seasonIndex, 'title', e.target.value)} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-white">Episódios</h5>
            {season.episodes.map((episode, episodeIndex) => (
              <div key={episodeIndex} className="flex items-end gap-2 p-2 rounded bg-black/20">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input type="number" value={episode.episode_number} onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'episode_number', parseInt(e.target.value))} placeholder="Nº" className="bg-white/10 border-white/20 text-white" />
                  <Input type="text" value={episode.title} onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'title', e.target.value)} placeholder="Título do Episódio" className="bg-white/10 border-white/20 text-white" />
                  <Input type="url" value={episode.embed_url} onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'embed_url', e.target.value)} placeholder="URL do Embed" className="bg-white/10 border-white/20 text-white" required />
                  <Input type="url" value={episode.poster} onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'poster', e.target.value)} placeholder="URL do Poster (Opcional)" className="bg-white/10 border-white/20 text-white" />
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => removeEpisode(seasonIndex, episodeIndex)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addEpisode(seasonIndex)}><Plus className="w-4 h-4 mr-2" /> Adicionar Episódio</Button>
          </div>
        </div>
      ))}
      <Button type="button" onClick={addSeason}><Plus className="w-4 h-4 mr-2" /> Adicionar Temporada</Button>
    </div>
  );
};

export default SeasonsEpisodesManager;

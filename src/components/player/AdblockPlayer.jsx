
import React from 'react';

const AdblockPlayer = ({ src, title }) => {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <p className="text-lg font-semibold">Player Indisponível</p>
          <p className="text-sm text-gray-400">Selecione um episódio ou servidor para assistir.</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      className="w-full h-full"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowFullScreen
      sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-presentation"
    ></iframe>
  );
};

export default AdblockPlayer;

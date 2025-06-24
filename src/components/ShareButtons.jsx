
import React from 'react';
import { Facebook, Twitter, Linkedin, MessageCircle, Send, Youtube as Reddit, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

const ShareButtons = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copiado!',
      description: 'O link foi copiado para sua área de transferência.',
    });
  };

  const iconMapping = {
    facebook: <Facebook className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    whatsapp: <MessageCircle className="w-5 h-5" />,
    telegram: <Send className="w-5 h-5" />,
    reddit: <Reddit className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-white font-semibold mr-2">Compartilhar:</span>
      {Object.entries(socialLinks).map(([key, link]) => (
        <Button key={key} asChild variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${key}`}>
            {iconMapping[key]}
          </a>
        </Button>
      ))}
      <Button onClick={handleCopy} variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
        <Copy className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ShareButtons;

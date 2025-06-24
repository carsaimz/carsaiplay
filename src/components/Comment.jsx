import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

const Comment = ({ comment, contentId, onCommentPosted }) => {
  const { user } = useAuth();
  const { addComment, voteOnComment } = useData();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleVote = async (voteType) => {
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para votar!" });
      return;
    }
    try {
      await voteOnComment(comment.id, voteType);
      toast({ title: "Voto registrado!" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível registrar seu voto.", variant: "destructive" });
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await addComment({
        content_id: contentId,
        comment_text: replyText,
        parent_id: comment.id,
      });
      setReplyText('');
      setReplying(false);
      onCommentPosted();
      toast({ title: "Resposta enviada!" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar sua resposta.", variant: "destructive" });
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-4"
    >
      <Avatar>
        <AvatarImage src={comment.profile?.avatar_url} alt={comment.profile?.name} />
        <AvatarFallback>{getInitials(comment.profile?.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{comment.profile?.name || 'Usuário Anônimo'}</span>
        </div>
        <p className="text-gray-300 text-sm mt-1">{comment.comment_text}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
          <button onClick={() => handleVote(1)} className="flex items-center space-x-1 hover:text-green-400">
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button onClick={() => handleVote(-1)} className="flex items-center space-x-1 hover:text-red-400">
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button onClick={() => setReplying(!replying)} className="flex items-center space-x-1 hover:text-white">
            <MessageSquare className="w-4 h-4" />
            <span>Responder</span>
          </button>
          <span className="text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>

        {replying && (
          <form onSubmit={handleReplySubmit} className="mt-4 flex space-x-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Respondendo a ${comment.profile?.name}...`}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-purple-500 resize-none"
              rows={1}
            />
            <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default Comment;
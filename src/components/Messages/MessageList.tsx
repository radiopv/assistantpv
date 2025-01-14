import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Message } from "@/types/messages";

export const MessageList = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(name),
          recipient:recipient_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as any[]).map(message => ({
        ...message,
        sender: message.sender || { name: 'Système' },
        recipient: message.recipient || { name: 'Système' }
      })) as Message[];
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success("Message supprimé avec succès");
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error("Erreur lors de la suppression du message");
    }
  });

  if (isLoading) {
    return <div>Chargement des messages...</div>;
  }

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <Card key={message.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{message.subject}</h3>
                {!message.is_read && (
                  <Badge variant="destructive">Non lu</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                De: {message.sender?.name || 'Système'}
              </p>
              <p className="mt-2">{message.content}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                  locale: fr
                })}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Le message sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteMessageMutation.mutate(message.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
      {messages?.length === 0 && (
        <p className="text-center text-gray-500">Aucun message</p>
      )}
    </div>
  );
};
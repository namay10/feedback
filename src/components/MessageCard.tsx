"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { message } from "@/models/Content.model";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

// Define the shape of the response you expect from the delete API
interface DeleteMessageResponse {
  message: string;
}

type MessageCardProps = {
  message: message;
  onMessageDelete: (messageID: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      // Explicitly define the type of the response
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: "Message deleted",
        description: response.data.message, // No more type errors
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4 shadow-md">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Once you delete this message, it
                will be permanently removed from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <p>{message.content || "No content available."}</p>
      </CardContent>

      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;

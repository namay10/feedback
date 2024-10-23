"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "@/models/Content.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const Page = () => {
  const [messages, setMessages] = useState([] as message[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAccept = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/acceptmessage");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch message setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/getmessage");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Successfully refreshed messages",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAccept();
  }, [session, fetchMessages, fetchAccept]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/acceptmessage", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch message setting",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const username = session?.user?.username;
  if (!username) {
    return <div>Please Login</div>;
  }
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/x/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      description: "Copied to clipboard",
      variant: "default",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>

      {/* Profile Link Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Profile Link
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2"
          />
          <Button onClick={copyToClipboard} className="w-full md:w-auto">
            Copy Link
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-6 flex items-center">
        <h2 className="text-lg font-semibold mb-2">Message Settings</h2>
        <div className="flex items-center ml-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: <strong>{acceptMessages ? "On" : "Off"}</strong>
          </span>
        </div>
      </div>

      <Separator />

      {/* Refresh Messages Button */}
      <div className="mt-6 flex justify-end">
        <Button
          className="mt-4 flex items-center gap-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          {isLoading ? "Loading..." : "Refresh Messages"}
        </Button>
      </div>

      {/* Message Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center col-span-full">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;

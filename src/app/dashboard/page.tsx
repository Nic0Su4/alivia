"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/Chat/ConversationList";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";
import Header from "@/components/Chat/Header";
import {
  addMessage,
  createConversation,
  editConversation,
  getUserConversation,
  getUserConversations,
} from "@/utils/conversationUtils";
import { Conversation, Message, User } from "@/utils/types";
import { useUserStore } from "@/store/user";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { enviarMensaje, iniciarChat } from "@/utils/generativeAIUtils";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = useUserStore((state) => state.user) as User | null;
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Verifica el tamaño inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser && !user) {
        setUser(JSON.parse(storedUser));
      } else if (!storedUser && !user) {
        redirect("/");
      }

      const fetchConversations = async () => {
        if (!user) return;
        const userConversations = await getUserConversations(user.uid);
        setConversations(userConversations);
      };

      fetchConversations();
    }
  }, [user, setUser]);

  useEffect(() => {}, [selectedConversation, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        const conversation = await getUserConversation(
          user!.uid,
          selectedConversation.id
        );
        setMessages(conversation?.messages || []);
      }
    };

    fetchMessages();
  }, [selectedConversation, user]);

  const handleSend = async () => {
    if (!input.trim() || !user || !selectedConversation) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      createdAt: Timestamp.now(),
      sender: "user",
    };

    setMessages([...messages, userMessage]);

    try {
      const botResponseContent = await enviarMensaje(input);

      const botReply: Message = {
        id: crypto.randomUUID(),
        content: botResponseContent,
        createdAt: Timestamp.now(),
        sender: "bot",
      };

      const updatedConversation = await addMessage(
        user.uid,
        selectedConversation,
        userMessage
      );
      const updatedConversationBot = await addMessage(
        user.uid,
        updatedConversation,
        botReply
      );

      setMessages((prevMessages) => [...prevMessages, botReply]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === updatedConversationBot.id ? updatedConversationBot : conv
        )
      );
    } catch (error) {
      console.error("Error al generar la respuesta del bot:", error);
    }

    setInput("");
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    const fetchedConversation = await getUserConversation(
      user!.uid,
      conversation.id
    );
    setMessages(fetchedConversation?.messages || []);

    const conversationHistory = fetchedConversation?.messages.map(
      (message) => ({
        role: message.sender === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      })
    );

    iniciarChat(conversationHistory ? conversationHistory : []);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleNewConversation = async () => {
    if (!user) return;
    const newConversation = await createConversation(
      user.uid,
      "Nueva consulta"
    );

    setConversations((prev) => [...prev, newConversation]);
    setMessages([]);
    setSelectedConversation(newConversation);
    setUser({
      ...user,
      conversations: [...conversations, newConversation],
    });
    iniciarChat([]);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white relative">
      {isSidebarOpen && (
        <div
          className={`${
            isMobile ? "fixed inset-0 bg-black bg-opacity-50 z-10" : "relative"
          }`}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div
            className={`${
              isMobile ? "absolute left-0 top-0 w-7/10 h-full bg-white" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onEditConversation={(conv, newName) => {
                editConversation(user!.uid, conv, newName);

                setConversations(
                  conversations.map((c) =>
                    c.id === conv.id ? { ...c, name: newName } : c
                  )
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-1">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isChatView={!!selectedConversation}
        />
        {selectedConversation ? (
          <>
            <MessageList messages={messages} />
            <MessageInput
              onSend={handleSend}
              input={input}
              setInput={setInput}
            />
          </>
        ) : (
          <div className="p-8">
            <p>Selecciona una conversación o crea una nueva.</p>
          </div>
        )}
      </div>
    </div>
  );
}

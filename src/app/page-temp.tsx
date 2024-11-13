"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SendIcon,
  PhoneIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  MenuIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  PillIcon,
  XIcon,
  EditIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "¡Hola! Soy AlivIA. ¿Puedes describir tus síntomas?",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "Dolor de cabeza",
      date: "2023-06-10",
      icon: HeartPulseIcon,
    },
    {
      id: 2,
      title: "Problemas digestivos",
      date: "2023-06-09",
      icon: StethoscopeIcon,
    },
    {
      id: 3,
      title: "Alergias estacionales",
      date: "2023-06-08",
      icon: PillIcon,
    },
  ]);
  const [currentView, setCurrentView] = useState("chat");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación real
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Gracias por compartir tus síntomas. Estoy analizando la información...",
        },
      ]);
      setInput("");
    }
  };

  const handleNewConsultation = () => {
    const newId = conversations.length + 1;
    const newConversation = {
      id: newId,
      title: `Nueva consulta ${newId}`,
      date: new Date().toISOString().split("T")[0],
      icon: HeartPulseIcon,
    };
    setConversations([newConversation, ...conversations]);
    setSelectedConversation(newConversation);
    setMessages([
      {
        role: "bot",
        content: "¡Hola! Soy AlivIA. ¿En qué puedo ayudarte hoy?",
      },
    ]);
    setCurrentView("chat");
  };

  const startEditingConversation = (conv) => {
    setEditingConversationId(conv.id);
    setEditingTitle(conv.title);
  };

  const saveConversationTitle = () => {
    setConversations(
      conversations.map((conv) =>
        conv.id === editingConversationId
          ? { ...conv, title: editingTitle }
          : conv
      )
    );
    setEditingConversationId(null);
  };

  const renderMainContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#3CDBB0]">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5GfpJfbkyd8HBavmpeBzzxfIkzUUbz.png"
              width={100}
              height={100}
              alt="AlivIA Logo"
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-center mb-6">
              Iniciar sesión en AlivIA
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#3CDBB0] hover:bg-[#2fa88a] text-black"
              >
                Iniciar sesión
              </Button>
            </form>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "chat":
        return (
          <>
            <ScrollArea className="flex-1 p-6 bg-[#f0f0f0]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar
                      className={`w-10 h-10 ${
                        message.role === "user" ? "ml-3" : "mr-3"
                      }`}
                    >
                      <AvatarImage
                        src={
                          message.role === "user"
                            ? "/placeholder-user.jpg"
                            : "/placeholder-bot.jpg"
                        }
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-2 shadow-md ${
                        message.role === "user"
                          ? "bg-[#E8C39E] text-black"
                          : "bg-[#3CDBB0] text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <footer className="p-4 bg-white border-t border-[#3CDBB0]">
              <div className="flex items-center space-x-2 max-w-4xl mx-auto">
                <Input
                  className="flex-1 border-[#3CDBB0] focus:ring-[#3CDBB0] focus:border-[#3CDBB0] rounded-full py-3 px-4 shadow-sm"
                  placeholder="Describe tus síntomas..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  onClick={handleSend}
                  className="bg-[#3CDBB0] hover:bg-[#2fa88a] text-black rounded-full p-3 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  <SendIcon className="h-5 w-5" />
                  <span className="sr-only">Enviar mensaje</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#3CDBB0] text-[#3CDBB0] hover:bg-[#E8C39E] rounded-full p-3 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
                    >
                      <PhoneIcon className="h-5 w-5" />
                      <span className="sr-only">Contactar a un doctor</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contactar a un Doctor</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nombre
                        </Label>
                        <Input id="name" value="" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Teléfono
                        </Label>
                        <Input id="phone" value="" className="col-span-3" />
                      </div>
                    </div>
                    <Button className="bg-[#3CDBB0] hover:bg-[#2fa88a] text-black">
                      Solicitar llamada
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs text-center mt-3 text-gray-600 max-w-2xl mx-auto">
                AlivIA es un asistente virtual. Para emergencias médicas,
                contacta inmediatamente a servicios de emergencia.
              </p>
            </footer>
          </>
        );
      case "settings":
        return (
          <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4">Configuración</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificaciones</Label>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Modo oscuro</Label>
                <Switch id="darkMode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Idioma</Label>
                <select id="language" className="border rounded p-2">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return renderMainContent();
  }

  return (
    <div className="flex h-screen bg-[#3CDBB0]">
      {/* Barra lateral */}
      <aside
        className={`w-80 bg-white p-6 shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static h-full z-50`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5GfpJfbkyd8HBavmpeBzzxfIkzUUbz.png"
              width={50}
              height={50}
              alt="AlivIA Logo"
            />
            <h2 className="text-2xl font-bold text-black">AlivIA</h2>
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
        <Button
          className="w-full justify-start mb-6 bg-[#3CDBB0] hover:bg-[#2fa88a] text-black transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleNewConsultation}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva consulta
        </Button>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`mb-4 p-3 hover:bg-[#E8C39E] rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                selectedConversation?.id === conv.id ? "bg-[#E8C39E]" : ""
              }`}
              onClick={() => {
                setSelectedConversation(conv);
                setCurrentView("chat");
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#3CDBB0] p-2 rounded-full">
                    <conv.icon className="h-5 w-5 text-black" />
                  </div>
                  {editingConversationId === conv.id ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={saveConversationTitle}
                      onKeyPress={(e) =>
                        e.key === "Enter" && saveConversationTitle()
                      }
                      className="w-full"
                    />
                  ) : (
                    <div>
                      <h3 className="font-medium text-black">{conv.title}</h3>
                      <p className="text-sm text-gray-600">{conv.date}</p>
                    </div>
                  )}
                </div>
                {editingConversationId !== conv.id && (
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingConversation(conv);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <Separator className="my-6" />
        <Button
          variant="ghost"
          className="w-full justify-start text-black hover:bg-[#E8C39E] transition-all duration-200 ease-in-out"
          onClick={() => setCurrentView("settings")}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </aside>

      {/* Área principal */}
      <main className="flex-1 flex flex-col bg-white shadow-lg rounded-l-3xl overflow-hidden">
        {/* Barra superior */}
        <header className="bg-[#3CDBB0] text-black p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className="md:hidden text-black"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5GfpJfbkyd8HBavmpeBzzxfIkzUUbz.png"
              width={40}
              height={40}
              alt="AlivIA Logo"
              className="mr-2"
            />
            AlivIA - Tu Asistente de Salud
          </h1>
          {currentView === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-[#E8C39E] rounded-full"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          )}
        </header>

        {renderMainContent()}
      </main>
    </div>
  );
}

// components/MessageInput.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSend: (message: string) => void;
  input: string;
  setInput: (value: string) => void;
}

export default function MessageInput({
  onSend,
  input,
  setInput,
}: MessageInputProps) {
  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className=" flex items-center h-[8vh] mx-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        className="flex-1"
      />
      <Button onClick={handleSend} className="ml-2">
        Enviar
      </Button>
    </div>
  );
}

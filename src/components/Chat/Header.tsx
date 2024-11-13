// components/Header.tsx
import { Button } from "@/components/ui/button";
import { MenuIcon, TrashIcon } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  isChatView: boolean;
}

export default function Header({ onToggleSidebar, isChatView }: HeaderProps) {
  return (
    <header className="bg-[#3CDBB0] px-4 flex justify-between items-center h-[10vh] text-gray-800">
      <Button variant="ghost" onClick={onToggleSidebar}>
        <MenuIcon className="h-6 w-6" />
      </Button>
      <h1 className="text-3xl font-bold">AlivIA</h1>
      {isChatView && (
        <Button variant="ghost" size="icon">
          <TrashIcon className="h-6 w-6" />
        </Button>
      )}
    </header>
  );
}

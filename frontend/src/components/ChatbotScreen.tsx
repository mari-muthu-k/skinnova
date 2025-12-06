import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Loader2 } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import type { Message, Profile, RoutineStep } from "../entities/types";

const handleKeyPress = (
  e: React.KeyboardEvent<HTMLInputElement>,
  handler: () => void
): void => {
  if (e.key === "Enter") {
    handler();
  }
};

interface ChatbotScreenProps {
  messages: Message[];
  isTyping: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  openModal: (step: RoutineStep, warnings: string[], profile: Profile) => void;
  chatRef: React.RefObject<HTMLDivElement | null>;
}

const ChatbotScreen: React.FC<ChatbotScreenProps> = ({
  messages,
  isTyping,
  input,
  setInput,
  sendMessage,
  openModal,
  chatRef,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col h-full overflow-hidden"
  >
    <div className="p-4 flex justify-between items-center border-b bg-white shadow-sm">
      <button className="text-xl text-gray-500 hover:text-gray-900 transition">
        <X size={20} />
      </button>
      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold text-gray-800">Skincare AI</p>
        <p className="text-xs text-gray-500">Online</p>
      </div>
      <div className="w-5"></div>
    </div>

    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            sender={msg.sender}
            content={msg.content}
            openModal={openModal}
          />
        ))}
      </AnimatePresence>

      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}
    </div>

    <div className="p-4 bg-white flex items-center gap-3 border-t shadow-inner">
      <div className="flex items-center bg-gray-100 p-3 rounded-full flex-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, sendMessage)}
          type="text"
          placeholder="Ask the AI"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <button
        onClick={sendMessage}
        disabled={isTyping}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition ${
          input.trim()
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Send message"
      >
        {isTyping ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Send size={20} />
        )}
      </button>
    </div>
  </motion.div>
);

export default ChatbotScreen;

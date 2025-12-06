import { motion } from "framer-motion";
import RoutineDisplay from "./RoutineDisplay";
import type { MessageContent, Profile, RoutineStep } from "../entities/types";

interface ChatBubbleProps {
  sender: "user" | "bot";
  content: MessageContent;
  openModal: (step: RoutineStep, warnings: string[], profile: Profile) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  openModal,
}) => {
  const isUser = sender === "user";
  const alignment = isUser ? "justify-end" : "justify-start";
  const bubbleClasses = isUser
    ? "bg-black text-white rounded-t-xl rounded-bl-xl"
    : "bg-white text-gray-800 rounded-t-xl rounded-br-xl shadow-md";

  const contentToRender =
    content && content.type === "routine" ? (
      <RoutineDisplay routine={content.data} openModal={openModal} />
    ) : content ? (
      content.data
    ) : (
      "..."
    );

  const avatar = isUser ? (
    <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-sm font-semibold">
      U
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center text-sm font-semibold">
      AI
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex ${alignment} w-full`}
    >
      {!isUser && avatar}
      {/* Conditional padding for routine display vs text */}
      <div
        className={`p-3 text-sm mx-2 ${bubbleClasses} ${
          content && content.type === "routine" ? "max-w-[95%]" : "max-w-[85%]"
        }`}
      >
        {contentToRender}
      </div>
      {isUser && avatar}
    </motion.div>
  );
};
export default ChatBubble;

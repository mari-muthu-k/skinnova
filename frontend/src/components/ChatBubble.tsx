import { motion } from "framer-motion";
import RoutineDisplay from "./RoutineDisplay";
import type { Message, Profile, RoutineStep } from "../entities/types";

interface ChatBubbleProps extends Message {
  openModal: (step: RoutineStep, warnings: string[], profile: Profile) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  openModal,
}) => {
  const isUser = role === "human";
  const isRoutineContent = (typeof content === "object" && content.type === "routine");
  const alignment = isUser ? "justify-end" : "justify-start";
  const bubbleClasses = isUser
    ? "bg-black text-white rounded-t-xl rounded-bl-xl"
    : "bg-white text-gray-800 rounded-t-xl rounded-br-xl shadow-md";

  const contentToRender = isRoutineContent ? 
            <RoutineDisplay routine={content.data} openModal={openModal} />: (
            content ? content.toString() : "...");

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
          isRoutineContent ? "max-w-[95%]" : "max-w-[85%]"
        }`}
      >
        {contentToRender}
      </div>
      {isUser && avatar}
    </motion.div>
  );
};
export default ChatBubble;

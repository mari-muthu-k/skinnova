import { motion } from "framer-motion";
import RoutineDisplay from "./RoutineDisplay";
import type { Message, Profile, RoutineStep } from "../entities/types";
import { datadogRum } from "@datadog/browser-rum";

interface ChatBubbleProps extends Message {
  openModal: (step: RoutineStep, warnings: string[], profile: Profile) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  openModal,
}) => {
  const isUser = role === "human";

  const contentStr = content?.toString() || "";

  const textPart = contentStr.split("```json")[0].trim();

  let routinePayload: any = null;
  let normalizedRoutine: any = null;

  const jsonMatch = contentStr.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed?.type === "routine") {
        routinePayload = parsed;
      }
    } catch (err) {
      console.error("Failed to parse routine JSON", err);
      datadogRum.addAction("routine_generation_failed", {
        reason: "llm_timeout",
        fallbackUsed: true,
      });
    }
  }
  if (routinePayload) {
    normalizedRoutine = {
      profile: routinePayload.data.profile,
      warnings: routinePayload.warnings || [],
      morning_routine: routinePayload.morning_routine || [],
      evening_routine: routinePayload.evening_routine || [],
      night_routine: routinePayload.night_routine || [],
    };
  }

  const alignment = isUser ? "justify-end" : "justify-start";
  const bubbleClasses = isUser
    ? "bg-black text-white rounded-t-xl rounded-bl-xl"
    : "bg-white text-gray-800 rounded-t-xl rounded-br-xl shadow-md";

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
    <>
      {textPart && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`flex ${alignment} w-full`}
        >
          {!isUser && avatar}

          <div className={`p-3 text-sm mx-2 ${bubbleClasses} max-w-[85%]`}>
            {textPart}
          </div>

          {isUser && avatar}
        </motion.div>
      )}

      {routinePayload && (
        <RoutineDisplay routine={normalizedRoutine} openModal={openModal} />
      )}
    </>
  );
};

export default ChatBubble;

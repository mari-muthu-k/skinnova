import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  Message,
  MessageContent,
  Profile,
  RoutineStep,
  TextContent,
} from "./entities/types";
import { mockRoutineResponse } from "./mocks/routineData";
import ChatbotScreen from "./components/ChatbotScreen";
import LandingScreen from "./components/LandingScreen";
import RoutineDetailModal from "./components/RoutineDetailModal";

const App: React.FC = () => {
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [landingInput, setLandingInput] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStepDetail, setSelectedStepDetail] =
    useState<RoutineStep | null>(null);
  const [currentWarnings, setCurrentWarnings] = useState<string[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const openModal = (
    stepData: RoutineStep,
    warnings: string[],
    profile: Profile
  ) => {
    setSelectedStepDetail(stepData);
    setCurrentWarnings(warnings);
    setCurrentProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStepDetail(null);
    setCurrentWarnings([]);
    setCurrentProfile(null);
  };

  const handleStartChat = () => {
    if (!landingInput.trim()) return;

    const userMsg: Message = {
      sender: "user",
      content: { type: "text", data: landingInput },
    };
    setMessages([userMsg]);
    setLandingInput("");
    setInput("");
    setIsChatting(true);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: TextContent = {
        type: "text",
        data: "Welcome! Based on your general query, here is a recommended routine for Combination skin. Click on any step for details.",
      };

      setMessages((prev) => [...prev, { sender: "bot", content: botResponse }]);
      setIsTyping(false);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", content: mockRoutineResponse },
          ]);
          setIsTyping(false);
        }, 1500);
      }, 1000);
    }, 1500);
  };

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      sender: "user",
      content: { type: "text", data: input },
    };
    setMessages((prev) => [...prev, userMsg]);
    const userQuery = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const isRoutineQuery = userQuery.toLowerCase().includes("routine");
      let botContent: MessageContent;

      if (isRoutineQuery) {
        botContent = mockRoutineResponse;
      } else {
        botContent = {
          type: "text",
          data: "Thanks for your question! I'm ready to find your perfect routine. Ask me for a 'routine' to see the structured display and click the boxes for step details.",
        };
      }

      setMessages((prev) => [...prev, { sender: "bot", content: botContent }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 md:p-10 font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://placehold.co/1200x800/f5e3df/333?text=Skincare+Transformation+Background')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
        }}
      />

      <div className="relative w-full max-w-sm md:max-w-7xl bg-[#fafafa] rounded-3xl shadow-2xl border border-gray-200 overflow-hidden h-[95vh] transition z-20">
        <AnimatePresence mode="wait">
          {isChatting ? (
            <ChatbotScreen
              key="chat"
              messages={messages}
              isTyping={isTyping}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              openModal={openModal}
              chatRef={chatRef}
            />
          ) : (
            <LandingScreen
              key="landing"
              landingInput={landingInput}
              setLandingInput={setLandingInput}
              handleStartChat={handleStartChat}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <RoutineDetailModal
            step={selectedStepDetail}
            warnings={currentWarnings}
            profile={currentProfile}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

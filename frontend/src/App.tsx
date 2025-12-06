import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  Message,
  MessageContent,
  Profile,
  RoutineContent,
  RoutineData,
  RoutineStep,
  TextContent,
} from "./entities/types";
import ChatbotScreen from "./components/ChatbotScreen";
import LandingScreen from "./components/LandingScreen";
import RoutineDetailModal from "./components/RoutineDetailModal";

const mockRoutineData: RoutineData = {
  profile: {
    age: "22",
    skin_type: "Combination",
    concerns: ["Oiliness", "Dryness"],
  },
  warnings: [
    "Since you have combination skin, apply oil-control products only to your T-zone and hydrating products to dry cheeks.",
    "Patch test new products before full application.",
  ],
  morning_routine: [
    {
      step_number: 1,
      product_category: "Gentle Gel Cleanser",
      key_ingredients: ["Glycerin", "Panthenol"],
      usage_instructions:
        "Wash face with lukewarm water to remove night impurities without stripping moisture.",
      frequency: "daily",
    },
    {
      step_number: 2,
      product_category: "Serum",
      key_ingredients: ["Niacinamide", "Zinc"],
      usage_instructions:
        "Apply a few drops to the whole face to control oil and support the skin barrier.",
      frequency: "daily",
    },
    {
      step_number: 3,
      product_category: "Lightweight Gel-Cream",
      key_ingredients: ["Hyaluronic Acid", "Ceramides"],
      usage_instructions:
        "Apply a light layer to hydrate dry areas without making oily areas greasy.",
      frequency: "daily",
    },
    {
      step_number: 4,
      product_category: "Sunscreen SPF 30+",
      key_ingredients: ["Non-comedogenic filters"],
      usage_instructions:
        "Apply generously as the final step before makeup or going out.",
      frequency: "daily",
    },
  ],
  evening_routine: [
    {
      step_number: 1,
      product_category: "Micellar Water or Oil Cleanser",
      key_ingredients: ["Grape Seed Oil", "Jojoba Oil"],
      usage_instructions: "Gently remove sunscreen and sebum buildup.",
      frequency: "daily",
    },
    {
      step_number: 2,
      product_category: "Water-Based Foaming Cleanser",
      key_ingredients: ["Salicylic Acid (low concentration)"],
      usage_instructions: "Wash face thoroughly to clean pores.",
      frequency: "daily",
    },
    {
      step_number: 3,
      product_category: "BHA Toner",
      key_ingredients: ["Salicylic Acid"],
      usage_instructions:
        "Apply ONLY to the oily T-zone (forehead, nose, chin) with a cotton pad.",
      frequency: "2-3 times a week",
    },
  ],
  night_routine: [
    {
      step_number: 1,
      product_category: "Hydrating Serum",
      key_ingredients: ["Hyaluronic Acid", "Polyglutamic Acid"],
      usage_instructions: "Apply to damp skin to combat dryness on the cheeks.",
      frequency: "daily",
    },
    {
      step_number: 2,
      product_category: "Barrier Repair Moisturizer",
      key_ingredients: ["Ceramides", "Squalane"],
      usage_instructions:
        "Apply a slightly thicker layer to dry cheeks and a thin layer to the T-zone before sleep.",
      frequency: "daily",
    },
  ],
};

const mockRoutineResponse: RoutineContent = {
  type: "routine",
  data: mockRoutineData,
};

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

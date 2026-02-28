import type { ReactElement } from "react";
import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import EmptyStateImg from "../../assets/undraw_open_note_cgre 1.png";

type MessageTab = "all" | "sent" | "received";

interface Message {
  id: string;
  type: "sent" | "received";
  sender?: string;
  recipient?: string;
  content: string;
  time: string;
  date: string;
}

export default function Messaging(): ReactElement {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MessageTab>("all");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "received",
      sender: "Admin",
      content: "Lorem ipsum dolor sit amet consectetur. Donec nec a eget facilisis. Et condimentum ultricies sem dui viverra scelerisque. Quisque ligula dui amet gravida habitasse cursus etiam enim integer. Adipiscing diam sed faucibus egestas nunc urna faucibus.",
      time: "2:00PM",
      date: "Yesterday",
    },
    {
      id: "2",
      type: "sent",
      recipient: "Admin",
      content: "Lorem ipsum dolor sit amet consectetur. Donec nec a eget facilisis. Et condimentum ultricies sem dui viverra scelerisque. Quisque ligula dui amet gravida habitasse cursus etiam enim integer. Adipiscing diam sed faucibus egestas nunc urna faucibus.",
      time: "Just now",
      date: "Today",
    },
    {
      id: "3",
      type: "received",
      sender: "Admin",
      content: "Reminder: Staff meeting scheduled for tomorrow at 9:00 AM.",
      time: "9:15AM",
      date: "Today",
    },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);

  const receiverOptions = ["School Admin", "Specific Teacher"];

  const teachers = [
    "Mr. Adebayo",
    "Mrs. Okonkwo",
    "Mr. Ibrahim",
    "Mrs. Salami",
    "Mr. Chukwu",
    "Mrs. Afolabi",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setTeacherDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (!selectedReceiver) {
      alert("Please select a receiver");
      return;
    }
    if (selectedReceiver === "Specific Teacher" && !selectedTeacher) {
      alert("Please select a teacher");
      return;
    }
    if (messageText.trim() === "") {
      alert("Please write a message");
      return;
    }

    const recipientName = selectedReceiver === "Specific Teacher" && selectedTeacher
      ? selectedTeacher
      : "Admin";

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "sent",
      recipient: recipientName,
      content: messageText,
      time: "Just now",
      date: "Today",
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    setSelectedReceiver(null);
    setSelectedTeacher(null);
    setActiveTab("sent");
    alert("Message sent successfully!");
  };

  const getFilteredMessages = (): Message[] => {
    switch (activeTab) {
      case "sent":
        return messages.filter((msg) => msg.type === "sent");
      case "received":
        return messages.filter((msg) => msg.type === "received");
      case "all":
      default:
        return messages;
    }
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: Record<string, Message[]> = {};
    msgs.forEach((msg) => {
      if (!groups[msg.date]) groups[msg.date] = [];
      groups[msg.date].push(msg);
    });
    return groups;
  };

  const filteredMessages = getFilteredMessages();
  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-semibold">Messaging</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="bg-white rounded-xl shadow p-4 lg:col-span-1">
          <div style={{ backgroundColor: "#D9D9D9", width: "100%", height: "56px", borderRadius: "4px", padding: "10px", gap: "10px" }} className="font-semibold flex items-center justify-center mb-4">Write A New Message</div>

          <label className="text-sm text-gray-700">Send Message To</label>
          <div className="relative mt-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-white rounded-md border px-3 h-11 flex items-center text-left focus:outline-none focus:ring-2 focus:ring-green"
            >
              <span className={`text-sm ${selectedReceiver ? "text-gray-900" : "text-gray-500"}`}>
                {selectedReceiver || "Select receiver"}
              </span>
              <span className="ml-auto text-gray-400">▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {receiverOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSelectedReceiver(option); setDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green hover:text-white transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedReceiver === "Specific Teacher" && (
            <>
              <label className="text-sm text-gray-700 mt-4 block">Select teacher</label>
              <div className="relative mt-2" ref={teacherDropdownRef}>
                <button
                  onClick={() => setTeacherDropdownOpen(!teacherDropdownOpen)}
                  className="w-full bg-white rounded-md border px-3 h-11 flex items-center text-left focus:outline-none focus:ring-2 focus:ring-green"
                >
                  <span className={`text-sm ${selectedTeacher ? "text-gray-900" : "text-gray-500"}`}>
                    {selectedTeacher || "Enter teacher name"}
                  </span>
                  <span className="ml-auto text-gray-400">▾</span>
                </button>

                {teacherDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {teachers.map((teacher) => (
                      <button
                        key={teacher}
                        onClick={() => { setSelectedTeacher(teacher); setTeacherDropdownOpen(false); }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green hover:text-white transition-colors"
                      >
                        {teacher}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <textarea
            className="mt-4 w-full h-40 bg-white rounded-md border p-3 text-sm"
            placeholder="Write your message here"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{messageText.length} Character</span>
            <span>📎</span>
          </div>

          <button
            onClick={handleSendMessage}
            className="mt-4 bg-green text-white rounded-md h-10 px-5 text-sm hover:opacity-90 transition-opacity"
          >
            Send message
          </button>
        </div>

        {/* Right panel */}
        <div className="bg-white rounded-xl shadow p-4 lg:col-span-2">
          <div className="flex gap-2 mb-6">
            {(["all", "sent", "received"] as MessageTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-green text-white"
                    : "bg-white border text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab === "all" ? "All Message" : tab === "sent" ? "Sent Message" : "Received Message"}
              </button>
            ))}
          </div>

          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <img src={EmptyStateImg} alt="No messages" className="w-72 h-auto mb-4" loading="lazy" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">{date}</h3>
                  <div className="space-y-3">
                    {msgs.map((message) => (
                      <div key={message.id}>
                        {message.type === "received" ? (
                          <div className="bg-white border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-gray-900">From {message.sender}</span>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">👤</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 leading-relaxed">{message.content}</p>
                                <div className="flex justify-end mt-2">
                                  <Check size={16} className="text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green text-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold">To {message.recipient}</span>
                              <span className="text-xs">{message.time}</span>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">👤</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <div className="flex justify-end mt-2">
                                  <Check size={16} className="text-white opacity-70" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

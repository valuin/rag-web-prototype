import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { ScrollArea } from "@/components/scroll-area";
import {
  RiCodeSSlashLine,
  RiShareLine,
  RiShareCircleLine,
  RiShining2Line,
  RiAttachment2,
  RiMicLine,
  RiLeafLine,
} from "@remixicon/react";
import { ChatMessage } from "@/components/chat-message";
import { MessageLoading } from "@/components/ui/message-loading";
import { useEffect, useRef, useState } from "react";
import { ChatMarkdown } from "@/components/chat-markdown";
import { getModeCopy, resolveBotKey } from "@/components/chat-config";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

const streamText = async (
  text: string,
  onUpdate: (partial: string) => void,
  chunkSize = 24,
  delay = 35
) => {
  let acc = "";
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    acc += chunk;
    onUpdate(acc);
    await new Promise((r) => setTimeout(r, delay));
  }
};

export default function Chat({
  mode,
  messages,
  setMessages,
}: {
  mode: string;
  messages: Message[];
  setMessages: (newMessages: Message[]) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamChunkCount, setStreamChunkCount] = useState(0);
  const [showExamples, setShowExamples] = useState(false);

  const { welcome, examples } = getModeCopy(mode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) return;

    setIsLoading(true);
    const aiId = 1;
    setMessages([{ id: aiId, text: "", isUser: false }]);
    setStreamChunkCount(0);

    streamText(welcome, (partial) => {
      setStreamChunkCount((c) => c + 1);
      setMessages([{ id: aiId, text: partial, isUser: false }]);
    }).then(() => {
      setStreamChunkCount(0);
      setIsLoading(false);
      setShowExamples(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, welcome]);

  const handleSuggestionClick = (q: string) => {
    if (isLoading) return;
    // Directly send using the clicked example text to avoid relying on async state
    setShowExamples(false);
    void handleSendMessageWithText(q);
  };

  // Internal helper to send a specific text (used by suggestion click)
  const handleSendMessageWithText = async (text: string) => {
    if (text.trim() === "") return;

    setIsLoading(true);
    const userMessage: Message = {
      id: messages.length + 1,
      text,
      isUser: true,
    };
    const messagesAfterUser = [...messages, userMessage];
    setMessages(messagesAfterUser);

    const userInput = text;
    setInput("");

    try {
      const bot_app_key = resolveBotKey(mode);

      const requestBody = {
        content: userInput,
        bot_app_key,
        visitor_biz_id: "71f98ce2-fe7b-4c5e-aeb1-38bd87cc4dfd",
        session_id: "71f98ce2-fe7b-4c5e-aeb1-38bd87cc4dfd",
        visitor_labels: [],
      };

      const response = await fetch(
        "https://wss.lke.tencentcloud.com/v1/qbot/chat/sse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponseContent = "";
      const aiMessageId = messagesAfterUser.length + 1;

      const messagesAfterAIPlaceholder = [
        ...messagesAfterUser,
        { id: aiMessageId, text: "", isUser: false },
      ];
      setMessages(messagesAfterAIPlaceholder);
      setStreamChunkCount(0);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value);
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let currentEvent = "";
          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();

              if (currentEvent === "reply") {
                try {
                  const data = JSON.parse(dataStr);
                  if (data.payload?.content !== undefined) {
                    aiResponseContent = data.payload.content;
                    setStreamChunkCount((prev) => prev + 1);
                    setMessages(
                      messagesAfterAIPlaceholder.map((msg) =>
                        msg.id === aiMessageId
                          ? { ...msg, text: aiResponseContent }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  console.error("Failed to parse SSE reply event:", e);
                }
              }
            } else if (line.trim() === "") {
              currentEvent = "";
            }
          }
        }
      }

      setStreamChunkCount(0);

      if (aiResponseContent === "") {
        const updatedMessages = messagesAfterAIPlaceholder.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: "No response received from the server." }
            : msg
        );
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setMessages([
        ...messagesAfterUser,
        {
          id: messagesAfterUser.length + 1,
          text:
            "Error: Unable to get a response. Details: " +
            (error instanceof Error ? error.message : String(error)),
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      if (messages.every((m) => !m.isUser)) {
        setShowExamples(true);
      }
    }
  };

  // Preserve Enter/Send button behavior by delegating to the helper with current input
  const handleSendMessage = async () => {
    await handleSendMessageWithText(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="py-5 bg-background sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
          <div className="flex items-center justify-between gap-2">
            <Breadcrumb>
              <BreadcrumbList className="sm:gap-1.5">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Playground</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-1 -my-2 -me-2">
              <Button variant="ghost" className="px-2">
                <RiCodeSSlashLine
                  className="text-muted-foreground sm:text-muted-foreground/70 size-5"
                  size={20}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Code</span>
              </Button>
              <Button variant="ghost" className="px-2">
                <RiShareLine
                  className="text-muted-foreground sm:text-muted-foreground/70 size-5"
                  size={20}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Share</span>
              </Button>
              <Button variant="ghost" className="px-2">
                <RiShareCircleLine
                  className="text-muted-foreground sm:text-muted-foreground/70 size-5"
                  size={20}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Export</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Chat */}
        <div className="relative grow">
          <div className="max-w-3xl mx-auto mt-6 space-y-6">
            <div className="text-center my-8">
              <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                <RiShining2Line
                  className="me-1.5 text-muted-foreground/70 -ms-1"
                  size={14}
                  aria-hidden="true"
                />
                Today
              </div>
            </div>

            {/* Example question suggestions (only when no user messages yet) */}
            {showExamples && messages.every((m) => !m.isUser) && (
              <div className="max-w-3xl mx-auto -mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {examples.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSuggestionClick(q)}
                      className="text-left rounded-xl border border-black/10 bg-white hover:bg-muted px-4 py-3 text-sm transition-colors shadow-xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <ChatMessage key={message.id} isUser={message.isUser}>
                {message.isUser ? (
                  <p>{message.text}</p>
                ) : isLoading && index === messages.length - 1 && streamChunkCount < 3 ? (
                  <MessageLoading />
                ) : (
                  <ChatMarkdown>{message.text}</ChatMarkdown>
                )}
              </ChatMessage>
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>
        {/* Footer */}
        <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
          <div className="max-w-3xl mx-auto bg-background rounded-[20px] pb-4 md:pb-8">
            <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
              <textarea
                className="flex sm:min-h-[84px] w-full bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none]"
                placeholder="Ask me anything..."
                aria-label="Enter your prompt"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              {/* Textarea buttons */}
              <div className="flex items-center justify-between gap-2 p-3">
                {/* Left buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <RiAttachment2
                      className="text-muted-foreground/70 size-5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Attach</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <RiMicLine
                      className="text-muted-foreground/70 size-5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Audio</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <RiLeafLine
                      className="text-muted-foreground/70 size-5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Action</span>
                  </Button>
                </div>
                {/* Right buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                    >
                      <g clipPath="url(#icon-a)">
                        <path
                          fill="url(#icon-b)"
                          d="m8 .333 2.667 5 5 2.667-5 2.667-2.667 5-2.667-5L.333 8l5-2.667L8 .333Z"
                        />
                        <path
                          stroke="#451A03"
                          strokeOpacity=".04"
                          d="m8 1.396 2.225 4.173.072.134.134.071L14.604 8l-4.173 2.226-.134.071-.072.134L8 14.604l-2.226-4.173-.071-.134-.134-.072L1.396 8l4.173-2.226.134-.071.071-.134L8 1.396Z"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="icon-b"
                          x1="8"
                          x2="8"
                          y1=".333"
                          y2="15.667"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FDE68A" />
                          <stop offset="1" stopColor="#F59E0B" />
                        </linearGradient>
                        <clipPath id="icon-a">
                          <path fill="#fff" d="M0 0h16v16H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="sr-only">Generate</span>
                  </Button>
                  <Button
                    className="rounded-full h-8"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
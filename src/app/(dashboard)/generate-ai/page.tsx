"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function GenerateAIBusinessPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Fake AI response for now (replace with API later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Here’s an AI-generated business idea for: "${userMessage.content}" 🚀`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.50",
      }}
    >
      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Avatar
              src="/logo.svg"
              alt="Suhulat"
              sx={{ width: 400, height: 80 }}
              variant="square"
            />
            <Typography variant="h6" fontWeight="bold">
              Suhulat AI Business
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={320}>
              Ask Suhulat AI to generate innovative business ideas and insights
              tailored for you.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "75%",
                  bgcolor: msg.role === "user" ? "#0053FF" : "grey.200",
                  color: msg.role === "user" ? "white" : "black",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-line", fontSize: "0.9rem" }}
                >
                  {msg.content}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        <div ref={chatEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 2,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your business idea..."
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

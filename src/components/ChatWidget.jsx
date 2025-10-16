"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Minimize2, Maximize2, ChevronDown, ChevronUp } from "lucide-react"
import { API_CONFIG, buildChatPayload } from "../config/api"
import SQLCodeBlock from "./SQLCodeBlock"
import ChartView from "./ChartView"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hello! How can I assist you with claims analysis today?",
      thinking: "",
      sql: "",
      chart: null,
      isStreaming: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const parseStreamEvent = (line) => {
    if (line.startsWith("event:")) {
      return { event: line.substring(6).trim(), data: null }
    }
    if (line.startsWith("data:")) {
      try {
        const jsonStr = line.substring(5).trim()
        return { event: "data", data: JSON.parse(jsonStr) }
      } catch (e) {
        return null
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue.trim(),
      thinking: "",
      sql: "",
      chart: null,
      isStreaming: false,
    }

    setMessages((prev) => [...prev, userMessage])

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content: "",
      thinking: "",
      sql: "",
      chart: null,
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      await streamResponse(assistantMessage.id, userMessage.content)
    } catch (error) {
      console.error("Streaming error:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "Error occurred while processing your request.",
                isStreaming: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const streamResponse = async (messageId, userInput) => {
    const payload = buildChatPayload(userInput)
    const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CORTEX}`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("No response body")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    let currentEvent = ""
    let streamingThinking = ""
    let streamingText = ""
    let sqlContent = ""
    let finalThinking = ""
    let finalText = ""
    let chartSpec = null

    let isReading = true

    while (isReading) {
      const { done, value } = await reader.read()
      if (done) {
        isReading = false
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue

        const parsed = parseStreamEvent(trimmedLine)
        if (!parsed) continue

        if (parsed.event !== "data") {
          currentEvent = parsed.event
          continue
        }

        const data = parsed.data

        switch (currentEvent) {
          case "response.thinking.delta":
            if (data.text) {
              streamingThinking += data.text
              setMessages((prev) =>
                prev.map((msg) => (msg.id === messageId ? { ...msg, thinking: streamingThinking } : msg)),
              )
            }
            break

          case "response.thinking":
            finalThinking = data.text
            break

          case "response.tool_result":
            if (data.content?.[0]?.json?.sql) {
              sqlContent = data.content[0].json.sql
            }
            if (data.content?.[0]?.json?.charts && data.content[0].json.charts.length > 0) {
              chartSpec = data.content[0].json.charts[0]
              setMessages((prev) =>
                prev.map((msg) => (msg.id === messageId ? { ...msg, chart: chartSpec, sql: sqlContent } : msg)),
              )
            }
            break

          case "response.text.delta":
            if (data.text) {
              streamingText += data.text
              setMessages((prev) =>
                prev.map((msg) => (msg.id === messageId ? { ...msg, content: streamingText, sql: sqlContent } : msg)),
              )
            }
            break

          case "response.text":
            if (data.text) {
              if (finalText.length > 0) {
                finalText += "\n"
              }
              finalText += data.text
            }
            break

          case "response":
            if (data.content) {
              const thinkingContent = data.content.find((item) => item.type === "thinking")
              const textContent = data.content.find((item) => item.type === "text")
              const chartContent = data.content.find((item) => item.type === "chart")

              if (chartContent?.chart?.chart_spec) {
                chartSpec = chartContent.chart.chart_spec
              }
              

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === messageId
                    ? {
                        ...msg,
                        thinking: thinkingContent?.thinking?.text || finalThinking,
                        content: finalText,
                        sql: sqlContent,
                        chart: chartSpec,
                        isStreaming: false,
                      }
                    : msg,
                ),
              )
            }
            return

          case "done":
            return
        }

        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-blue-200 ${
              isExpanded ? "w-[50vw] h-[calc(100vh-8rem)]" : "w-[480px] h-[650px]"
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            layout
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Claims Assistant</h4>
                  <p className="text-sm text-blue-100">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-5 bg-white border-t border-slate-200">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-5 py-3 bg-slate-100 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!isOpen ? { y: [0, -10, 0] } : {}}
        transition={!isOpen ? { repeat: Number.POSITIVE_INFINITY, duration: 2 } : {}}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </>
  )
}

function MessageBubble({ message }) {
  const [detailsOpen, setDetailsOpen] = useState(true)

  if (message.type === "user") {
    return (
      <motion.div className="flex justify-end" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <p className="text-base leading-relaxed">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="flex justify-start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="max-w-[90%] bg-white border border-slate-200 rounded-2xl shadow-md p-4 space-y-3">
        {/* Thinking Section */}
        {message.thinking && (
          <div className="border rounded-lg p-3 bg-gray-50">
            {message.isStreaming && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Thinking...</span>
              </div>
            )}
            {!message.isStreaming && (
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {detailsOpen ? "Hide Details" : "Show Details"}
              </button>
            )}
            {detailsOpen && (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{message.thinking}</p>
            )}
          </div>
        )}

        {/* SQL Section */}
        {message.sql && <SQLCodeBlock code={message.sql} />}

        {/* Content Section */}
        {message.content && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {/* Chart Section */}
        {message.chart && <ChartView chartSpec={message.chart} />}
      </div>
    </motion.div>
  )
}

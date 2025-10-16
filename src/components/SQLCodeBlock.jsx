"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"

export default function SQLCodeBlock({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white relative my-4">
      <div className="bg-gray-100 px-3 py-2 text-sm font-semibold border-b flex justify-between items-center">
        <span className="inline-block bg-blue-50 text-blue-700 border border-blue-300 px-3 py-1 rounded-md text-xs font-medium">
          Generated SQL
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
          title={copied ? "Copied!" : "Copy SQL"}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      <SyntaxHighlighter
        language="sql"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
          padding: "1rem",
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

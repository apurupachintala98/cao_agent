"use client"
import { motion } from "framer-motion"
import { BarChart3, AlertCircle, Brain, GitBranch, Settings } from "lucide-react"

const menuItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "denied-yet-paid", label: "Denied Yet Paid", icon: AlertCircle },
  { id: "denied-yet-paid-ai", label: "Denied Yet Paid Agentic AI", icon: Brain },
  { id: "taxonomy", label: "Taxonomy Mismatches", icon: GitBranch },
  { id: "coc-modifier", label: "CoC Modifier AD Model", icon: Settings },
]

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <motion.aside
      className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <motion.div className="flex items-center justify-center mb-8" whileHover={{ scale: 1.02 }}>
          <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
        </motion.div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/50"
                    : "hover:bg-slate-700/50"
                }`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium text-left">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <motion.div
          className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-slate-400 mb-1">Report Refresh Date</p>
          <p className="text-sm font-semibold">8/31/2025</p>
        </motion.div>
      </div>
    </motion.aside>
  )
}

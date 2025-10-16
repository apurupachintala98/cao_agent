"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import ClaimsTable from "./components/ClaimsTable"
import FilterModal from "./components/FilterModal"
import ChatWidget from "./components/ChatWidget"

function App() {
  const [activeView, setActiveView] = useState("denied-yet-paid-ai")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: { start: "2024-03-01", end: "2025-04-05" },
    excdCode: "All",
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header filters={filters} setFilters={setFilters} onOpenFilters={() => setIsFilterModalOpen(true)} />

        <motion.main
          className="flex-1 overflow-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ClaimsTable />
        </motion.main>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <ChatWidget />
    </div>
  )
}

export default App

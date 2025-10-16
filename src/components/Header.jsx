"use client"
import { motion } from "framer-motion"
import { Filter, Calendar, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function Header({ filters, setFilters, onOpenFilters }) {
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  return (
    <motion.header
      className="bg-white border-b border-slate-200 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3">
        <h1 className="text-xl font-bold">Claims Analysis and Optimization (CAO)</h1>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Facets Denied Yet Paid Agentic AI</h3>
          </div>

          <motion.button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Advanced Filters</span>
          </motion.button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Utilize ExCD codes to pinpoint claims that were paid by Elevance but should have been denied, highlighting
          projected savings and improving financial outcomes.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Paid Date Range:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })
                  }
                  className="w-32 bg-transparent text-sm font-medium text-slate-900 outline-none cursor-pointer"
                />
              </div>
              <span className="text-slate-400">-</span>
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                  className="w-32 bg-transparent text-sm font-medium text-slate-900 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">EXCD Code:</span>
            <div className="relative">
              <select
                value={filters.excdCode}
                onChange={(e) => setFilters({ ...filters, excdCode: e.target.value })}
                className="appearance-none px-4 py-1.5 pr-8 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <option>All</option>
                <option>UM0</option>
                <option>UM1</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

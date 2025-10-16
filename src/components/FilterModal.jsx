"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter } from "lucide-react"

const filterOptions = [
  { id: "adjdctnTypeCode", label: "Adjdctn Type Code", type: "select", options: ["All", "Type A", "Type B"] },
  { id: "adjdctnTypeName", label: "Adjdctn Type Name", type: "select", options: ["All", "Name 1", "Name 2"] },
  { id: "allowedAmount", label: "Allowed Amount", type: "range" },
  { id: "allowedUnitCount", label: "Allowed Unit Count", type: "range" },
  { id: "billedChargedAmount", label: "Billed Charged Amount", type: "range" },
  { id: "billingProviderNPI", label: "Billing Provider NPI", type: "text" },
  { id: "billingTaxID", label: "Billing Tax ID", type: "text" },
  {
    id: "claimCurrentStatus",
    label: "Claim Current Status",
    type: "select",
    options: ["All", "Paid", "Denied", "Pending"],
  },
  { id: "claimLineNumber", label: "Claim Line Number", type: "text" },
]

export default function FilterModal({ isOpen, onClose, filters, setFilters }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 shadow-lg z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Advanced Filters</h3>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-blue-100">Refine your claims analysis</p>
            </div>

            <div className="p-6 space-y-6">
              {filterOptions.map((filter, index) => (
                <motion.div
                  key={filter.id}
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <label className="block text-sm font-semibold text-slate-700">{filter.label}</label>

                  {filter.type === "select" && (
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      {filter.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {filter.type === "text" && (
                    <input
                      type="text"
                      placeholder={`Enter ${filter.label.toLowerCase()}`}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  )}

                  {filter.type === "range" && (
                    <div className="space-y-2">
                      <input type="range" className="w-full accent-blue-600" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Min</span>
                        <span>Max</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              <div className="flex gap-3 pt-4">
                <motion.button
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

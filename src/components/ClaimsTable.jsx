"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

const mockData = [
  {
    disallowedCode: "UM0",
    claimNumber: "288564121300",
    claimLineNumber: "1",
    paidAmount: "$14.72",
    allowedAmount: "$14.72",
    allowedUnitCount: "0",
    disallowedAmount: "$150.28",
    billedChargedAmount: "$165.00",
    claimLineServiceStartDate: "3/4/2025",
    latestDate: "3/4/2025",
  },
  {
    disallowedCode: "UM0",
    claimNumber: "288564121300",
    claimLineNumber: "2",
    paidAmount: "$14.72",
    allowedAmount: "$14.72",
    allowedUnitCount: "0",
    disallowedAmount: "$150.28",
    billedChargedAmount: "$165.00",
    claimLineServiceStartDate: "3/5/2025",
    latestDate: "3/5/2025",
  },
  {
    disallowedCode: "UM0",
    claimNumber: "288941278100",
    claimLineNumber: "1",
    paidAmount: "$169.20",
    allowedAmount: "$169.20",
    allowedUnitCount: "0",
    disallowedAmount: "$1,040.80",
    billedChargedAmount: "$1,210.00",
    claimLineServiceStartDate: "1/7/2025",
    latestDate: "1/7/2025",
  },
  {
    disallowedCode: "UM0",
    claimNumber: "288941501800",
    claimLineNumber: "1",
    paidAmount: "$114.85",
    allowedAmount: "$114.85",
    allowedUnitCount: "0",
    disallowedAmount: "$505.15",
    billedChargedAmount: "$620.00",
    claimLineServiceStartDate: "1/10/2025",
    latestDate: "1/10/2025",
  },
  {
    disallowedCode: "UM0",
    claimNumber: "288955512900",
    claimLineNumber: "1",
    paidAmount: "$87.65",
    allowedAmount: "$87.65",
    allowedUnitCount: "0",
    disallowedAmount: "$212.35",
    billedChargedAmount: "$300.00",
    claimLineServiceStartDate: "2/26/2025",
    latestDate: "2/26/2025",
  },
  {
    disallowedCode: "UM1",
    claimNumber: "288498491200",
    claimLineNumber: "3",
    paidAmount: "$5,270.00",
    allowedAmount: "$5,270.00",
    allowedUnitCount: "0",
    disallowedAmount: "$3,400.00",
    billedChargedAmount: "$8,670.00",
    claimLineServiceStartDate: "2/1/2025",
    latestDate: "2/20/2025",
  },
  {
    disallowedCode: "UM1",
    claimNumber: "288844533300",
    claimLineNumber: "2",
    paidAmount: "$110.94",
    allowedAmount: "$110.94",
    allowedUnitCount: "0",
    disallowedAmount: "$1,889.06",
    billedChargedAmount: "$2,000.00",
    claimLineServiceStartDate: "3/9/2025",
    latestDate: "3/9/2025",
  },
  {
    disallowedCode: "UM1",
    claimNumber: "288870476100",
    claimLineNumber: "1",
    paidAmount: "$65.00",
    allowedAmount: "$65.00",
    allowedUnitCount: "0",
    disallowedAmount: "$0.00",
    billedChargedAmount: "$65.00",
    claimLineServiceStartDate: "3/11/2025",
    latestDate: "3/11/2025",
  },
]

export default function ClaimsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const filteredData = mockData.filter((row) =>
    Object.values(row).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <tr>
              {[
                { key: "disallowedCode", label: "Disallowed Code" },
                { key: "claimNumber", label: "Claim Number" },
                { key: "claimLineNumber", label: "Claim Line Number" },
                { key: "paidAmount", label: "Paid Amount" },
                { key: "allowedAmount", label: "Allowed Amount" },
                { key: "allowedUnitCount", label: "Allowed Unit Count" },
                { key: "disallowedAmount", label: "Disallowed Amount" },
                { key: "billedChargedAmount", label: "Billed Charged Amount" },
                { key: "claimLineServiceStartDate", label: "ClaimLine Service Start Date" },
                { key: "latestDate", label: "Latest Date" },
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-700/50 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredData.map((row, index) => (
              <motion.tr
                key={index}
                className="hover:bg-blue-50/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">{row.disallowedCode}</span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.claimNumber}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.claimLineNumber}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">{row.paidAmount}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.allowedAmount}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.allowedUnitCount}</td>
                <td className="px-4 py-3 text-sm font-semibold text-red-600">{row.disallowedAmount}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.billedChargedAmount}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.claimLineServiceStartDate}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.latestDate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

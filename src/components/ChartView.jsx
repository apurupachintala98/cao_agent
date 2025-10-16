"use client"

import { useState } from "react"
import { VegaLite } from "react-vega"
import { Download } from "lucide-react"

export default function ChartView({ chartSpec }) {
  const [activeTab, setActiveTab] = useState("chart")

  if (!chartSpec) return null

  let parsedSpec
  try {
    parsedSpec = typeof chartSpec === "string" ? JSON.parse(chartSpec) : chartSpec
  } catch (e) {
    console.error("Failed to parse chart spec:", e)
    return null
  }

  const chartData = parsedSpec?.data?.values || []
  const chartFields = chartData.length > 0 ? Object.keys(chartData[0]) : []

  // Adjust chart size
  parsedSpec.autosize = { type: "fit", contains: "padding" }
  parsedSpec.width = "container"

  const downloadCSV = () => {
    const csvRows = []
    csvRows.push(chartFields.join(","))
    chartData.forEach((row) => {
      const values = chartFields.map((field) => `"${row[field]}"`)
      csvRows.push(values.join(","))
    })
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chart-data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === "chart"
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === "table"
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Table
          </button>
        </div>
        {activeTab === "table" && chartData.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        )}
      </div>

      {/* Chart View */}
      {activeTab === "chart" && (
        <div className="w-full overflow-x-auto">
          <VegaLite spec={parsedSpec} actions={false} />
        </div>
      )}

      {/* Table View */}
      {activeTab === "table" && chartData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                {chartFields.map((field) => (
                  <th key={field} className="text-left px-3 py-2 border-b font-semibold text-gray-700">
                    {field.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {chartFields.map((field) => (
                    <td key={field} className="px-3 py-2 border-b text-gray-600">
                      {row[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

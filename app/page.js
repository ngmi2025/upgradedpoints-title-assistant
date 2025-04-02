// app/page.js

"use client"

import { useState } from "react"

export default function Home() {
  const [title, setTitle] = useState("")
  const [charLimit, setCharLimit] = useState(63)
  const [results, setResults] = useState([])

  const handleSubmit = async () => {
    setResults([])

    const res = await fetch("/api/generate-titles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, charLimit })
    })

    const data = await res.json()
    if (data?.titles) {
      // sort by score descending
      const sorted = data.titles.sort((a, b) => b.score - a.score)
      setResults(sorted)
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>UpgradedPoints Title Assistant</h1>

      <input
        type="text"
        placeholder="Enter a title idea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", width: "100%", maxWidth: "500px", marginBottom: "10px" }}
      />

      <div>
        <label>
          <input
            type="radio"
            checked={charLimit === 63}
            onChange={() => setCharLimit(63)}
          />
          63 Characters
        </label>
        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            checked={charLimit === 100}
            onChange={() => setCharLimit(100)}
          />
          100 Characters
        </label>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "8px 16px", fontSize: "16px" }}>
        Generate Titles
      </button>

      {results.length > 0 && (
        <table style={{ marginTop: "30px", borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Title</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Length</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Score</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "8px" }}>{r.title}</td>
                <td style={{ padding: "8px" }}>{r.length}</td>
                <td style={{ padding: "8px" }}>{r.score}</td>
                <td style={{ padding: "8px" }}>
                  <button onClick={() => navigator.clipboard.writeText(r.title)}>📋</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

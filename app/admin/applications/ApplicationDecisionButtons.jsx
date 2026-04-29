"use client"

import { useState } from "react"

export default function ApplicationDecisionButtons({ applicationId }) {
  const [loading, setLoading] = useState(false)
  const [denialReason, setDenialReason] = useState("")
  const [showDenyBox, setShowDenyBox] = useState(false)

  async function handleDecision(status) {
    if (status === "denied" && !denialReason.trim()) {
      alert("Please enter a denial reason.")
      return
    }

    setLoading(true)

    const res = await fetch(`/api/applications/${applicationId}/decision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        denialReason,
      }),
    })

    const data = await res.json()

    setLoading(false)

    if (!res.ok) {
      alert(data.error || "Something went wrong.")
      return
    }

    alert(data.message || "Application updated.")
    window.location.reload()
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => handleDecision("accepted")}
          disabled={loading}
          className="admin-accept-btn"
        >
          Accept
        </button>

        <button
          type="button"
          onClick={() => setShowDenyBox(!showDenyBox)}
          disabled={loading}
          className="admin-deny-btn"
        >
          Deny
        </button>
      </div>

      {showDenyBox && (
        <div style={{ marginTop: "10px" }}>
          <textarea
            value={denialReason}
            onChange={(e) => setDenialReason(e.target.value)}
            placeholder="Enter denial reason..."
            style={{
              width: "100%",
              minHeight: "90px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              resize: "vertical",
            }}
          />

          <button
            type="button"
            onClick={() => handleDecision("denied")}
            disabled={loading}
            className="admin-deny-btn"
            style={{ marginTop: "8px" }}
          >
            Send Denial Email
          </button>
        </div>
      )}
    </div>
  )
}

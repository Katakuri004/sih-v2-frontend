"use client"

import React from "react"

type ScheduleAlertProps = {
  type?: string
  scheduleId?: string | undefined
  onClose?: () => void
  onUndo?: (() => void) | undefined
  message?: string
}

export function ScheduleAlert({ message, type, scheduleId, onClose, onUndo }: ScheduleAlertProps) {
  return (
    <div className="p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
      <div className="font-medium">{type ? type.toUpperCase() : "Alert"}</div>
      <div className="text-xs">{message ?? `Schedule ${scheduleId ?? "#"}`}</div>
      <div className="mt-2 flex gap-2">
        {onUndo && (
          <button onClick={onUndo} className="text-xs underline">Undo</button>
        )}
        {onClose && (
          <button onClick={onClose} className="text-xs underline">Close</button>
        )}
      </div>
    </div>
  )
}

export default ScheduleAlert

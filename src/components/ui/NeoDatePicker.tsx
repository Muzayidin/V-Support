'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface NeoDatePickerProps {
  value?: string // format YYYY-MM-DD
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
  maxDate?: string
  minDate?: string
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export function NeoDatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal...',
  className = '',
  disabled = false,
  id,
  maxDate,
  minDate,
}: NeoDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Current view year & month
  const initialDate = value ? new Date(value) : new Date()
  const [viewYear, setViewYear] = useState(
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  )

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      }
    }
  }, [value])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const formatDisplayDate = (isoStr?: string) => {
    if (!isoStr) return ''
    const parts = isoStr.split('-')
    if (parts.length !== 3) return isoStr
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (isNaN(y) || isNaN(m) || isNaN(d)) return isoStr
    return `${d} ${MONTH_NAMES[m]} ${y}`
  }

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0 = Sunday
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()

  const days: { day: number; currentMonth: boolean; dateStr: string }[] = []

  // Preceding month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const m = viewMonth === 0 ? 12 : viewMonth
    const y = viewMonth === 0 ? viewYear - 1 : viewYear
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    days.push({ day, currentMonth: false, dateStr })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, currentMonth: true, dateStr })
  }

  // Trailing next month days to fill grid of 35 or 42
  const totalCells = days.length <= 35 ? 35 : 42
  const remaining = totalCells - days.length
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2
    const y = viewMonth === 11 ? viewYear + 1 : viewYear
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, currentMonth: false, dateStr })
  }

  const todayStr = (() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })()

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr)
    setIsOpen(false)
  }

  const handleSelectToday = () => {
    handleSelectDate(todayStr)
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen)
        }}
        className={`w-full px-3 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-foreground font-black text-xs shadow-[2px_2px_0px_0px_var(--border)] transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]'
        } ${isOpen ? 'ring-2 ring-border bg-main/15' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 shrink-0 stroke-[2.5] text-foreground" />
          <span className="truncate">
            {value ? (
              <span className="text-foreground">{formatDisplayDate(value)}</span>
            ) : (
              <span className="text-foreground/50 font-bold">{placeholder}</span>
            )}
          </span>
        </div>
        {value && !disabled && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-border/20 text-foreground/70 hover:text-foreground cursor-pointer"
          >
            <X className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-72 sm:w-80 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] p-3 animate-in fade-in-0 zoom-in-95 duration-100 left-0">
          {/* Header Month / Year & Nav */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-border">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center hover:bg-main active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <div className="font-black text-xs uppercase tracking-wider text-foreground">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 bg-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center hover:bg-main active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d, idx) => (
              <div
                key={d}
                className={`text-[10px] font-black uppercase py-1 ${
                  idx === 0 ? 'text-[#FF4D50]' : 'text-foreground/70'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((item, index) => {
              const isSelected = item.dateStr === value
              const isToday = item.dateStr === todayStr
              const isOutOfRange = Boolean(
                (minDate && item.dateStr < minDate) ||
                (maxDate && item.dateStr > maxDate)
              )

              return (
                <button
                  key={`${item.dateStr}-${index}`}
                  type="button"
                  disabled={isOutOfRange}
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-7 sm:h-8 rounded-[var(--radius-base)] text-xs font-black transition-all flex items-center justify-center select-none cursor-pointer ${
                    isSelected
                      ? 'bg-main text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] -translate-x-0.5 -translate-y-0.5'
                      : item.currentMonth
                        ? isToday
                          ? 'border-2 border-border bg-background text-foreground hover:bg-main/30'
                          : 'text-foreground hover:bg-main/30 border-2 border-transparent hover:border-border'
                        : 'text-foreground/25 border-2 border-transparent'
                  } ${isOutOfRange ? 'opacity-20 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  {item.day}
                </button>
              )
            })}
          </div>

          {/* Quick Footer Action */}
          <div className="mt-3 pt-2.5 border-t-2 border-border flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSelectToday}
              className="px-2.5 py-1 text-[11px] font-black bg-main border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] cursor-pointer text-foreground uppercase tracking-wider"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-[11px] font-black bg-background hover:bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-foreground uppercase tracking-wider"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

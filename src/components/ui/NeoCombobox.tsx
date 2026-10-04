'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'

export interface NeoComboboxOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

export interface NeoComboboxProps {
  options: NeoComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  disabled?: boolean
  className?: string
  id?: string
  name?: string
}

export function NeoCombobox({
  options,
  value,
  onChange,
  placeholder = 'Pilih salah satu...',
  searchPlaceholder = 'Cari pilihan...',
  searchable = false,
  disabled = false,
  className = '',
  id,
}: NeoComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options if searchable
  const filteredOptions = searchable && searchTerm.trim() !== ''
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Close when clicking outside
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

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Handle ESC key
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

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen)
            setSearchTerm('')
          }
        }}
        className={`w-full px-3.5 py-2.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-foreground font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_var(--border)] transition-all flex items-center justify-between gap-2 cursor-pointer select-none text-left ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]'
        } ${isOpen ? 'ring-2 ring-border bg-main/15' : ''}`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-foreground/50 font-bold">{placeholder}</span>
          )}
        </span>
        <ChevronsUpDown className="w-4 h-4 shrink-0 stroke-[2.5] text-foreground/70" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search box if searchable */}
          {searchable && (
            <div className="p-2 border-b-2 border-border bg-background">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-foreground/60 stroke-[2.5]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 text-foreground/60 hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-border/20 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-4 text-center text-xs font-bold text-foreground/60">
                Tidak ada pilihan ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-black transition-colors flex items-center justify-between gap-2 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-main text-foreground'
                        : 'text-foreground hover:bg-main/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div>
                        <div className="truncate">{opt.label}</div>
                        {opt.description && (
                          <div className={`text-[10px] font-semibold truncate ${isSelected ? 'text-foreground/80' : 'text-foreground/60'}`}>
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 stroke-[3] shrink-0 text-foreground" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

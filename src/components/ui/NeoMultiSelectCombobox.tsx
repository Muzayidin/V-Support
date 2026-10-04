'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, X, Plus } from 'lucide-react'

export interface NeoMultiSelectOption {
  value: string
  label: string
}

export interface NeoMultiSelectComboboxProps {
  options: NeoMultiSelectOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  onAddNewOption?: (newOption: string) => void
  placeholder?: string
  searchPlaceholder?: string
  creatable?: boolean
  className?: string
  id?: string
  disabled?: boolean
}

export function NeoMultiSelectCombobox({
  options,
  selectedValues,
  onChange,
  onAddNewOption,
  placeholder = 'Pilih beberapa opsi...',
  searchPlaceholder = 'Cari atau ketik jenis servis...',
  creatable = true,
  className = '',
  id,
  disabled = false,
}: NeoMultiSelectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [customInput, setCustomInput] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filtered options based on search
  const filteredOptions = searchTerm.trim() !== ''
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const isExactMatch = options.some(
    (opt) => opt.label.toLowerCase() === searchTerm.trim().toLowerCase()
  )

  // Close on outside click
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
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
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

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val))
    } else {
      onChange([...selectedValues, val])
    }
  }

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedValues.filter((v) => v !== val))
  }

  const handleAddNew = (nameToAdd: string) => {
    const trimmed = nameToAdd.trim()
    if (!trimmed) return
    if (onAddNewOption) {
      onAddNewOption(trimmed)
    }
    if (!selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed])
    }
    setSearchTerm('')
    setCustomInput('')
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Box */}
      <div
        id={id}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen)
        }}
        className={`w-full min-h-[46px] p-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[3px_3px_0px_0px_var(--border)] transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]'
        } ${isOpen ? 'ring-2 ring-border bg-main/10' : ''}`}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 items-center">
          {selectedValues.length === 0 ? (
            <span className="text-foreground/50 font-bold text-xs px-1">
              {placeholder}
            </span>
          ) : (
            selectedValues.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs shadow-[1px_1px_0px_0px_var(--border)]"
                >
                  <span className="truncate max-w-[140px]">
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => removeOption(val, e)}
                    className="hover:bg-black hover:text-white rounded-sm p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </span>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          {selectedValues.length > 0 && (
            <span className="text-[10px] font-black bg-background border border-border px-1.5 py-0.5 rounded-[var(--radius-base)]">
              {selectedValues.length}
            </span>
          )}
          <ChevronsUpDown className="w-4 h-4 stroke-[2.5] text-foreground/70" />
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="p-2 border-b-2 border-border bg-background">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-foreground/60 stroke-[2.5]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (searchTerm.trim() && !isExactMatch && creatable) {
                      handleAddNew(searchTerm)
                    }
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-2 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
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

          {/* Quick Create Prompt when searching */}
          {creatable && searchTerm.trim() !== '' && !isExactMatch && (
            <div className="p-2 bg-main/20 border-b-2 border-border">
              <button
                type="button"
                onClick={() => handleAddNew(searchTerm)}
                className="w-full py-1.5 px-3 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs shadow-[2px_2px_0px_0px_var(--border)] hover:bg-[#FACC00] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">
                  + Tambah <strong>&quot;{searchTerm.trim()}&quot;</strong>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-background px-1.5 py-0.5 border border-border rounded-[var(--radius-base)] shrink-0 ml-2">
                  Baru
                </span>
              </button>
            </div>
          )}

          {/* Options Checklist */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border/20 py-1">
            {filteredOptions.length === 0 && !searchTerm.trim() ? (
              <div className="px-3.5 py-4 text-center text-xs font-bold text-foreground/60">
                Tidak ada pilihan tersedia
              </div>
            ) : filteredOptions.length === 0 && searchTerm.trim() ? (
              <div className="px-3.5 py-3 text-center text-xs font-bold text-foreground/60">
                Tidak ada servis dengan nama &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-black transition-colors flex items-center justify-between gap-2.5 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-main/30 text-foreground'
                        : 'text-foreground hover:bg-main/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-[var(--radius-base)] border-2 border-border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-main text-foreground' : 'bg-background'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-black uppercase text-foreground/70 bg-background px-1.5 py-0.5 border border-border rounded-[var(--radius-base)] shrink-0">
                        Dipilih
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Tambah Jenis Servis Input row */}
          {creatable && (
            <div className="p-2.5 border-t-2 border-border bg-background space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-foreground">
                Tambah Jenis Servis Kustom
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddNew(customInput)
                    }
                  }}
                  placeholder="Ketik nama servis baru..."
                  className="flex-1 px-2.5 py-1.5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] text-xs font-bold text-foreground placeholder:text-foreground/40 shadow-[1px_1px_0px_0px_var(--border)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddNew(customInput)}
                  className="px-3 py-1.5 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs shadow-[2px_2px_0px_0px_var(--border)] hover:bg-[#FACC00] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="p-2 border-t-2 border-border bg-secondary-background flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-foreground/70 pl-1">
              <strong>{selectedValues.length}</strong> jenis servis dipilih
            </span>
            <div className="flex items-center gap-2">
              {selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="px-2.5 py-1 text-xs font-bold text-foreground/70 hover:text-foreground underline cursor-pointer"
                >
                  Hapus Semua
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-main text-foreground border-2 border-border rounded-[var(--radius-base)] font-black text-xs shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer uppercase"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

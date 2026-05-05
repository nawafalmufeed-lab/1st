import React from 'react'
import { STATUS_CONFIG } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

export const StatusBadge = ({ status, size = 'md' }) => {
  const { lang } = useApp()
  const cfg = STATUS_CONFIG[status] || {}
  const label = lang === 'ar' ? cfg.labelAr : cfg.labelEn
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${cfg.color} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {label}
    </span>
  )
}

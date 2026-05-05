import React from 'react'
import { useApp } from '../../context/AppContext'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
}

const BG = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  warning: 'border-amber-200 bg-amber-50',
}

export const ToastContainer = () => {
  const { toasts, removeToast, lang } = useApp()

  return (
    <div className={`fixed top-4 z-50 flex flex-col gap-2 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-72 max-w-sm ${BG[toast.type] || BG.info}`}
        >
          {ICONS[toast.type] || ICONS.info}
          <span className="text-sm font-medium text-slate-800 flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

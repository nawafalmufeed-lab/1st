import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { generateTransactions, USERS } from '../data/mockData'
import { generateBankRef } from '../utils/helpers'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('ar')
  const [currentUser, setCurrentUser] = useState(null)
  const [transactions, setTransactions] = useState(() => generateTransactions())
  const [toasts, setToasts] = useState([])
  const [reconciliationLogs, setReconciliationLogs] = useState([])

  // Sync HTML dir attribute
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const t = useCallback((ar, en) => lang === 'ar' ? ar : en, [lang])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const login = useCallback((username, password, role) => {
    const user = USERS.find(u => u.username === username && u.password === password && u.role === role)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  // Reviewer action: send to review
  const sendToReview = useCallback((id) => {
    updateTransaction(id, {
      status: 'under_review',
      reviewerId: currentUser?.id,
      reviewerName: currentUser?.nameAr,
      actionDate: new Date().toISOString(),
    })
    addToast(
      lang === 'ar' ? 'تم إرسال المعاملة للمراجعة بنجاح' : 'Transaction sent for review successfully',
      'success'
    )
  }, [currentUser, lang, updateTransaction, addToast])

  // Approver action: approve
  const approveTransaction = useCallback((id) => {
    updateTransaction(id, {
      status: 'approved',
      approverId: currentUser?.id,
      approverName: currentUser?.nameAr,
      actionDate: new Date().toISOString(),
    })
    // Simulate bank send after a delay
    setTimeout(() => simulateBankTransfer(id), 2000)
    addToast(
      lang === 'ar' ? 'تمت الموافقة وجارٍ إرسال التحويل للبنك' : 'Approved — sending to bank…',
      'info'
    )
  }, [currentUser, lang, updateTransaction, addToast])

  // Bank simulation
  const simulateBankTransfer = useCallback((id) => {
    setTransactions(prev => {
      const txn = prev.find(t => t.id === id)
      if (!txn) return prev
      // 75% success rate
      const success = Math.random() < 0.75
      return prev.map(t => t.id === id ? {
        ...t,
        status: success ? 'transferred' : 'transfer_failed',
        bankRef: generateBankRef(),
        failReason: success ? null : ['رقم IBAN غير صحيح', 'رصيد غير كافٍ', 'انتهت مهلة الاتصال', 'خطأ في بيانات المستفيد'][Math.floor(Math.random() * 4)],
        lastRetryDate: success ? null : new Date().toISOString(),
      } : t)
    })
  }, [])

  // Retry failed transfer
  const retryTransfer = useCallback((id) => {
    setTransactions(prev => {
      const txn = prev.find(t => t.id === id)
      if (!txn || txn.retryCount >= 5) return prev
      const newRef = generateBankRef()
      const now = new Date().toISOString()
      return prev.map(t => t.id === id ? {
        ...t,
        status: 'approved', // reset to approved while processing
        retryCount: t.retryCount + 1,
        lastRetryDate: now,
        retryHistory: [...(t.retryHistory || []), {
          attempt: t.retryCount + 1,
          date: now,
          ref: newRef,
          result: 'pending',
          reason: null,
        }],
      } : t)
    })
    addToast(
      lang === 'ar' ? 'جارٍ إعادة محاولة التحويل...' : 'Retrying transfer…',
      'info'
    )
    // Simulate result after 2s
    setTimeout(() => {
      setTransactions(prev => {
        const txn = prev.find(t => t.id === id)
        if (!txn) return prev
        const success = Math.random() < 0.6
        const newRef = generateBankRef()
        const now = new Date().toISOString()
        return prev.map(t => t.id === id ? {
          ...t,
          status: success ? 'transferred' : 'transfer_failed',
          bankRef: newRef,
          failReason: success ? null : ['رقم IBAN غير صحيح', 'رصيد غير كافٍ', 'انتهت مهلة الاتصال'][Math.floor(Math.random() * 3)],
          lastRetryDate: now,
          retryHistory: t.retryHistory.map((r, i) =>
            i === t.retryHistory.length - 1
              ? { ...r, result: success ? 'success' : 'failed', reason: success ? null : 'خطأ في التحويل', ref: newRef }
              : r
          ),
        } : t)
      })
    }, 2000)
  }, [lang, addToast])

  // Reconciliation
  const runReconciliation = useCallback(() => {
    const logs = []
    setTransactions(prev => {
      const updated = prev.map(t => {
        if (t.status === 'transferred') {
          logs.push({ id: t.id, school: t.schoolName, amount: t.amount, action: 'completed', time: new Date().toISOString() })
          return { ...t, status: 'completed' }
        }
        return t
      })
      return updated
    })
    const runTime = new Date().toISOString()
    setReconciliationLogs(prev => [{
      runId: `RUN-${Date.now().toString(36).toUpperCase()}`,
      runTime,
      processed: logs.length,
      logs,
    }, ...prev])
    return logs.length
  }, [])

  const stats = React.useMemo(() => {
    const total = transactions.reduce((s, t) => s + t.amount, 0)
    const pending = transactions.filter(t => ['awaiting_review', 'under_review', 'approved'].includes(t.status)).reduce((s, t) => s + t.amount, 0)
    const net = transactions.reduce((s, t) => s + t.netAmount, 0)
    const bankFees = transactions.reduce((s, t) => s + t.bankFee, 0)
    const execFees = transactions.reduce((s, t) => s + t.executiveFee, 0)
    const byStatus = {}
    transactions.forEach(t => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1
    })
    return { total, pending, net, bankFees, execFees, byStatus, count: transactions.length }
  }, [transactions])

  return (
    <AppContext.Provider value={{
      lang, setLang, t,
      currentUser, login, logout,
      transactions, updateTransaction, sendToReview, approveTransaction,
      simulateBankTransfer, retryTransfer, runReconciliation,
      reconciliationLogs,
      stats,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

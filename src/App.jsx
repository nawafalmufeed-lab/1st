import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { ToastContainer } from './components/ui/Toast'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { ReviewerWorkflow } from './pages/ReviewerWorkflow'
import { ApproverWorkflow } from './pages/ApproverWorkflow'
import { BankSimulation } from './pages/BankSimulation'
import { FailedTransactions } from './pages/FailedTransactions'
import { Reconciliation } from './pages/Reconciliation'

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  reviewer: ReviewerWorkflow,
  approver: ApproverWorkflow,
  bank: BankSimulation,
  failed: FailedTransactions,
  reconciliation: Reconciliation,
}

const AppShell = () => {
  const { currentUser } = useApp()
  const [activePage, setActivePage] = useState('dashboard')

  if (!currentUser) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    )
  }

  const PageComponent = PAGES[activePage] || Dashboard

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activePage={activePage} />
        <main className="flex-1 overflow-y-auto">
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

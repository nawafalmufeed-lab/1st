import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Building2, Eye, EyeOff, Globe, Lock, User, ChevronDown } from 'lucide-react'

export const Login = () => {
  const { login, lang, setLang, t, addToast } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('reviewer')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const DEMO_ACCOUNTS = [
    { username: 'ahmed.reviewer', password: '123456', role: 'reviewer', label: t('مراجع - أحمد الغامدي', 'Reviewer – Ahmed Al-Ghamdi') },
    { username: 'sarah.approver', password: '123456', role: 'approver', label: t('معتمد - سارة الزهراني', 'Approver – Sarah Al-Zahrani') },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const ok = login(username, password, role)
      setLoading(false)
      if (!ok) {
        setError(t('بيانات الدخول غير صحيحة', 'Invalid credentials'))
      }
    }, 800)
  }

  const fillDemo = (acc) => {
    setUsername(acc.username)
    setPassword(acc.password)
    setRole(acc.role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -start-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -end-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/5 rounded-full blur-3xl" />
      </div>

      {/* Language toggle */}
      <button
        onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
        className="absolute top-4 end-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>

      <div className="w-full max-w-sm relative">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 pt-8 pb-6 text-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">
              {t('نظام إدارة مدفوعات المدارس', 'School Payment Management')}
            </h1>
            <p className="text-blue-100 text-xs mt-1">
              {t('وزارة التعليم – المملكة العربية السعودية', 'Ministry of Education – Saudi Arabia')}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-5">
              {t('تسجيل الدخول إلى حسابك', 'Sign in to your account')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {t('اسم المستخدم', 'Username')}
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={t('أدخل اسم المستخدم', 'Enter username')}
                    className="input-field ps-9"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {t('كلمة المرور', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="input-field ps-9 pe-9"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {t('الدور الوظيفي', 'Role')}
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="input-field appearance-none pe-8"
                  >
                    <option value="reviewer">{t('مراجع', 'Reviewer')}</option>
                    <option value="approver">{t('معتمد', 'Approver')}</option>
                  </select>
                  <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-2.5 text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('جارٍ الدخول...', 'Signing in...')}
                  </span>
                ) : t('تسجيل الدخول', 'Sign In')}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3">
                {t('حسابات تجريبية', 'Demo Accounts')}
              </p>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    onClick={() => fillDemo(acc)}
                    className="w-full text-xs text-start px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                  >
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold me-2 ${acc.role === 'reviewer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {acc.role === 'reviewer' ? t('مراجع', 'Reviewer') : t('معتمد', 'Approver')}
                    </span>
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          {t('جميع الحقوق محفوظة © 2024 وزارة التعليم', '© 2024 Ministry of Education. All rights reserved.')}
        </p>
      </div>
    </div>
  )
}

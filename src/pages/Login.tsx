import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Globe } from 'lucide-react';

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleLogin = (role: UserRole) => {
    const defaultEmail = role === 'reviewer' ? 'reviewer@madares.com' : 'approver@madares.com';
    login(email || defaultEmail, password, role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-600">
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </span>
      </button>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            {isRTL ? 'مدارس' : 'Madares'}
          </h1>
          <p className="text-gray-600">{t('app.title')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.welcome')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.loginSubtitle')}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin('reviewer');
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="user@madares.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => handleLogin('reviewer')}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {t('auth.loginAsReviewer')}
              </button>

              <button
                type="button"
                onClick={() => handleLogin('approver')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('auth.loginAsApprover')}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              {isRTL
                ? 'نظام تجريبي - يمكنك تسجيل الدخول بأي بريد إلكتروني'
                : 'Demo System - Login with any email'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

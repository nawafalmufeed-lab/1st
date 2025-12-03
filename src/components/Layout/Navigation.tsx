
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, List, FileCheck, CheckSquare } from 'lucide-react';

export default function Navigation() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
      roles: ['reviewer', 'approver', 'admin'],
    },
    {
      to: '/transactions',
      icon: List,
      label: t('nav.transactions'),
      roles: ['reviewer', 'approver', 'admin'],
    },
    {
      to: '/review',
      icon: FileCheck,
      label: t('nav.review'),
      roles: ['reviewer', 'admin'],
    },
    {
      to: '/approval',
      icon: CheckSquare,
      label: t('nav.approval'),
      roles: ['approver', 'admin'],
    },
  ];

  const filteredItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

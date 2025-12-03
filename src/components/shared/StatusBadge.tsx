
import { useTranslation } from 'react-i18next';
import { TransactionStatus } from '../../types';
import { Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: TransactionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig = {
    pending_review: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
    },
    under_review: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: 'text-blue-500',
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: 'text-green-500',
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
    },
    failed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: 'text-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Circle className={`w-2 h-2 fill-current ${config.icon}`} />
      {t(`status.${status}`)}
    </span>
  );
}

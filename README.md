# Madares Payout Management System

A comprehensive payout management system for Madares with bilingual support (Arabic/English), role-based access control, and automatic fee calculations.

## Features

### Pages
- **Login Page**: Secure authentication with role selection (Reviewer/Approver)
- **Dashboard**: Statistics overview with transaction counts and amounts
- **Transactions List**: Complete list with search, filter, and multi-select functionality
- **Review Page**: Reviewer interface for validating pending transactions
- **Approval Page**: Approver interface for approving reviewed transactions
- **Transaction Details**: Comprehensive view of individual transaction information

### Core Features
- ✅ Bilingual support (Arabic/English) with RTL/LTR layout switching
- ✅ Role-based permissions (Reviewer, Approver)
- ✅ Transaction status workflow (Pending Review → Under Review → Approved → Completed/Failed)
- ✅ Automatic fee calculations:
  - Activation Fee: SAR 85 (first transaction only for Executive contracts)
  - Transaction Fees:
    - Mada: 0.85%
    - Visa/Mastercard: 1.17%
    - Tamara (Financing): 10%
- ✅ Search and filter by Transaction ID, School, Student, IBAN, Status
- ✅ Multi-select for batch operations
- ✅ 35+ mock transactions with varied data

### Design
- Modern, clean UI with Teal/Turquoise primary color (#4DB6AC)
- Responsive design for desktop and tablet
- Madares branding
- Status badges with color coding
- Statistics cards with icons
- Clean table layouts

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Internationalization**: i18next + react-i18next
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Login
- Use any email address
- Choose your role:
  - **Reviewer**: Access to Dashboard, Transactions, and Review pages
  - **Approver**: Access to Dashboard, Transactions, and Approval pages

### Reviewer Workflow
1. Navigate to **Review** page
2. View all transactions with status "Pending Review"
3. Select transactions to review
4. Click "Mark as Reviewed" to move them to "Under Review" status

### Approver Workflow
1. Navigate to **Approval** page
2. View all transactions with status "Under Review"
3. Select transactions to approve or reject
4. Click "Approve Selected" or "Reject Selected"

### Viewing Transaction Details
- Click the eye icon (👁️) on any transaction to view full details
- See complete breakdown of fees, deductions, and net amount
- View review and approval history

### Language Toggle
- Click the language toggle button (🌐) in the header
- Switch between English and Arabic
- Layout automatically adjusts to RTL for Arabic

## Fee Calculation Logic

### Activation Fee
- Applied only to the first transaction for Executive contract type
- Amount: SAR 85

### Transaction Fees
- **Mada**: 0.85% of original amount
- **Visa/Mastercard**: 1.17% of original amount
- **Tamara**: 10% of original amount

### Net Amount
```
Net Amount = Original Amount - Activation Fee - Transaction Fee
```

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          # App header with logo and user info
│   │   └── Navigation.tsx      # Main navigation with role-based tabs
│   └── shared/
│       ├── StatusBadge.tsx     # Transaction status badge component
│       └── StatsCard.tsx       # Dashboard statistics card
├── contexts/
│   ├── AuthContext.tsx         # Authentication state management
│   └── TransactionContext.tsx  # Transaction data and operations
├── i18n/
│   ├── index.ts                # i18n configuration
│   └── locales/
│       ├── en.json             # English translations
│       └── ar.json             # Arabic translations
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Dashboard.tsx           # Statistics dashboard
│   ├── Transactions.tsx        # Transaction list with filters
│   ├── Review.tsx              # Reviewer interface
│   ├── Approval.tsx            # Approver interface
│   └── TransactionDetails.tsx  # Transaction detail view
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   ├── calculations.ts         # Fee calculation functions
│   └── mockData.ts             # Mock transaction generator
├── App.tsx                     # Main app component with routing
├── main.tsx                    # App entry point
└── index.css                   # Global styles and Tailwind imports
```

## Mock Data

The application includes 35+ mock transactions with:
- 10 different schools
- 15 different student names
- Various payment methods (Mada, Visa, Mastercard, Tamara)
- Mixed transaction statuses
- Some first transactions with activation fees
- Both Executive and Standard contract types

## Future Enhancements

- Backend API integration
- Real authentication system
- Export to Excel/PDF
- Email notifications
- Transaction history and audit log
- Advanced analytics and reporting
- Bulk upload transactions
- Custom fee configuration
- Payment gateway integration

## License

Private - Madares Internal Use Only

## Support

For support, contact the Madares development team.
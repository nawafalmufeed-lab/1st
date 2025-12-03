# Payout Management System - Madares

A comprehensive Payout Management System prototype with bilingual support (Arabic/English), featuring transaction management, review workflows, and approval processes.

## Features

### Core Functionality
- **Dashboard**: Visual statistics with charts showing transaction status distribution and amounts
- **Transactions List**: Comprehensive list with search and filtering capabilities
- **Transaction Details**: Detailed view of individual transactions
- **Review System**: Reviewers can review pending transactions
- **Approval System**: Approvers can approve reviewed transactions
- **Bilingual Support**: Full Arabic and English language support with RTL/LTR layouts
- **User Permissions**: Role-based access (Reviewer, Approver, Admin)

### Automatic Calculations
- **Activation Fee**: SAR 85 for first transaction (Executive contracts only)
- **Transaction Fees**:
  - Mada: 0.85%
  - Visa/Mastercard: 1.17%
  - Financing (Tamara): 10%

### Mock Data
- 35+ transactions with varied:
  - Statuses: Pending Review, Under Review, Approved, Completed, Failed
  - Schools and students
  - Payment methods
  - Contract types
  - Some with activation fees applied

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Accounts

### Reviewer Account
- **Username**: reviewer1
- **Password**: password
- **Permissions**: Can review transactions

### Approver Account
- **Username**: approver1
- **Password**: password
- **Permissions**: Can approve reviewed transactions

### Admin Account
- **Username**: admin1
- **Password**: password
- **Permissions**: Full access to all features

## Project Structure

```
src/
├── components/          # Shared components
│   └── Layout.tsx      # Main layout with navigation
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── TransactionContext.tsx
├── data/               # Mock data
│   └── mockData.ts
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── TransactionsList.tsx
│   ├── TransactionDetail.tsx
│   ├── ReviewPage.tsx
│   └── ApprovalPage.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Key Features Breakdown

### 1. Dashboard
- Total transactions count
- Status breakdown (Pending, Under Review, Approved, Completed, Failed)
- Financial statistics (Total Amount, Deductions, Net Amount)
- Pie chart for status distribution
- Bar chart for amount breakdown
- Recent transactions table

### 2. Transaction List
- Search by Transaction ID, School, Student, IBAN
- Filter by status
- Multi-select functionality
- Status indicators with icons
- Quick actions (View, Review, Approve, Download)

### 3. Review Process
- View all pending transactions
- Select multiple transactions for batch review
- Add review notes
- Submit reviews to move transactions to "Under Review"

### 4. Approval Process
- View all reviewed transactions
- See who reviewed each transaction
- Approve or reject transactions
- Batch approval support

### 5. Bilingual Support
- Complete English/Arabic translations
- RTL layout for Arabic
- Language toggle in header
- Persistent language preference

### 6. Transaction Details
- Basic information (School, Student, Date, IBAN)
- Payment information (Method, Contract Type, First Payment)
- Detailed fee breakdown
- Transaction timeline with review/approval history

## Design Features

- **Primary Color**: Teal/Turquoise (#4DB6AC)
- **Clean Interface**: Light, modern design
- **Responsive**: Works on all screen sizes
- **Accessibility**: Clear typography and contrast
- **Status Icons**: Visual indicators for transaction states

## Transaction Status Flow

```
Pending Review → Under Review → Approved → Completed
                              ↓
                           Failed
```

1. **Pending Review**: New transactions awaiting review
2. **Under Review**: Reviewed by a Reviewer
3. **Approved**: Approved by an Approver
4. **Completed**: Successfully processed
5. **Failed**: Rejected or failed transactions

## Fee Calculation Logic

The system automatically calculates fees based on:

1. **Activation Fee** (if applicable):
   - SAR 85 for first payment of Executive contracts

2. **Transaction Fee** (based on payment method):
   - Mada: 0.85% of original amount
   - Visa/Mastercard: 1.17% of original amount
   - Tamara: 10% of original amount

3. **Net Amount**:
   ```
   Net Amount = Original Amount - Activation Fee - Transaction Fee
   ```

## Development

### Running in Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Type Checking

```bash
npm run tsc
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This is a prototype project for demonstration purposes.

---

Built with ❤️ for Madares

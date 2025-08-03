# MoneyMitra

A personal finance management application built with modern web technologies. Track expenses, manage loans, visualize financial data, and maintain financial awareness through an intuitive and responsive interface.

## Features

### Core Functionality
- **Expense & Income Tracking**: Record and categorize financial transactions
- **Interactive Dashboard**: Visualize financial data with dynamic charts and graphs
- **Loan Management**: Track loans with automated reminders and payment schedules
- **EMI Calculator**: Calculate loan EMIs with detailed amortization schedules
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Secure Authentication**: Supabase Auth with email/password authentication

### Advanced Features
- **Financial Reports**: Generate detailed financial reports and insights
- **Smart Notifications**: Receive reminders for upcoming payments and financial goals
- **Offline Support**: Work seamlessly with Supabase offline capabilities
- **Budget Planning**: Set and track financial goals and budgets
- **Transaction Categories**: Organize expenses with customizable categories

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase & Google
- **Charts**: Chart.js + React Chart.js 2
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
```bash
git clone https://github.com/prabinbessie/money-mitra.git
cd moneymitra
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Modules

### Dashboard
- Real-time financial overview with key metrics
- Interactive expense breakdown charts
- Recent transactions summary
- Monthly income vs expenses comparison

### Transaction Management
- Add, edit, and delete transactions
- Categorize income and expenses
- Search and filter functionality
- Bulk import/export capabilities

### Loan Management
- Track multiple loans simultaneously
- View payment schedules and progress
- Calculate remaining balance and interest
- Set payment reminders

### EMI Calculator
- Calculate monthly EMI for any loan
- Generate complete amortization schedule
- View interest vs principal breakdown
- Export payment schedules

## Architecture

MoneyMitra follows a modular architecture with clear separation of concerns:

- **Components**: Reusable UI components built with React and TypeScript
- **Hooks**: Custom hooks for data fetching and state management
- **Services**: API integration layer with Supabase
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes
```bash
git commit -m 'Add feature description'
```
4. Push to the branch
```bash
git push origin feature/your-feature-name
```
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
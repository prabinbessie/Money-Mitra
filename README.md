# MoneyMitra - Personal Finance Management App

MoneyMitra is a personal finance management application built with modern web technologies. Track your expenses, manage loans, visualize financial data, and stay financially informed with an intuitive and responsive interface.

## Features

### Core Functionality
- 💰 **Expense & Income Tracking** - Record and categorize all your financial transactions
- 📊 **Interactive Dashboard** - Visualize your financial data with dynamic charts and graphs
- 🏦 **Loan Management** - Track loans with automated reminders and payment schedules
- 🧮 **EMI Calculator** - Calculate loan EMIs with detailed amortization schedules
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔐 **Secure Authentication** - Supabase Auth with email/password authentication

### Advanced Features
- 📈 **Financial Reports** - Generate detailed financial reports and insights
- 🔔 **Smart Notifications** - Get reminders for upcoming payments and financial goals
- 💾 **Offline Support** - Work seamlessly with Supabase offline capabilities
- 🎯 **Budget Planning** - Set and track financial goals and budgets
- 📋 **Transaction Categories** - Organize expenses with customizable categories

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Charts**: Chart.js + React Chart.js 2
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prabinbessie/money-mitra.git
   cd moneymitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Click "Connect to Supabase" button in the top right of the app

4. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

The application uses the following main tables:

- **users** - User profiles and authentication data
- **transactions** - Income and expense records
- **loans** - Loan information and tracking
- **budgets** - Budget planning and tracking
- **financial_goals** - Goal setting and progress tracking

## Key Features Explained

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

### Responsive Design
- Mobile-first approach
- Optimized layouts for all screen sizes
- Touch-friendly interface
- Progressive Web App capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

Built with ❤️ 
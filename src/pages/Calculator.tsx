import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Download, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { calculateEMI, generateAmortizationSchedule, formatCurrency } from '../utils/calculations';

export const Calculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(240);
  const [showSchedule, setShowSchedule] = useState(false);
  const [calculatorType, setCalculatorType] = useState<'emi' | 'sip' | 'compound'>('emi');

  const emi = calculateEMI(principal, rate, tenure);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;
  const schedule = generateAmortizationSchedule(principal, rate, tenure);

  // SIP Calculator
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipTenure, setSipTenure] = useState<number>(120);
  const [sipRate, setSipRate] = useState<number>(12);

  const calculateSIP = () => {
    const monthlyRate = sipRate / (12 * 100);
    const maturityAmount = sipAmount * (((Math.pow(1 + monthlyRate, sipTenure) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = sipAmount * sipTenure;
    const totalReturns = maturityAmount - totalInvestment;
    return { maturityAmount, totalInvestment, totalReturns };
  };

  const sipResults = calculateSIP();

  // Compound Interest Calculator
  const [compoundPrincipal, setCompoundPrincipal] = useState<number>(100000);
  const [compoundRate, setCompoundRate] = useState<number>(10);
  const [compoundTenure, setCompoundTenure] = useState<number>(10);

  const calculateCompoundInterest = () => {
    const amount = compoundPrincipal * Math.pow(1 + compoundRate / 100, compoundTenure);
    const interest = amount - compoundPrincipal;
    return { amount, interest };
  };

  const compoundResults = calculateCompoundInterest();

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Financial Calculators
        </motion.h1>
        <motion.p 
          className="text-gray-600 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Calculate EMI, SIP returns, and compound interest with detailed breakdowns
        </motion.p>
      </div>

      {/* Calculator Type Selector */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={calculatorType === 'emi' ? 'primary' : 'outline'}
            onClick={() => setCalculatorType('emi')}
            icon={<CalculatorIcon className="h-4 w-4" />}
          >
            EMI Calculator
          </Button>
          <Button
            variant={calculatorType === 'sip' ? 'primary' : 'outline'}
            onClick={() => setCalculatorType('sip')}
            icon={<TrendingUp className="h-4 w-4" />}
          >
            SIP Calculator
          </Button>
          <Button
            variant={calculatorType === 'compound' ? 'primary' : 'outline'}
            onClick={() => setCalculatorType('compound')}
            icon={<PieChart className="h-4 w-4" />}
          >
            Compound Interest
          </Button>
        </div>
      </Card>

      {/* EMI Calculator */}
      {calculatorType === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CalculatorIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Loan Details
            </h3>
            
            <div className="space-y-6">
              <Input
                type="number"
                label="Principal Amount (₹)"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                placeholder="Enter loan amount"
              />

              <Input
                type="number"
                step="0.01"
                label="Interest Rate (% per annum)"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                placeholder="Enter interest rate"
              />

              <Input
                type="number"
                label="Tenure (Months)"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                placeholder="Enter tenure in months"
              />

              <Button
                onClick={() => setShowSchedule(!showSchedule)}
                variant="outline"
                fullWidth
                icon={<BarChart3 className="h-4 w-4" />}
              >
                {showSchedule ? 'Hide' : 'View'} Amortization Schedule
              </Button>
            </div>
          </Card>

          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">EMI Calculation Results</h3>
            
            <div className="space-y-6">
              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-emerald-600 mb-2">Monthly EMI</p>
                <p className="text-4xl font-bold text-emerald-700">{formatCurrency(emi)}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 mb-1">Total Payment</p>
                  <p className="text-xl font-semibold text-blue-700">{formatCurrency(totalPayment)}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm text-orange-600 mb-1">Total Interest</p>
                  <p className="text-xl font-semibold text-orange-700">{formatCurrency(totalInterest)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-medium">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Component</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Tenure</span>
                  <span className="font-medium">{tenure} months ({Math.round(tenure/12)} years)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* SIP Calculator */}
      {calculatorType === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              SIP Details
            </h3>
            
            <div className="space-y-6">
              <Input
                type="number"
                label="Monthly Investment (₹)"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                placeholder="Enter monthly SIP amount"
              />

              <Input
                type="number"
                step="0.01"
                label="Expected Annual Return (%)"
                value={sipRate}
                onChange={(e) => setSipRate(Number(e.target.value))}
                placeholder="Enter expected return rate"
              />

              <Input
                type="number"
                label="Investment Period (Months)"
                value={sipTenure}
                onChange={(e) => setSipTenure(Number(e.target.value))}
                placeholder="Enter investment period"
              />
            </div>
          </Card>

          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">SIP Returns</h3>
            
            <div className="space-y-6">
              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-blue-600 mb-2">Maturity Amount</p>
                <p className="text-4xl font-bold text-blue-700">{formatCurrency(sipResults.maturityAmount)}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 mb-1">Total Investment</p>
                  <p className="text-xl font-semibold text-green-700">{formatCurrency(sipResults.totalInvestment)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-600 mb-1">Total Returns</p>
                  <p className="text-xl font-semibold text-purple-700">{formatCurrency(sipResults.totalReturns)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly SIP</span>
                  <span className="font-medium">{formatCurrency(sipAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Period</span>
                  <span className="font-medium">{sipTenure} months ({Math.round(sipTenure/12)} years)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return</span>
                  <span className="font-medium">{sipRate}% per annum</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Compound Interest Calculator */}
      {calculatorType === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Investment Details
            </h3>
            
            <div className="space-y-6">
              <Input
                type="number"
                label="Principal Amount (₹)"
                value={compoundPrincipal}
                onChange={(e) => setCompoundPrincipal(Number(e.target.value))}
                placeholder="Enter principal amount"
              />

              <Input
                type="number"
                step="0.01"
                label="Annual Interest Rate (%)"
                value={compoundRate}
                onChange={(e) => setCompoundRate(Number(e.target.value))}
                placeholder="Enter interest rate"
              />

              <Input
                type="number"
                label="Time Period (Years)"
                value={compoundTenure}
                onChange={(e) => setCompoundTenure(Number(e.target.value))}
                placeholder="Enter time period"
              />
            </div>
          </Card>

          <Card hover>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Compound Interest Results</h3>
            
            <div className="space-y-6">
              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-purple-600 mb-2">Final Amount</p>
                <p className="text-4xl font-bold text-purple-700">{formatCurrency(compoundResults.amount)}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm text-indigo-600 mb-1">Principal</p>
                  <p className="text-xl font-semibold text-indigo-700">{formatCurrency(compoundPrincipal)}</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-xl">
                  <p className="text-sm text-pink-600 mb-1">Interest Earned</p>
                  <p className="text-xl font-semibold text-pink-700">{formatCurrency(compoundResults.interest)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-medium">{formatCurrency(compoundPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-medium">{compoundRate}% per annum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period</span>
                  <span className="font-medium">{compoundTenure} years</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Amortization Schedule */}
      {calculatorType === 'emi' && showSchedule && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Amortization Schedule</h3>
            <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.slice(0, 24).map((payment, index) => (
                  <motion.tr 
                    key={payment.month} 
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.emi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.principalPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.interestPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.remainingBalance)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {schedule.length > 24 && (
              <div className="text-center py-4 text-sm text-gray-500">
                Showing first 24 months of {schedule.length} total payments
              </div>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
};
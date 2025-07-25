import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Edit, Trash2, CreditCard, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LoanForm } from '../components/loans/LoanForm';
import { PaymentForm } from '../components/loans/PaymentForm';
import { useLoans } from '../hooks/useLoans';
import { formatCurrency, formatDate } from '../utils/calculations';

export const Loans: React.FC = () => {
  const { loans, loading, addLoan, deleteLoan, addPayment } = useLoans();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const handleAddLoan = async (formData: any) => {
    await addLoan(formData);
    setIsModalOpen(false);
  };

  const handleDeleteLoan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      await deleteLoan(id);
    }
  };

  const handleAddPayment = async (formData: any) => {
    await addPayment(formData);
    setIsPaymentModalOpen(false);
    setSelectedLoan(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remaining_amount, 0);
  const totalMonthlyEMI = loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.emi_amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Loan Management
          </motion.h1>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Track and manage all your loans with payment schedules
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button onClick={() => setIsModalOpen(true)} size="lg" icon={<Plus className="h-5 w-5" />}>
            Add Loan
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyEMI)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Loans Grid */}
      {loans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {loans.map((loan, index) => {
              const completionPercentage = ((loan.principal_amount - loan.remaining_amount) / loan.principal_amount) * 100;
              
              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{loan.loan_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Principal</span>
                        <span className="font-medium">{formatCurrency(loan.principal_amount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly EMI</span>
                        <span className="font-medium">{formatCurrency(loan.emi_amount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Interest Rate</span>
                        <span className="font-medium">{loan.interest_rate}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Remaining</span>
                        <span className="font-medium text-red-600">{formatCurrency(loan.remaining_amount)}</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{completionPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {loan.payments_made} of {loan.tenure_months} payments
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            Add Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteLoan(loan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No loans yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first loan to track payments and progress</p>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
              Add Your First Loan
            </Button>
          </div>
        </Card>
      )}

      {/* Add Loan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Loan"
        size="lg"
      >
        <LoanForm
          onSubmit={handleAddLoan}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedLoan(null);
        }}
        title="Add Payment"
        size="md"
      >
        {selectedLoan && (
          <PaymentForm
            loan={selectedLoan}
            onSubmit={handleAddPayment}
            onCancel={() => {
              setIsPaymentModalOpen(false);
              setSelectedLoan(null);
            }}
          />
        )}
      </Modal>
    </motion.div>
  );
};
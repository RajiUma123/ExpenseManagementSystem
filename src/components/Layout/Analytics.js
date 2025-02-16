import React from 'react';
import { Progress } from 'antd';

function Analytics({ getAllTransaction }) {
  const totalTransaction = getAllTransaction.length;
  const totalIncomeTransactions = getAllTransaction.filter(transaction => transaction.type === 'income');
  const totalExpenseTransactions = getAllTransaction.filter(transaction => transaction.type === 'expense');

  const totalIncomePercentage = (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercentage = (totalExpenseTransactions.length / totalTransaction) * 100;

  // Total Turnover Calculation
  const totalTurnover = getAllTransaction.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercentage = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercentage = (totalExpenseTurnover / totalTurnover) * 100;

  // Categories
  const categories = ['salary', 'tip', 'project', 'food', 'movie', 'bills', 'medical', 'fees'];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {/* Transaction Statistics */}
        <div className="col-md-6">
          <div className="card shadow border-0 p-3">
            <div className="card-header bg-primary text-white text-center fw-bold">Total Transactions</div>
            <div className="card-body text-center">
              <h5 className="text-success">Income: {totalIncomeTransactions.length}</h5>
              <h5 className="text-danger">Expense: {totalExpenseTransactions.length}</h5>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Progress type="circle" strokeColor="green" percent={totalIncomePercentage.toFixed(0)} />
                <Progress type="circle" strokeColor="red" percent={totalExpensePercentage.toFixed(0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Turnover Statistics */}
        <div className="col-md-6">
          <div className="card shadow border-0 p-3">
            <div className="card-header bg-success text-white text-center fw-bold">Total Turnover</div>
            <div className="card-body text-center">
              <h5 className="text-success">Income: ${totalIncomeTurnover.toFixed(2)}</h5>
              <h5 className="text-danger">Expense: ${totalExpenseTurnover.toFixed(2)}</h5>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Progress type="circle" strokeColor="green" percent={totalIncomeTurnoverPercentage.toFixed(0)} />
                <Progress type="circle" strokeColor="red" percent={totalExpenseTurnoverPercentage.toFixed(0)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category-wise Breakdown */}
      <div className="row mt-5">
        <div className="col-md-6">
          <h4 className="text-center text-primary">Income Breakdown</h4>
          {categories.map(category => {
            const amount = totalIncomeTransactions
              .filter(transaction => transaction.category === category)
              .reduce((acc, transaction) => acc + transaction.amount, 0);

            return amount > 0 ? (
              <div className="card shadow-sm border-0 mb-2" key={category}>
                <div className="card-body">
                  <h6 className="fw-bold">{category}</h6>
                  <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                </div>
              </div>
            ) : null;
          })}
        </div>

        <div className="col-md-6">
          <h4 className="text-center text-danger">Expense Breakdown</h4>
          {categories.map(category => {
            const amount = totalExpenseTransactions
              .filter(transaction => transaction.category === category)
              .reduce((acc, transaction) => acc + transaction.amount, 0);

            return amount > 0 ? (
              <div className="card shadow-sm border-0 mb-2" key={category}>
                <div className="card-body">
                  <h6 className="fw-bold">{category}</h6>
                  <Progress  percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

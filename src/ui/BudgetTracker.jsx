function BudgetTracker() {
  return (
    <section className="budget">
      <h4>Budget Tracker</h4>
      <div className="budget-card">
        <div className="budget-header">
          <span>Monthly Budget: $2,000</span>
          <span>Spent: $1,200</span>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: '60%' }}></div>
        </div>
        <p>60% of budget used</p>
      </div>
    </section>
  );
}

export default BudgetTracker;
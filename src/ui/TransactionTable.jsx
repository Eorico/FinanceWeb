function TransactionsTable() {
  return (
    <section className="transactions">
      <h4>Recent Transactions</h4>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-04-01</td>
            <td>Salary</td>
            <td>Income</td>
            <td className="positive">+ $2,500</td>
          </tr>
          <tr>
            <td>2025-04-03</td>
            <td>Grocery Shopping</td>
            <td>Food</td>
            <td className="negative">- $80</td>
          </tr>
          <tr>
            <td>2025-04-05</td>
            <td>Rent</td>
            <td>Housing</td>
            <td className="negative">- $1,000</td>
          </tr>
          <tr>
            <td>2025-04-07</td>
            <td>Freelance Work</td>
            <td>Income</td>
            <td className="positive">+ $600</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default TransactionsTable;
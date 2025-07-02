function OverviewCards() {
    return (
        <section className="overview">
            <h4>Account Overview</h4>
            <div className="cards">
                <div className="card balance">
                    <h5>Total Balance</h5>
                    <p>$5,000</p>
                </div>
                <div className="card income">
                    <h5>Income This Month</h5>
                    <p>$2,000</p>
                </div>
                <div className="card expense">
                    <h5>Expenses This Month</h5>
                    <p>$1,200</p>
                </div>
            </div>
        </section>
    );
}

export default OverviewCards;
<template>
  <!-- whole page area -->
  <div class="loan-page">
    <!-- centered card -->
    <div class="loan-card">
      <div class="title-row">
        <h1 class="loan-id">ID:</h1>
        <span class="loan-title">Loan Details</span>
        <span class="loan-status">Active</span>
      </div>
      

      <!-- 3-way layout INSIDE the card -->
      <div class="loan-layout">
        <!-- LEFT: users -->
        <section class="left users-panel">
          <h2 class="section-title">Users</h2>

          <div class="user-card">
            <h3>Customer</h3>
            <p>Name: Jane Doe</p>
          </div>

          <div class="user-card">
            <h3>Analyst</h3>
            <p>Name: John Smith</p>
          </div>
        </section>

        <!-- RIGHT: top + bottom -->
        <section class="right">
          <!-- top right: loan amounts -->
          <section class="top-right loan-info">
            
            <div class="loan-info-header">
              <h2 class="section-title">Loan Info</h2>
            </div>

            <div class="subsection-layout">
            
              <div class="info-side left-side"> 
                <div class="subsection-title">Remaining Amount</div>
                <div class="value-pill">$12,247.00</div>
              </div>

              <div class="info-divider"></div>

              <div class="info-side right-side">
                <div class="metric-row">
                  <span class="label">Start Amount:</span>
                  <span class="value">$10,000.00</span>
                </div>

                <div class="metric-row">
                  <span class="label">Interest Rate:</span>
                  <span class="value">5.5%</span>
                </div>

                <div class="metric-row">
                  <span class="label">Term:</span>
                  <span class="value">1</span>
                </div>
              </div>
            </div>
          </section>

          <!-- bottom right: dates -->
          <section class="bottom-right key-dates">
            
            <div class="key-dates-header">
              <h2 class="section-title">Key Dates</h2>
            </div>

            <div class="subsection-layout">
            
              <div class="info-side left-side"> 
                <div class="subsection-title">Next Payment</div>
                <div class="value-pill">12/15/25</div>
              </div>

              <div class="info-divider"></div>

              <div class="info-side right-side">
                <div class="metric-row">
                  <span class="label">Start Date:</span>
                  <span class="value">11/15/25</span>
                </div>

                <div class="metric-row">
                  <span class="label">End Date:</span>
                  <span class="value">3/15/26</span>
                </div>

                <div class="metric-row">
                  <span class="label">Frequency:</span>
                  <span class="value">Monthly</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>

      <!-- big button at bottom, like your other page -->
      <div class="actions">
        <button class="primary-btn">Back to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* full page – dark background like your screenshot */
.loan-page {
  width: 100%;
  max-width: 1000px;
  min-height: 100vh;
  background: #181818;               /* dark grey/black */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 90px 12px;              /* pushes card down a bit */
  box-sizing: border-box;
}

/* centered card */
.loan-card {
  width: 100%;
  max-width: 1000px;             /* similar width to your other page */
  background: #222;                /* dark card */
  border-radius: 8px;
  padding: 32px 30px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  color: #f5f5f5;
  box-sizing: border-box;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  margin-bottom: 5px;
}

.loan-title {
  font-size: 32px;
  margin-bottom: 24px;
}

.loan-id {
  font-size: 18px;
  margin-bottom: 24px;
}

.loan-status {
  display: inline-block;
  margin-bottom: 24px;
  padding: 4px 12px;
  background: #4caf50;            /* green for active */
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
}

/* 3-way layout inside card */
.loan-layout {
  display: flex;
  gap: 24px;
}

/* left half */
.left {
  flex: 1;
  max-width: 250px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 16px;
  box-sizing: border-box;
}

/* right half (top + bottom) */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Main 2-column layout */
.subsection-layout {
  display: flex;
  align-items: center;
  gap: 24px;
}

.info-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* right sections */
.top-right,
.bottom-right {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 16px;
  box-sizing: border-box;
}

.metric-row {
  display: flex;
  font-size: 15px;
}

/* Divider */
.info-divider {
  width: 50px;
  background: #ffffff;
  height: 100%;
  border-radius: 2px;
}



/* small cards, rows, etc. */
.user-card {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.25);
}

.info-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 14px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 18px;
  border-bottom: 1px solid #444;
  padding-bottom: 6px;
}

.subsection-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.value-pill {
  height: 70px;
  background: #666; /* placeholder color */
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  color: white;
}

.label {
  width: 100px;
  color: #aaa;
}

.value {
  color: #fff;
}

/* bottom button */
.actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.primary-btn {
  padding: 12px 36px;
  border-radius: 4px;
  border: none;
  background: #ffffff;
  color: #111;
  font-weight: 600;
  cursor: pointer;
}
</style>
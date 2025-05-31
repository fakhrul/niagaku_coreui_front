<template>
  <div>
    <div>
      <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast
            :key="info.message"
            :show="true"
            :header="info.header"
            :color="info.color"
          >
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster>
    </div>
    <div>
      <CRow>
       <CCol>
        <!-- Financial Goals Summary -->
    <FinancialGoalsWidgets :goals="financialGoalsSummary" />

<!-- Budget Overview & Planning -->
<CCard class="mb-4">
  <CCardHeader class="d-flex justify-content-between align-items-center">
    <div>
      <h5 class="mb-0">Budget Overview</h5>
      <small class="text-muted">{{ currentYear }} Annual Budget</small>
    </div>
    <div>
      <CButtonGroup size="sm" class="mr-2">
        <CButton color="outline-primary" :pressed="budgetPeriod === 'monthly'" @click="budgetPeriod = 'monthly'">Monthly</CButton>
        <CButton color="outline-primary" :pressed="budgetPeriod === 'quarterly'" @click="budgetPeriod = 'quarterly'">Quarterly</CButton>
        <CButton color="outline-primary" :pressed="budgetPeriod === 'annual'" @click="budgetPeriod = 'annual'">Annual</CButton>
      </CButtonGroup>
      <CButton color="primary" size="sm">
        <CIcon name="cil-pencil" /> Edit Budget
      </CButton>
    </div>
  </CCardHeader>
  <CCardBody>
    <BudgetOverviewChart :chartData="budgetChartData" style="height: 300px;" />
    
    <div class="row mt-4">
      <div class="col-md-4">
        <CCallout color="info">
          <div class="text-muted small">Total Budget</div>
          <div class="font-weight-bold h4">{{ formatCurrency(budgetSummary.totalBudget, 'IDR') }}</div>
        </CCallout>
      </div>
      <div class="col-md-4">
        <CCallout color="danger">
          <div class="text-muted small">Actual Expenses</div>
          <div class="font-weight-bold h4">{{ formatCurrency(budgetSummary.actualExpenses, 'IDR') }}</div>
          <div class="small" :class="budgetSummary.expenseVariance <= 0 ? 'text-success' : 'text-danger'">
            {{ budgetSummary.expenseVariance <= 0 ? '' : '+' }}{{ budgetSummary.expenseVariance }}% vs budget
          </div>
        </CCallout>
      </div>
      <div class="col-md-4">
        <CCallout color="success">
          <div class="text-muted small">Remaining Budget</div>
          <div class="font-weight-bold h4">{{ formatCurrency(budgetSummary.remainingBudget, 'IDR') }}</div>
          <div class="small">{{ Math.round((budgetSummary.remainingBudget / budgetSummary.totalBudget) * 100) }}% remaining</div>
        </CCallout>
      </div>
    </div>
  </CCardBody>
</CCard>

<!-- Financial Goals & Cash Flow Forecast -->
<CRow>
  <!-- Financial Goals -->
  <CCol lg="6">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Financial Goals</h5>
          <small class="text-muted">Track your business objectives</small>
        </div>
        <CButton color="primary" size="sm">
          <CIcon name="cil-plus" /> Add Goal
        </CButton>
      </CCardHeader>
      <CCardBody class="p-0">
        <CListGroup>
          <CListGroupItem v-for="goal in financialGoals" :key="goal.id" class="border-left-0 border-right-0">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center">
                <div :class="`c-avatar p-1 mr-2 ${getGoalCategoryColor(goal.category)}`">
                  <CIcon :name="getGoalCategoryIcon(goal.category)" class="text-white" />
                </div>
                <div>
                  <div class="font-weight-bold">{{ goal.name }}</div>
                  <small class="text-muted">{{ goal.category }} • Due {{ formatDate(goal.targetDate) }}</small>
                </div>
              </div>
              <CBadge :color="getGoalStatusColor(goal.progress)">
                {{ Math.round(goal.progress) }}%
              </CBadge>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <small>{{ formatCurrency(goal.currentAmount, 'IDR') }}</small>
              <small>{{ formatCurrency(goal.targetAmount, 'IDR') }}</small>
            </div>
            <CProgress
              height="8px"
              :value="goal.progress"
              :color="getGoalProgressColor(goal.progress)"
            />
          </CListGroupItem>
        </CListGroup>
      </CCardBody>
      <CCardFooter>
        <CButton color="light" size="sm" block>
          <CIcon name="cil-chart" /> View All Goals
        </CButton>
      </CCardFooter>
    </CCard>
  </CCol>

  <!-- Extended Cash Flow Forecast -->
  <CCol lg="6">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Cash Flow Forecast</h5>
          <small class="text-muted">6-month projection</small>
        </div>
        <CButtonGroup size="sm">
          <CButton color="outline-primary" :pressed="forecastRange === 3" @click="forecastRange = 3">3 Months</CButton>
          <CButton color="outline-primary" :pressed="forecastRange === 6" @click="forecastRange = 6">6 Months</CButton>
          <CButton color="outline-primary" :pressed="forecastRange === 12" @click="forecastRange = 12">12 Months</CButton>
        </CButtonGroup>
      </CCardHeader>
      <CCardBody>
        <ExtendedCashFlowChart :chartData="cashFlowForecastData" style="height: 250px;" />
        
        <div class="row mt-4">
          <div class="col-md-6">
            <h6>Optimistic Scenario</h6>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-muted">Ending Balance</div>
              <div class="font-weight-bold text-success">{{ formatCurrency(cashFlowScenarios.optimistic.endingBalance, 'IDR') }}</div>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-muted">Growth</div>
              <div class="font-weight-bold text-success">+{{ cashFlowScenarios.optimistic.growth }}%</div>
            </div>
          </div>
          <div class="col-md-6">
            <h6>Conservative Scenario</h6>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-muted">Ending Balance</div>
              <div class="font-weight-bold" :class="cashFlowScenarios.conservative.endingBalance >= currentCashBalance ? 'text-success' : 'text-danger'">
                {{ formatCurrency(cashFlowScenarios.conservative.endingBalance, 'IDR') }}
              </div>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <div class="text-muted">Growth</div>
              <div class="font-weight-bold" :class="cashFlowScenarios.conservative.growth >= 0 ? 'text-success' : 'text-danger'">
                {{ cashFlowScenarios.conservative.growth >= 0 ? '+' : '' }}{{ cashFlowScenarios.conservative.growth }}%
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
      <CCardFooter>
        <CButton color="light" size="sm" block>
          <CIcon name="cil-options" /> Adjust Forecast Parameters
        </CButton>
      </CCardFooter>
    </CCard>
  </CCol>
</CRow>

<!-- Budget Allocation & Tax Planning -->
<CRow>
  <!-- Budget Allocation -->
  <CCol lg="7">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Budget Allocation</h5>
          <small class="text-muted">By expense category</small>
        </div>
        <CButton color="light" size="sm">
          <CIcon name="cil-options" /> Adjust Allocation
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div class="row">
          <div class="col-md-5">
            <BudgetAllocationChart :chartData="budgetAllocationData" style="height: 250px;" />
          </div>
          <div class="col-md-7">
            <div class="table-responsive">
              <table class="table table-borderless table-sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th class="text-right">Budget</th>
                    <th class="text-right">Actual</th>
                    <th class="text-right">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in budgetCategories" :key="category.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="mr-2" style="width: 12px; height: 12px; border-radius: 50%;" :style="{ backgroundColor: category.color }"></div>
                        <span>{{ category.name }}</span>
                      </div>
                    </td>
                    <td class="text-right">{{ formatCurrency(category.budget, 'IDR') }}</td>
                    <td class="text-right">{{ formatCurrency(category.actual, 'IDR') }}</td>
                    <td class="text-right" :class="category.variance <= 0 ? 'text-success' : 'text-danger'">
                      {{ category.variance <= 0 ? '' : '+' }}{{ category.variance }}%
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="font-weight-bold">
                    <td>Total</td>
                    <td class="text-right">{{ formatCurrency(totalBudgetAllocation, 'IDR') }}</td>
                    <td class="text-right">{{ formatCurrency(totalActualExpenses, 'IDR') }}</td>
                    <td class="text-right" :class="totalBudgetVariance <= 0 ? 'text-success' : 'text-danger'">
                      {{ totalBudgetVariance <= 0 ? '' : '+' }}{{ totalBudgetVariance }}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>

  <!-- Tax Planning -->
  <CCol lg="5">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Tax Planning</h5>
          <small class="text-muted">{{ currentYear }} Tax Calendar</small>
        </div>
        <CButton color="light" size="sm">
          <CIcon name="cil-calculator" /> Tax Calculator
        </CButton>
      </CCardHeader>
      <CCardBody class="p-0">
        <CListGroup>
          <CListGroupItem v-for="taxEvent in upcomingTaxEvents" :key="taxEvent.id" class="border-left-0 border-right-0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="font-weight-bold">{{ taxEvent.name }}</div>
                <small class="text-muted">Due {{ formatDate(taxEvent.dueDate) }}</small>
              </div>
              <div class="text-right">
                <CBadge :color="getTaxEventStatusColor(taxEvent.dueDate)">
                  {{ getDaysUntilDue(taxEvent.dueDate) }}
                </CBadge>
                <div v-if="taxEvent.estimatedAmount" class="small mt-1">
                  Est. {{ formatCurrency(taxEvent.estimatedAmount, 'IDR') }}
                </div>
              </div>
            </div>
          </CListGroupItem>
        </CListGroup>
      </CCardBody>
      <CCardFooter>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="font-weight-bold">Estimated Annual Tax</div>
            <small class="text-muted">Based on current projections</small>
          </div>
          <div class="text-right">
            <div class="h4 mb-0">{{ formatCurrency(taxSummary.estimatedAnnualTax, 'IDR') }}</div>
            <small :class="taxSummary.changeFromLastYear >= 0 ? 'text-danger' : 'text-success'">
              {{ taxSummary.changeFromLastYear >= 0 ? '+' : '' }}{{ taxSummary.changeFromLastYear }}% from last year
            </small>
          </div>
        </div>
        <CButton color="light" size="sm" block>
          <CIcon name="cil-calendar" /> View Full Tax Calendar
        </CButton>
      </CCardFooter>
    </CCard>
  </CCol>
</CRow>

<!-- Business Growth Planning -->
<CCard class="mb-4">
  <CCardHeader class="d-flex justify-content-between align-items-center">
    <div>
      <h5 class="mb-0">Business Growth Planning</h5>
      <small class="text-muted">Revenue and profitability projections</small>
    </div>
    <CButtonGroup size="sm">
      <CButton color="outline-primary" :pressed="growthPeriod === 'quarterly'" @click="growthPeriod = 'quarterly'">Quarterly</CButton>
      <CButton color="outline-primary" :pressed="growthPeriod === 'annual'" @click="growthPeriod = 'annual'">Annual</CButton>
      <CButton color="outline-primary" :pressed="growthPeriod === '3year'" @click="growthPeriod = '3year'">3 Year</CButton>
    </CButtonGroup>
  </CCardHeader>
  <CCardBody>
    <BusinessGrowthChart :chartData="businessGrowthData" style="height: 300px;" />
    
    <div class="row mt-4">
      <div class="col-md-3">
        <CCallout color="info">
          <div class="text-muted small">Revenue Growth</div>
          <div class="font-weight-bold h4">+{{ businessGrowthMetrics.revenueGrowth }}%</div>
          <div class="small">Year-over-year</div>
        </CCallout>
      </div>
      <div class="col-md-3">
        <CCallout color="success">
          <div class="text-muted small">Profit Margin</div>
          <div class="font-weight-bold h4">{{ businessGrowthMetrics.profitMargin }}%</div>
          <div class="small" :class="businessGrowthMetrics.profitMarginChange >= 0 ? 'text-success' : 'text-danger'">
            {{ businessGrowthMetrics.profitMarginChange >= 0 ? '+' : '' }}{{ businessGrowthMetrics.profitMarginChange }}% from last year
          </div>
        </CCallout>
      </div>
      <div class="col-md-3">
        <CCallout color="warning">
          <div class="text-muted small">Customer Acquisition Cost</div>
          <div class="font-weight-bold h4">{{ formatCurrency(businessGrowthMetrics.customerAcquisitionCost, 'IDR') }}</div>
          <div class="small" :class="businessGrowthMetrics.cacChange <= 0 ? 'text-success' : 'text-danger'">
            {{ businessGrowthMetrics.cacChange <= 0 ? '' : '+' }}{{ businessGrowthMetrics.cacChange }}% from last year
          </div>
        </CCallout>
      </div>
      <div class="col-md-3">
        <CCallout color="danger">
          <div class="text-muted small">Burn Rate</div>
          <div class="font-weight-bold h4">{{ formatCurrency(businessGrowthMetrics.burnRate, 'IDR') }}</div>
          <div class="small">Monthly average</div>
        </CCallout>
      </div>
    </div>
  </CCardBody>
  <CCardFooter>
    <CButton color="primary" size="sm">
      <CIcon name="cil-pencil" /> Update Growth Projections
    </CButton>
  </CCardFooter>
</CCard>

<!-- Project Planning & Debt Management -->
<CRow>
  <!-- Project Financial Planning -->
  <CCol lg="7">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Project Financial Planning</h5>
          <small class="text-muted">Active projects budget tracking</small>
        </div>
        <CButton color="primary" size="sm">
          <CIcon name="cil-plus" /> New Project
        </CButton>
      </CCardHeader>
      <CCardBody class="p-0">
        <CDataTable
          :items="projects"
          :fields="projectFields"
          hover
          responsive
          class="mb-0 border-0"
        >
          <template #project="{item}">
            <div class="d-flex align-items-center">
              <div :class="`c-avatar p-1 mr-2 ${getProjectStatusColor(item.status)}`">
                <CIcon name="cil-briefcase" class="text-white" />
              </div>
              <div>
                <div class="font-weight-bold">{{ item.name }}</div>
                <small class="text-muted">{{ item.manager }} • {{ item.status }}</small>
              </div>
            </div>
          </template>
          <template #budget="{item}">
            <div>
              <div class="font-weight-bold">{{ formatCurrency(item.budget, 'IDR') }}</div>
              <div class="d-flex justify-content-between small">
                <span>Spent: {{ formatCurrency(item.spent, 'IDR') }}</span>
                <span :class="item.budgetVariance <= 0 ? 'text-success' : 'text-danger'">
                  {{ item.budgetVariance <= 0 ? '' : '+' }}{{ item.budgetVariance }}%
                </span>
              </div>
              <CProgress
                height="4px"
                :value="(item.spent / item.budget) * 100"
                :color="getBudgetProgressColor(item.budgetVariance)"
              />
            </div>
          </template>
          <template #timeline="{item}">
            <div>
              <div class="small">{{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}</div>
              <div class="d-flex justify-content-between small">
                <span>Progress:</span>
                <span>{{ item.progress }}%</span>
              </div>
              <CProgress
                height="4px"
                :value="item.progress"
                :color="getProjectProgressColor(item.progress, item.timelineVariance)"
              />
            </div>
          </template>
          <template #roi="{item}">
            <div class="font-weight-bold" :class="item.roi >= 0 ? 'text-success' : 'text-danger'">
              {{ item.roi >= 0 ? '+' : '' }}{{ item.roi }}%
            </div>
            <small class="text-muted">Est. {{ formatCurrency(item.projectedReturn, 'IDR') }}</small>
          </template>
          <template #actions="{item}">
            <CButtonGroup size="sm">
              <CButton color="light" title="View Details">
                <CIcon name="cil-chart" />
              </CButton>
              <CButton color="light" title="Edit Project">
                <CIcon name="cil-pencil" />
              </CButton>
            </CButtonGroup>
          </template>
        </CDataTable>
      </CCardBody>
      <CCardFooter>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>Total Budget:</strong> {{ formatCurrency(totalProjectBudget, 'IDR') }}
          </div>
          <CButton color="link" size="sm">View All Projects</CButton>
        </div>
      </CCardFooter>
    </CCard>
  </CCol>

  <!-- Debt Management -->
  <CCol lg="5">
    <CCard class="mb-4">
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Debt Management</h5>
          <small class="text-muted">Loans and repayment planning</small>
        </div>
        <CButton color="primary" size="sm">
          <CIcon name="cil-plus" /> Add Loan
        </CButton>
      </CCardHeader>
      <CCardBody class="p-0">
        <CListGroup>
          <CListGroupItem v-for="loan in loans" :key="loan.id" class="border-left-0 border-right-0">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div class="font-weight-bold">{{ loan.name }}</div>
                <small class="text-muted">{{ loan.lender }} • {{ loan.type }}</small>
              </div>
              <CBadge :color="getLoanStatusColor(loan.status)">
                {{ loan.status }}
              </CBadge>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="small text-muted">Principal</div>
                <div>{{ formatCurrency(loan.principal, 'IDR') }}</div>
              </div>
              <div class="col-6">
                <div class="small text-muted">Interest Rate</div>
                <div>{{ loan.interestRate }}%</div>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <div class="small text-muted">Monthly Payment</div>
                <div>{{ formatCurrency(loan.monthlyPayment, 'IDR') }}</div>
              </div>
              <div class="col-6">
                <div class="small text-muted">Next Payment</div>
                <div>{{ formatDate(loan.nextPaymentDate) }}</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="d-flex justify-content-between small mb-1">
                <span>Paid: {{ formatCurrency(loan.amountPaid, 'IDR') }}</span>
                <span>{{ Math.round((loan.amountPaid / loan.principal) * 100) }}%</span>
              </div>
              <CProgress
                height="4px"
                :value="(loan.amountPaid / loan.principal) * 100"
                color="success"
              />
            </div>
          </CListGroupItem>
        </CListGroup>
      </CCardBody>
      <CCardFooter>
        <div class="row mb-3">
          <div class="col-6">
            <div class="text-muted small">Total Debt</div>
            <div class="font-weight-bold">{{ formatCurrency(debtSummary.totalDebt, 'IDR') }}</div>
          </div>
          <div class="col-6">
            <div class="text-muted small">Monthly Payments</div>
            <div class="font-weight-bold">{{ formatCurrency(debtSummary.monthlyPayments, 'IDR') }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-muted small">Debt-to-Income Ratio</div>
            <div class="font-weight-bold" :class="debtSummary.debtToIncomeRatio <= 0.4 ? 'text-success' : 'text-danger'">
              {{ debtSummary.debtToIncomeRatio * 100 }}%
            </div>
          </div>
          <div class="col-6">
            <div class="text-muted small">Avg. Interest Rate</div>
            <div class="font-weight-bold">{{ debtSummary.avgInterestRate }}%</div>
          </div>
        </div>
      </CCardFooter>
    </CCard>
  </CCol>
</CRow>

<!-- Investment Planning -->
<CCard class="mb-4">
  <CCardHeader class="d-flex justify-content-between align-items-center">
    <div>
      <h5 class="mb-0">Investment Planning</h5>
      <small class="text-muted">Portfolio allocation and performance</small>
    </div>
    <CButton color="primary" size="sm">
      <CIcon name="cil-plus" /> Add Investment
    </CButton>
  </CCardHeader>
  <CCardBody>
    <div class="row">
      <div class="col-md-4">
        <InvestmentAllocationChart :chartData="investmentAllocationData" style="height: 250px;" />
        <div class="text-center mt-3">
          <div class="h4 mb-0">{{ formatCurrency(investmentSummary.totalInvestment, 'IDR') }}</div>
          <div class="text-muted">Total Investment</div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Investment</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Return</th>
                <th class="text-right">Performance</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="investment in investments" :key="investment.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-2" style="width: 12px; height: 12px; border-radius: 50%;" :style="{ backgroundColor: investment.color }"></div>
                    <div>
                      <div>{{ investment.name }}</div>
                      <small class="text-muted">{{ investment.type }}</small>
                    </div>
                  </div>
                </td>
                <td class="text-right">{{ formatCurrency(investment.amount, 'IDR') }}</td>
                <td class="text-right">{{ formatCurrency(investment.return, 'IDR') }}</td>
                <td class="text-right">
                  <CBadge :color="getInvestmentPerformanceColor(investment.performance)">
                    {{ investment.performance >= 0 ? '+' : '' }}{{ investment.performance }}%
                  </CBadge>
                </td>
                <td class="text-right">
                  <CButtonGroup size="sm">
                    <CButton color="light" title="View Details">
                      <CIcon name="cil-chart" />
                    </CButton>
                    <CButton color="light" title="Edit Investment">
                      <CIcon name="cil-pencil" />
                    </CButton>
                  </CButtonGroup>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </CCardBody>
  <CCardFooter>
    <div class="row">
      <div class="col-md-3">
        <div class="text-muted small">Total Return</div>
        <div class="font-weight-bold">{{ formatCurrency(investmentSummary.totalReturn, 'IDR') }}</div>
      </div>
      <div class="col-md-3">
        <div class="text-muted small">ROI</div>
        <div class="font-weight-bold" :class="investmentSummary.overallROI >= 0 ? 'text-success' : 'text-danger'">
          {{ investmentSummary.overallROI >= 0 ? '+' : '' }}{{ investmentSummary.overallROI }}%
        </div>
      </div>
      <div class="col-md-3">
        <div class="text-muted small">Annualized Return</div>
        <div class="font-weight-bold" :class="investmentSummary.annualizedReturn >= 0 ? 'text-success' : 'text-danger'">
          {{ investmentSummary.annualizedReturn >= 0 ? '+' : '' }}{{ investmentSummary.annualizedReturn }}%
        </div>
      </div>
      <div class="col-md-3">
        <div class="text-muted small">Projected Year-End</div>
        <div class="font-weight-bold">{{ formatCurrency(investmentSummary.projectedYearEnd, 'IDR') }}</div>
      </div>
    </div>
  </CCardFooter>
</CCard>
       </CCol>
      </CRow>
      
    </div>
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";
import { CCardHeader } from "@coreui/vue-pro";
import ProfileApi from "@/lib/profileApi";
import CertificateApi from "@/lib/certificateApi";
import moment from "moment";
import FinancialGoalsWidgets from '../widgets/FinancialGoalsWidgets';
import BudgetOverviewChart from '../widgets/BudgetOverviewChart';
import ExtendedCashFlowChart from '../widgets/ExtendedCashFlowChart';
import BudgetAllocationChart from '../widgets/BudgetAllocationChart';
import BusinessGrowthChart from '../widgets/BusinessGrowthChart';
import InvestmentAllocationChart from '../widgets/InvestmentAllocationChart';


export default {
  name: "DashboardPlanner",
  freeSet,
  components: {
    FinancialGoalsWidgets,
    BudgetOverviewChart,
    ExtendedCashFlowChart,
    BudgetAllocationChart,
    BusinessGrowthChart,
    InvestmentAllocationChart
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      budgetPeriod: 'monthly',
      forecastRange: 6,
      growthPeriod: 'annual',
      currentCashBalance: 27371.50,
      
      // Financial Goals Summary
      financialGoalsSummary: {
        totalGoals: 5,
        completedGoals: 1,
        inProgressGoals: 3,
        atRiskGoals: 1,
        averageProgress: 42
      },
      
      // Budget Summary
      budgetSummary: {
        totalBudget: 150000.00,
        actualExpenses: 62500.00,
        remainingBudget: 87500.00,
        expenseVariance: -5.2
      },
      
      // Financial Goals
      financialGoals: [
        {
          id: 1,
          name: 'Increase Revenue',
          category: 'Growth',
          targetAmount: 500000.00,
          currentAmount: 325000.00,
          progress: 65,
          targetDate: new Date(2025, 11, 31)
        },
        {
          id: 2,
          name: 'Emergency Fund',
          category: 'Savings',
          targetAmount: 100000.00,
          currentAmount: 75000.00,
          progress: 75,
          targetDate: new Date(2025, 8, 30)
        },
        {
          id: 3,
          name: 'Reduce Operating Costs',
          category: 'Efficiency',
          targetAmount: 50000.00,
          currentAmount: 12500.00,
          progress: 25,
          targetDate: new Date(2025, 9, 30)
        },
        {
          id: 4,
          name: 'New Office Equipment',
          category: 'Capital',
          targetAmount: 25000.00,
          currentAmount: 5000.00,
          progress: 20,
          targetDate: new Date(2025, 6, 30)
        },
        {
          id: 5,
          name: 'Marketing Campaign',
          category: 'Marketing',
          targetAmount: 30000.00,
          currentAmount: 7500.00,
          progress: 25,
          targetDate: new Date(2025, 5, 15)
        }
      ],
      
      // Cash Flow Scenarios
      cashFlowScenarios: {
        optimistic: {
          endingBalance: 45000.00,
          growth: 64.4
        },
        conservative: {
          endingBalance: 32500.00,
          growth: 18.7
        }
      },
      
      // Budget Categories
      budgetCategories: [
        {
          id: 1,
          name: 'Payroll',
          budget: 75000.00,
          actual: 31250.00,
          variance: -2.5,
          color: '#321fdb'
        },
        {
          id: 2,
          name: 'Rent & Utilities',
          budget: 25000.00,
          actual: 10500.00,
          variance: 1.2,
          color: '#e55353'
        },
        {
          id: 3,
          name: 'Marketing',
          budget: 20000.00,
          actual: 8750.00,
          variance: 5.3,
          color: '#f9b115'
        },
        {
          id: 4,
          name: 'Operations',
          budget: 15000.00,
          actual: 6250.00,
          variance: 0.8,
          color: '#2eb85c'
        },
        {
          id: 5,
          name: 'Technology',
          budget: 10000.00,
          actual: 4250.00,
          variance: 2.1,
          color: '#3399ff'
        },
        {
          id: 6,
          name: 'Other',
          budget: 5000.00,
          actual: 1500.00,
          variance: -27.5,
          color: '#ced2d8'
        }
      ],
      
      // Tax Planning
      upcomingTaxEvents: [
        {
          id: 1,
          name: 'Quarterly VAT Return',
          dueDate: new Date(2025, 6, 31),
          estimatedAmount: 12500.00
        },
        {
          id: 2,
          name: 'Employee Income Tax',
          dueDate: new Date(2025, 5, 15),
          estimatedAmount: 8750.00
        },
        {
          id: 3,
          name: 'Corporate Income Tax Installment',
          dueDate: new Date(2025, 7, 15),
          estimatedAmount: 15000.00
        },
        {
          id: 4,
          name: 'Annual Tax Return Deadline',
          dueDate: new Date(2025, 11, 31),
          estimatedAmount: null
        }
      ],
      taxSummary: {
        estimatedAnnualTax: 87500.00,
        changeFromLastYear: 12.5
      },
      
      // Business Growth Metrics
      businessGrowthMetrics: {
        revenueGrowth: 18.5,
        profitMargin: 22.3,
        profitMarginChange: 2.1,
        customerAcquisitionCost: 1250.00,
        cacChange: -5.2,
        burnRate: 12500.00
      },
      
      // Projects
      projects: [
        {
          id: 1,
          name: 'Website Redesign',
          manager: 'John Doe',
          status: 'In Progress',
          budget: 25000.00,
          spent: 12500.00,
          budgetVariance: -5.2,
          startDate: new Date(2025, 3, 1),
          endDate: new Date(2025, 6, 30),
          progress: 45,
          timelineVariance: 2,
          roi: 150,
          projectedReturn: 62500.00
        },
        {
          id: 2,
          name: 'ERP Implementation',
          manager: 'Jane Smith',
          status: 'Planning',
          budget: 75000.00,
          spent: 15000.00,
          budgetVariance: 0,
          startDate: new Date(2025, 5, 1),
          endDate: new Date(2025, 11, 30),
          progress: 15,
          timelineVariance: 0,
          roi: 200,
          projectedReturn: 225000.00
        },
        {
          id: 3,
          name: 'Office Expansion',
          manager: 'Mike Johnson',
          status: 'At Risk',
          budget: 50000.00,
          spent: 35000.00,
          budgetVariance: 12.5,
          startDate: new Date(2025, 2, 15),
          endDate: new Date(2025, 5, 15),
          progress: 65,
          timelineVariance: 15,
          roi: 50,
          projectedReturn: 75000.00
        },
        {
          id: 4,
          name: 'Product Launch',
          manager: 'Sarah Lee',
          status: 'On Track',
          budget: 35000.00,
          spent: 17500.00,
          budgetVariance: -2.1,
          startDate: new Date(2025, 4, 1),
          endDate: new Date(2025, 7, 31),
          progress: 50,
          timelineVariance: -5,
          roi: 300,
          projectedReturn: 140000.00
        }
      ],
      projectFields: [
        { key: 'project', label: 'Project' },
        { key: 'budget', label: 'Budget' },
        { key: 'timeline', label: 'Timeline' },
        { key: 'roi', label: 'ROI' },
        { key: 'actions', label: '', _style: 'width: 100px' }
      ],
      
      // Loans
      loans: [
        {
          id: 1,
          name: 'Business Expansion Loan',
          lender: 'BCA Bank',
          type: 'Term Loan',
          status: 'Active',
          principal: 250000.00,
          interestRate: 8.5,
          monthlyPayment: 5250.00,
          nextPaymentDate: new Date(2025, 5, 15),
          amountPaid: 75000.00
        },
        {
          id: 2,
          name: 'Equipment Financing',
          lender: 'Mandiri Bank',
          type: 'Asset Loan',
          status: 'Active',
          principal: 75000.00,
          interestRate: 7.2,
          monthlyPayment: 2250.00,
          nextPaymentDate: new Date(2025, 5, 10),
          amountPaid: 37500.00
        },
        {
          id: 3,
          name: 'Working Capital Line',
          lender: 'BNI Bank',
          type: 'Revolving Credit',
          status: 'Available',
          principal: 100000.00,
          interestRate: 9.5,
          monthlyPayment: 0.00,
          nextPaymentDate: null,
          amountPaid: 0.00
        }
      ],
      debtSummary: {
        totalDebt: 325000.00,
        monthlyPayments: 7500.00,
        debtToIncomeRatio: 0.35,
        avgInterestRate: 8.2
      },
      
      // Investments
      investments: [
        {
          id: 1,
          name: 'Stock Portfolio',
          type: 'Equity',
          amount: 75000.00,
          return: 12500.00,
          performance: 16.7,
          color: '#321fdb'
        },
        {
          id: 2,
          name: 'Government Bonds',
          type: 'Fixed Income',
          amount: 50000.00,
          return: 3500.00,
          performance: 7.0,
          color: '#2eb85c'
        },
        {
          id: 3,
          name: 'Real Estate',
          type: 'Property',
          amount: 125000.00,
          return: 15000.00,
          performance: 12.0,
          color: '#f9b115'
        },
        {
          id: 4,
          name: 'Mutual Funds',
          type: 'Mixed',
          amount: 35000.00,
          return: 4200.00,
          performance: 12.0,
          color: '#3399ff'
        },
        {
          id: 5,
          name: 'Corporate Bonds',
          type: 'Fixed Income',
          amount: 25000.00,
          return: 2250.00,
          performance: 9.0,
          color: '#e55353'
        }
      ],
      investmentSummary: {
        totalInvestment: 310000.00,
        totalReturn: 37450.00,
        overallROI: 12.1,
        annualizedReturn: 10.5,
        projectedYearEnd: 347500.00
      },
      loading: true,
      items: [],
      fields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "name" },
        { key: "documentType" },
        { key: "certificateNumber" },
        
        { key: "issuedDate", label: "Issued" },
        { key: "expiryDate", label: "Expiry" },
        { key: "reminderDate", label: "Reminder" },
        {
          key: "document_link",
          label: "Document",
          sorter: false,
          filter: false,
        },
       
      ],
      certificateApi: new CertificateApi(),
      profileaApi: new ProfileApi(),
      currentProfile: {},
      show: true,
      isCollapsed: true,
      addNewPopup: false,
      uploadedFiles: [],
      infoList: [],

      
      newObj: {
        name: "",
        documentId: null,
      },
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Dashboard", "Planner"]);
    this.fetchCurrentProfile();
    this.fetchCertificateList();
  },
  computed: {
     // Budget Chart Data
     budgetChartData() {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Budget',
            backgroundColor: 'rgba(50, 31, 219, 0.2)',
            borderColor: '#321fdb',
            pointBackgroundColor: '#321fdb',
            pointBorderColor: '#fff',
            data: [12500, 12500, 12500, 12500, 12500, 12500, 12500, 12500, 12500, 12500, 12500, 12500]
          },
          {
            label: 'Actual',
            backgroundColor: 'rgba(229, 83, 83, 0.2)',
            borderColor: '#e55353',
            pointBackgroundColor: '#e55353',
            pointBorderColor: '#fff',
            data: [11800, 12200, 13500, 12000, 13000, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      };
    },
    
    // Cash Flow Forecast Data
    cashFlowForecastData() {
      return {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Optimistic',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: [27371.50, 30000, 33000, 36500, 40500, 45000]
          },
          {
            label: 'Conservative',
            backgroundColor: 'rgba(51, 153, 255, 0.2)',
            borderColor: '#3399ff',
            pointBackgroundColor: '#3399ff',
            pointBorderColor: '#fff',
            data: [27371.50, 28500, 29500, 30500, 31500, 32500]
          }
        ]
      };
    },
    
    // Budget Allocation Data
    budgetAllocationData() {
      return {
        labels: this.budgetCategories.map(category => category.name),
        datasets: [
          {
            data: this.budgetCategories.map(category => category.budget),
            backgroundColor: this.budgetCategories.map(category => category.color)
          }
        ]
      };
    },
    
    // Business Growth Data
    businessGrowthData() {
      return {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
        datasets: [
          {
            label: 'Revenue',
            backgroundColor: '#3399ff',
            data: [125000, 145000, 160000, 185000]
          },
          {
            label: 'Expenses',
            backgroundColor: '#e55353',
            data: [100000, 110000, 120000, 140000]
          },
          {
            label: 'Profit',
            backgroundColor: '#2eb85c',
            data: [25000, 35000, 40000, 45000]
          }
        ]
      };
    },
    
    // Investment Allocation Data
    investmentAllocationData() {
      return {
        labels: this.investments.map(investment => investment.name),
        datasets: [
          {
            data: this.investments.map(investment => investment.amount),
            backgroundColor: this.investments.map(investment => investment.color)
          }
        ]
      };
    },
    
    // Total Budget Allocation
    totalBudgetAllocation() {
      return this.budgetCategories.reduce((sum, category) => sum + category.budget, 0);
    },
    
    // Total Actual Expenses
    totalActualExpenses() {
      return this.budgetCategories.reduce((sum, category) => sum + category.actual, 0);
    },
    
    // Total Budget Variance
    totalBudgetVariance() {
      const totalBudget = this.totalBudgetAllocation;
      const totalActual = this.totalActualExpenses;
      return Math.round(((totalActual - totalBudget) / totalBudget) * 100 * 10) / 10;
    },
    
    // Total Project Budget
    totalProjectBudget() {
      return this.projects.reduce((sum, project) => sum + project.budget, 0);
    },
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          issuedDate: this.getDisplayDate(item.issuedDate),
          expiryDate: this.getDisplayDate(item.expiryDate),
          reminderDate: this.getDisplayDate(item.reminderDate),
          documentName: this.getDocumentName(item),
          documentUrl: this.getDocumentUrl(item),
        };
      });
    },
    currentRole() {
      return this.currentProfile.appUser.role;
    },
    currentBusiness() {
      try {
        return this.currentProfile.defaultBusiness;
      } catch (error) {
        return null;
      }
    },
    currentBusinessShortName() {
      try {
        return this.currentProfile.defaultBusiness.shortName;
      } catch (error) {
        return "???";
      }
    },
  },

  methods: {
    formatCurrency(amount, currency) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },
    
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    
    getGoalCategoryColor(category) {
      const colorMap = {
        'Growth': 'bg-primary-gradient',
        'Savings': 'bg-success-gradient',
        'Efficiency': 'bg-danger-gradient',
        'Capital': 'bg-warning-gradient',
        'Marketing': 'bg-info-gradient'
      };
      return colorMap[category] || 'bg-secondary-gradient';
    },
    
    getGoalCategoryIcon(category) {
      const iconMap = {
        'Growth': 'cil-graph',
        'Savings': 'cil-bank',
        'Efficiency': 'cil-speedometer',
        'Capital': 'cil-building',
        'Marketing': 'cil-bullhorn'
      };
      return iconMap[category] || 'cil-star';
    },
    
    getGoalStatusColor(progress) {
      if (progress >= 75) return 'success';
      if (progress >= 25) return 'info';
      return 'warning';
    },
    
    getGoalProgressColor(progress) {
      if (progress >= 75) return 'success';
      if (progress >= 25) return 'info';
      return 'warning';
    },
    
    getTaxEventStatusColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return 'danger';
      } else if (diffDays <= 30) {
        return 'warning';
      } else if (diffDays <= 90) {
        return 'info';
      } else {
        return 'secondary';
      }
    },
    
    getDaysUntilDue(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
    },
    
    getProjectStatusColor(status) {
      const colorMap = {
        'On Track': 'bg-success-gradient',
        'In Progress': 'bg-info-gradient',
        'At Risk': 'bg-warning-gradient',
        'Delayed': 'bg-danger-gradient',
        'Planning': 'bg-secondary-gradient',
        'Completed': 'bg-dark-gradient'
      };
      return colorMap[status] || 'bg-secondary-gradient';
    },
    
    getBudgetProgressColor(variance) {
      if (variance <= 0) return 'success';
      if (variance <= 10) return 'warning';
      return 'danger';
    },
    
    getProjectProgressColor(progress, timelineVariance) {
      if (timelineVariance > 10) return 'danger';
      if (timelineVariance > 0) return 'warning';
      return 'success';
    },
    
    getLoanStatusColor(status) {
      const colorMap = {
        'Active': 'info',
        'Paid Off': 'success',
        'Overdue': 'danger',
        'Available': 'secondary'
      };
      return colorMap[status] || 'secondary';
    },
    
    getInvestmentPerformanceColor(performance) {
      if (performance >= 10) return 'success';
      if (performance >= 0) return 'info';
      if (performance >= -10) return 'warning';
      return 'danger';
    },
    getDocumentName(item) {
      console.log("item", item);
      try {
        if (item.certificateDocuments[0].document == null) return "Unknown";
      if (item.certificateDocuments[0].document.fileName == null) return "Unknown";

      return item.certificateDocuments[0].document.fileName;
      } catch (error) {
        return "Unknown";
      }
    },
    getDocumentUrl(item) {
      try {
        return apiUrl + "documents/file/" + item.certificateDocuments[0].documentId;
        
      } catch (error) {
        return "N/A";
      }
    },
    getDisplayDate(dt) {
      return moment(dt).format("DD/MM/YYYY");
    },
    fetchCertificateList() {
      var self = this;
      self.loading = false;
      self.certificateApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchCurrentProfile() {
      var self = this;
      this.profileaApi
        .getCurrentProfile()
        .then((response) => {
          self.currentProfile = response.result;
          console.log("currentProfile", self.currentProfile);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>

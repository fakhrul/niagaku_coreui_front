<template>
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="primary"
          :header="formatCurrency(cashPosition.totalCash, 'IDR')"
          text="Total Cash"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div :class="cashPosition.cashChange >= 0 ? 'text-success' : 'text-danger'">
                {{ cashPosition.cashChange >= 0 ? '+' : '' }}{{ cashPosition.cashChange }}%
              </div>
              <div class="text-muted">vs last month</div>
            </div>
          </template>
          <template #default>
            <CDropdown
              color="transparent p-0"
              placement="bottom-end"
            >
              <template #toggler-content>
                <CIcon name="cil-options" />
              </template>
              <CDropdownItem>View Details</CDropdownItem>
              <CDropdownItem>Export Report</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="success"
          :header="formatCurrency(cashPosition.totalReceivables, 'IDR')"
          text="Accounts Receivable"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div :class="cashPosition.receivablesChange >= 0 ? 'text-success' : 'text-danger'">
                {{ cashPosition.receivablesChange >= 0 ? '+' : '' }}{{ cashPosition.receivablesChange }}%
              </div>
              <div class="text-muted">vs last month</div>
            </div>
          </template>
          <template #default>
            <CDropdown
              color="transparent p-0"
              placement="bottom-end"
            >
              <template #toggler-content>
                <CIcon name="cil-options" />
              </template>
              <CDropdownItem>View Invoices</CDropdownItem>
              <CDropdownItem>Send Reminders</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="danger"
          :header="formatCurrency(cashPosition.totalPayables, 'IDR')"
          text="Accounts Payable"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div :class="cashPosition.payablesChange >= 0 ? 'text-danger' : 'text-success'">
                {{ cashPosition.payablesChange >= 0 ? '+' : '' }}{{ cashPosition.payablesChange }}%
              </div>
              <div class="text-muted">vs last month</div>
            </div>
          </template>
          <template #default>
            <CDropdown
              color="transparent p-0"
              placement="bottom-end"
            >
              <template #toggler-content>
                <CIcon name="cil-options" />
              </template>
              <CDropdownItem>View Bills</CDropdownItem>
              <CDropdownItem>Schedule Payments</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="info"
          :header="formatCurrency(cashPosition.netPosition, 'IDR')"
          text="Net Cash Position"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div :class="cashPosition.netPositionChange >= 0 ? 'text-success' : 'text-danger'">
                {{ cashPosition.netPositionChange >= 0 ? '+' : '' }}{{ cashPosition.netPositionChange }}%
              </div>
              <div class="text-muted">vs last month</div>
            </div>
          </template>
          <template #default>
            <CDropdown
              color="transparent p-0"
              placement="bottom-end"
            >
              <template #toggler-content>
                <CIcon name="cil-options" />
              </template>
              <CDropdownItem>View Report</CDropdownItem>
              <CDropdownItem>Export Data</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  </template>
  
  <script>
  export default {
    name: 'CashPositionWidgets',
    props: {
      cashPosition: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatCurrency(amount, currency) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      }
    }
  }
  </script>
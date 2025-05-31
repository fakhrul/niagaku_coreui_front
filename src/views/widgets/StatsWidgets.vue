<template>
  <CRow>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        class="mb-4"
        color="primary"
        header="$24,345.00"
        text="Total Revenue"
      >
        <template #footer>
          <div class="d-flex justify-content-between">
            <div class="text-success">+12.5%</div>
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
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
          </CDropdown>
        </template>
      </CWidgetDropdown>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetDropdown
        class="mb-4"
        color="danger"
        header="$12,340.00"
        text="Total Expenses"
      >
        <template #footer>
          <div class="d-flex justify-content-between">
            <div class="text-danger">-2.3%</div>
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
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
          </CDropdown>
        </template>
      </CWidgetDropdown>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetDropdown
        class="mb-4"
        color="success"
        header="$12,005.00"
        text="Net Profit"
      >
        <template #footer>
          <div class="d-flex justify-content-between">
            <div class="text-success">+18.2%</div>
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
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
          </CDropdown>
        </template>
      </CWidgetDropdown>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetDropdown
        class="mb-4"
        color="warning"
        header="$4,320.00"
        text="Pending Invoices"
      >
        <template #footer>
          <div class="d-flex justify-content-between">
            <div class="text-success">+5.1%</div>
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
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
          </CDropdown>
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'StatsWidgets'
}
</script>
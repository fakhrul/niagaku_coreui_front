<template>
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="primary"
          :header="goals.totalGoals.toString()"
          text="Total Goals"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div>
                <CIcon name="cil-chart" /> Financial Targets
              </div>
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
              <CDropdownItem>View All Goals</CDropdownItem>
              <CDropdownItem>Add New Goal</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="success"
          :header="goals.completedGoals.toString()"
          text="Completed Goals"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div>
                <CIcon name="cil-check" /> Achieved Targets
              </div>
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
              <CDropdownItem>View Completed</CDropdownItem>
              <CDropdownItem>Export Report</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="warning"
          :header="goals.inProgressGoals.toString()"
          text="In Progress"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div>
                <CIcon name="cil-reload" /> Active Goals
              </div>
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
              <CDropdownItem>View In Progress</CDropdownItem>
              <CDropdownItem>Update Progress</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
  
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          class="mb-4"
          color="danger"
          :header="goals.averageProgress + '%'"
          text="Average Progress"
        >
          <template #footer>
            <div class="d-flex justify-content-between">
              <div>
                <CIcon name="cil-speedometer" /> Overall Completion
              </div>
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
              <CDropdownItem>Generate Report</CDropdownItem>
            </CDropdown>
          </template>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  </template>
  
  <script>
  export default {
    name: 'FinancialGoalsWidgets',
    props: {
      goals: {
        type: Object,
        required: true
      }
    }
  }
  </script>
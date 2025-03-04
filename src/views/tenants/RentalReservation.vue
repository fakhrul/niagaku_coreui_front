<template>
  <div class="wrapper">
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
      <!-- Filter Inputs -->

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Additional Filter</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="4">
                  <CSelect
                    v-model="filterCriteria.rentalProductId"
                    :options="filterRentalProducts"
                    label="Rental Product"
                  />
                </CCol>
                <CCol sm="4">
                  <CInput
                    label="Start Date"
                    type="date"
                    v-model="filterCriteria.startDate"
                  />
                </CCol>
                <CCol sm="4">
                  <CInput
                    label="End Date"
                    type="date"
                    v-model="filterCriteria.endDate"
                  />
                </CCol>
                <CCol sm="4">
                  <CSelect
                  :value.sync="filterCriteria.cleaningIsPaid"
                    :options="[
                      { value: '', label: 'All' },
                      { value: 'true', label: 'Paid' },
                      { value: 'false', label: 'Not Paid' },
                    ]"
                    label="Cleaning Paid?"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="4">
                  <CFormGroup wrapperClasses="input-group pt-2">
                    <template #label>Is Minimum Days? </template>
                    <template #input>
                      <CSwitch
                        class="mr-1"
                        color="primary"
                        :checked.sync="filterCriteria.minDaysFilter"
                        label-on="YES"
                        label-off="NO"
                      />
                    </template>
                  </CFormGroup>
                </CCol>
                <CCol sm="4">
                  <CInput
                    label="Total Days"
                    type="number"
                    v-model="filterCriteria.totalDays"
                  />
                </CCol>
              </CRow>
              <!-- Row for Button -->
              <CRow class="d-flex justify-content-end mt-3">
                <CCol sm="auto">
                  <CButton
                    size="sm"
                    color="secondary"
                    class="ml-1"
                    @click="onCleanerClick"
                  >
                    Clear
                  </CButton>
                  <CButton
                    size="sm"
                    color="info"
                    class="ml-1"
                    @click="refreshTable"
                  >
                    Search
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> Reservation </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="12">
                  <div>
                    <calendar-view
                      id="calendar"
                      :events="events"
                      enable-drag-drop
                      :show-date="showDate"
                      :displayPeriodUom="displayPeriod"
                      :class="themeClasses"
                      currentPeriodLabel="icons"
                      @click-date="onClickDay"
                      @click-event="onClickEvent"
                      @drop-on-date="onDrop"
                      @show-date-change="setShowDate"
                      ref="calendarView"
                    >
                      <calendar-view-header
                        slot="header"
                        slot-scope="{ headerProps }"
                        :header-props="headerProps"
                        @input="setShowDate"
                      />
                    </calendar-view>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CForm inline>
                <CSelect
                  :options="['year', 'month', 'week']"
                  :value.sync="displayPeriod"
                  label="View"
                  add-wrapper-classes="ml-2"
                />
                <h4 class="ml-auto my-auto">
                  <CBadge v-if="message" color="primary">{{ message }}</CBadge>
                </h4>
              </CForm>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader> Reservation Date </CCardHeader>
            <CCardBody>
              <CDataTable :items="computedItems" :fields="fields">
                <template #show_select="{ item }">
                  <td class="py-2">
                    <CInputCheckbox
                      :checked="selectedReservations.includes(item.id)"
                      @change="toggleSelection(item.id)"
                    />

                    <!-- <CInput
                      type="checkbox"
                      v-model="selectedReservations"
                      :value="item.id"
                    /> -->
                  </td>
                </template>

                <template #show_index="{ index }">
                  <td class="py-2">
                    {{ index + 1 }}
                  </td>
                </template>
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CDropdown toggler-text="Action" class="m-2" color="light">
                      <CDropdownItem @click="onEdit(item)"
                        >View/Edit</CDropdownItem
                      >
                      <CDropdownItem @click="onDuplicate(item)"
                        >Duplicate</CDropdownItem
                      >
                      <CDropdownDivider />
                      <CDropdownItem>Print</CDropdownItem>
                      <CDropdownItem>Export to PDF</CDropdownItem>
                      <CDropdownDivider />
                      <CDropdownItem @click="showDeleteConfirmation(item)"
                        >Delete</CDropdownItem
                      >
                    </CDropdown>
                  </td>
                </template>
                <!-- ✅ Add Footer -->
                <template #footer>
                  <tr>
                    <td colspan="6"><strong></strong></td>
                    <td>
                      <strong> {{ totalDays }}</strong>
                    </td>
                    <td colspan="1"></td>
                    <td>
                      <strong>{{ totalCleaningCost.toFixed(2) }}</strong>
                    </td>
                    <td colspan="1"></td>
                    <td>
                      <strong>{{ totalLaundryCost.toFixed(2) }}</strong>
                    </td>
                    <td>
                      <strong>{{ totalCost.toFixed(2) }}</strong>
                    </td>
                  </tr>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol>
                  <CButton color="secondary" @click="selectAllFiltered">
                    Select All Filtered
                  </CButton>
                  <CButton color="secondary" @click="deselectAll">
                    Deselect All
                  </CButton>
                  <CButton
                    color="primary"
                    :disabled="selectedReservations.length === 0"
                    @click="openBatchEditModal"
                  >
                    Batch Edit
                  </CButton>
                  <CButton color="primary" @click="exportTableAsImage"
                    >Export as Image</CButton
                  >
                  <!-- <CButton
                    color="danger"
                    :disabled="selectedReservations.length === 0"
                    @click="deleteBatchReservations"
                  >
                    Delete Selected
                  </CButton> -->
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
    <div>
      <CModal
        title="Add/Update Reservation"
        size="xl"
        :show.sync="addReservationFormPopup"
        :no-close-on-backdrop="true"
      >
        <CRow form>
          <CCol sm="12">
            <CSelect
              :value.sync="itemReservationTemp.rentalProductId"
              :options="rentalProducts"
              label="Rental Product"
            />
            <CInput
              label="Start"
              type="date"
              v-model="itemReservationTemp.startDate"
              placeholder="Start Date"
            />
            <CInput
              label="End"
              type="date"
              v-model="itemReservationTemp.endDate"
              placeholder="End Date"
            />
            <CInput
              label="Customer Name"
              v-model="itemReservationTemp.customerName"
            />
            <CInput
              label="Customer Phone"
              v-model="itemReservationTemp.customerPhone"
            />

            <CInput
              label="Price"
              type="number"
              v-model="itemReservationTemp.price"
              placeholder="Price"
            />

            <CInput
              label="Cleaning Cost"
              type="number"
              v-model="itemReservationTemp.cleaningCost"
              placeholder="Price"
            />
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> Is Paid? </CCol>
              <CCol sm="9">
                <CSwitch
                  class="mr-1"
                  color="primary"
                  :checked.sync="itemReservationTemp.cleaningIsPaid"
                  label-on="YES"
                  label-off="NO"
                >
                </CSwitch
              ></CCol>
            </CRow>
            <CInput
              label="Cleaning Payment Date"
              type="date"
              v-model="itemReservationTemp.cleaningPaymentDate"
            />
            <!-- <CButton color="primary" @click="saveReservation"
              >Save Reservation</CButton
            > -->
          </CCol>
        </CRow>

        <!-- ✅ Buttons Section -->
        <template #footer>
          <CButton color="secondary" @click="cancelReservation">
            Cancel
          </CButton>
          <CButton
            color="danger"
            v-if="itemReservationTemp.id"
            @click="deleteReservation"
          >
            Delete
          </CButton>
          <CButton color="primary" @click="saveReservation"> Save </CButton>
        </template>
      </CModal>
    </div>
    <div>
      <CModal
        title="Batch Edit Reservations"
        size="lg"
        :show.sync="batchEditPopup"
        :no-close-on-backdrop="true"
      >
        <CRow form>
          <CCol>
            <CRow>
              <CCol><strong>Item To Edit</strong></CCol>
              <CCol><strong>Edit Info</strong></CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CFormGroup wrapperClasses="input-group pt-2">
                  <template #label>Cleaning Payment Status? </template>
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.editCleaningIsPaid"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                </CFormGroup>
              </CCol>
              <CCol sm="6">
                <CFormGroup wrapperClasses="input-group pt-2">
                  <!-- <template #label>Cleaning Is Paid? </template> -->
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.cleaningIsPaid"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                  <template #description>Cleaning Is Paid? </template>
                </CFormGroup>
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol>
                <CFormGroup wrapperClasses="input-group pt-2">
                  <template #label>Cleaning Cost? </template>
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.editCleaningCost"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                </CFormGroup>
              </CCol>
              <CCol>
                <CInput type="number" v-model="batchEditData.cleaningCost" />
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol sm="6">
                <CFormGroup wrapperClasses="input-group pt-2">
                  <template #label>Laundry Payment Status? </template>
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.editLaundryIsPaid"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                </CFormGroup>
              </CCol>
              <CCol sm="6">
                <CFormGroup wrapperClasses="input-group pt-2">
                  <!-- <template #label>Cleaning Is Paid? </template> -->
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.laundryIsPaid"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                  <template #description>Laundry Is Paid? </template>
                </CFormGroup>
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol>
                <CFormGroup wrapperClasses="input-group pt-2">
                  <template #label>Laundry Cost? </template>
                  <template #input>
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="batchEditData.editLaundryCost"
                      label-on="YES"
                      label-off="NO"
                    />
                  </template>
                </CFormGroup>
              </CCol>
              <CCol>
                <CInput type="number" v-model="batchEditData.laundryCost" />
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        <!-- Modal Footer -->
        <template #footer>
          <CButton color="secondary" @click="batchEditPopup = false">
            Cancel
          </CButton>
          <CButton color="primary" @click="saveBatchEdit">
            Save Changes
          </CButton>
        </template>
      </CModal>
    </div>
  </div>
</template>

<script>
// import BillApi from "@/lib/billApi";
import RentalReservationApi from "@/lib/rentalReservationApi";
import moment from "moment";
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from "vue-simple-calendar";
// import CalendarMathMixin from 'vue-simple-calendar/dist/calendar-math-mixin.js'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
import "vue-simple-calendar/static/css/default.css";
import "vue-simple-calendar/static/css/holidays-us.css";
import RentalProductApi from "@/lib/rentalProductApi";
import html2canvas from "html2canvas";

const currDate = new Date();
const currYear = currDate.getFullYear();
const currMonth = currDate.getMonth();

export default {
  name: "RentalReservation",
  mixins: [CalendarMathMixin],
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  data() {
    const today = new Date();

    // Convert to Malaysia Timezone (UTC+8) without shifting date unexpectedly
    function toMalaysiaISODate(date) {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().split("T")[0];
    }

    // Get first day of the current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

    // Get date three months from today
    const threeMonthsLater = new Date(
      today.getFullYear(),
      today.getMonth() + 3,
      today.getDate()
    );

    return {
      batchEditPopup: false, // Controls the modal visibility
      batchEditData: {
        editCleaningIsPaid: false,
        cleaningIsPaid: false, // Default value
        editCleaningCost: false,
        cleaningCost: 0, // Default value

        editLaundryIsPaid: false,
        laundryIsPaid: false, // Default value
        editLaundryCost: false,
        laundryCost: 0, // Default value
      },
      selectedReservations: [],
      filterCriteria: {
        rentalProductId: "",
        startDate: toMalaysiaISODate(firstDayOfYear),
        endDate: toMalaysiaISODate(lastDayOfYear),
        totalDays: "", // ✅ New filter for total days
        cleaningIsPaid: "", // ✅ New filter for cleaning payment status
        minDaysFilter: false, // false = exact match, true = minimum days filter
      },
      fields: [
        {
          key: "show_select",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "productName", label: "Rental" },
        { key: "customerName", label: "Customer" },
        { key: "startDate", label: "Start" },
        { key: "endDate", label: "End" },
        { key: "totalDays", label: "Total Days" }, // ✅ New column
        { key: "cleaningIsPaid", label: "Housekeeping Paid?" }, // ✅ New column
        { key: "cleaningCostInRM", label: "Housekeeping" }, // ✅ New column
        // { key: "cleaningPaymentDate", label: "Payment Date" }, // ✅ New column

        { key: "laundryIsPaid", label: "Laundry Paid?" }, // ✅ New column
        { key: "laundryCostInRM", label: "Laundry" }, // ✅ New column
        // { key: "laundryPaymentDate", label: "Payment Date" }, // ✅ New column

        // { key: "price", label: "Price" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      itemReservationTemp: {},
      addReservationFormPopup: false,

      statuses: [],
      items: [],
      availability: {
        startDate: "",
        endDate: "",
        price: 0,
        status: 0,
      },
      filterRentalProducts: [],
      rentalProducts: [],
      infoList: [],
      message: "",
      showDate: currDate,
      displayPeriod: "month",
      // events: sampleEvents,
      events: [],
      useDefaultTheme: true,
      coloredDays: {},
      // useHolidayTheme: true,
      api: new RentalReservationApi(),
      rentalProductApi: new RentalProductApi(),
    };
  },
  mounted() {
    this.fetchStatuses();

    this.loadRentalProducts();
    this.refreshTable();

    // console.log("CalendarView.props", CalendarView.props);
  },
  computed: {
    totalDays() {
      return this.computedItems.reduce((sum, item) => {
        return sum + (item.totalDays || 0);
      }, 0);
    },
    totalCost() {
      return this.totalLaundryCost + this.totalCleaningCost;
    },
    totalLaundryCost() {
      return this.computedItems.reduce((sum, item) => {
        return sum + (parseFloat(item.laundryCost) || 0);
      }, 0);
    },
    totalCleaningCost() {
      return this.computedItems.reduce((sum, item) => {
        return sum + (parseFloat(item.cleaningCost) || 0);
      }, 0);
    },
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          productName: this.getProductName(item),
          // customerName: this.getCustomerName(item),
          startDate: this.getDisplayDate(item.startDate),
          endDate: this.getDisplayDate(item.endDate),
          totalDays: this.calculateTotalDays(item.startDate, item.endDate), // ✅ Calculate days
          cleaningIsPaid: item.cleaningIsPaid ? "✅ Yes" : "❌ No", // ✅ Convert boolean to Yes/No
          cleaningCostInRM: item.cleaningCost ? `RM ${item.cleaningCost}` : "-", // ✅ Show cost or dash
          cleaningPaymentDate: item.cleaningPaymentDate
            ? this.getDisplayDate(item.cleaningPaymentDate)
            : "-", // ✅ Show formatted date or "-"
          laundryIsPaid: item.laundryIsPaid ? "✅ Yes" : "❌ No", // ✅ Convert boolean to Yes/No
          laundryCostInRM: item.laundryCost ? `RM ${item.laundryCost}` : "-", // ✅ Show cost or dash
          laundryPaymentDate: item.laundryPaymentDate
            ? this.getDisplayDate(item.laundryPaymentDate)
            : "-", // ✅ Show formatted date or "-"
        };
      });
    },

    themeClasses() {
      return {
        "theme-default": this.useDefaultTheme,
        "holiday-us-traditional": this.useHolidayTheme,
        "holiday-us-official": this.useHolidayTheme,
      };
    },
  },
  methods: {
    exportTableAsImage() {
      // const tableElement = document.querySelector(".c-data-table"); // Adjust the selector if needed
      const tableElement = document.querySelector("table"); // Adjust selector
      if (!tableElement) {
        alert("Table not found!");
        return;
      }

      html2canvas(tableElement, { scale: 2 }).then((canvas) => {
        const image = canvas.toDataURL("image/png"); // Convert to PNG format

        // Create a download link
        const link = document.createElement("a");
        link.href = image;
        link.download = "Rental_Reservations.png"; // Set the file name
        link.click();
      });
    },

    saveBatchEdit() {
      const updatedReservations = this.selectedReservations.map((id) => ({
        id,
        editCleaningIsPaid: this.batchEditData.editCleaningIsPaid,
        cleaningIsPaid: this.batchEditData.cleaningIsPaid,
        editCleaningCost: this.batchEditData.editCleaningCost,
        cleaningCost: this.batchEditData.cleaningCost,

        editLaundryIsPaid: this.batchEditData.editLaundryIsPaid,
        laundryIsPaid: this.batchEditData.laundryIsPaid,
        editLaundryCost: this.batchEditData.editLaundryCost,
        laundryCost: this.batchEditData.laundryCost,
      }));

      console.log("Batch updating reservations:", updatedReservations);

      this.api
        .updateBatch(updatedReservations)
        .then((response) => {
          this.refreshTable();
          this.deselectAll();
          this.infoList.push({
            header: "Success",
            message: "Reservation update",
            color: "success",
          });
          this.batchEditPopup = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });

      // Send batch update request to API
      //await this.api.batchUpdateCleaning(updatedReservations);

      // Refresh the table after update
      // this.refreshTable();
      // this.batchEditPopup = false; // Close modal
      // this.toast("Success", "Batch update successful", "success");
    },

    calculateTotalDays(startDate, endDate) {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // ✅ Convert to days
    },
    openBatchEditModal() {
      console.log("openBatchEditModal");

      if (this.selectedReservations.length === 0) {
        alert("Please select at least one reservation.");
        return;
      }

      // Pre-fill batch edit fields with the first selected reservation (if available)
      const firstReservation = this.items.find(
        (item) => item.id === this.selectedReservations[0]
      );

      this.batchEditData.editCleaningIsPaid = false;
      this.batchEditData.editCleaningCost = false;
      this.batchEditData.editLaundryIsPaid = false;
      this.batchEditData.editLaundryCost = false;

      if (firstReservation) {
        this.batchEditData.cleaningIsPaid = firstReservation.cleaningIsPaid;
        this.batchEditData.cleaningCost = firstReservation.cleaningCost || 0;
        this.batchEditData.laundryIsPaid = firstReservation.laundryIsPaid;
        this.batchEditData.laundryCost = firstReservation.laundryCost || 0;
      }

      this.batchEditPopup = true; // Show modal
    },
    toggleSelection(id) {
      const index = this.selectedReservations.indexOf(id);
      if (index === -1) {
        this.selectedReservations = [...this.selectedReservations, id]; // Ensure reactivity
      } else {
        this.selectedReservations = this.selectedReservations.filter(
          (item) => item !== id
        );
      }
      console.log("this.selectedReservations", this.selectedReservations);
    },
    deselectAll() {
      this.selectedReservations = [];
      console.log("Deselected all reservations");
    },
    selectAllFiltered() {
      this.selectedReservations = []; // Reset first to force reactivity
      this.$nextTick(() => {
        this.selectedReservations = this.computedItems.map((item) => item.id);
      });
      console.log("this.selectedReservations", this.selectedReservations);
    },
    onCleanerClick() {},
    getDisplayDate(dt) {
      return moment(dt).format("DD/MM/YYYY");
    },

    onEdit(item) {
      console.log("item", item);
      this.itemReservationTemp.id = item.id;
      this.itemReservationTemp.rentalProductId = item.rentalProductId;

      let startDate = new Date(
        item.startDate.getTime() - item.startDate.getTimezoneOffset() * 60000
      );
      this.itemReservationTemp.startDate = startDate
        .toISOString()
        .split("T")[0];
      let endDate = new Date(
        item.endDate.getTime() - item.endDate.getTimezoneOffset() * 60000
      );

      this.itemReservationTemp.endDate = endDate.toISOString().split("T")[0];
      this.itemReservationTemp.price = item.price;
      this.itemReservationTemp.customerName = item.customerName;
      this.addReservationFormPopup = true;
    },

    getProductName(item) {
      if (item.rentalProduct) {
        return item.rentalProduct.name;
      }
      return "N/A";
    },

    getCustomerName(item) {
      if (item.customer) {
        return item.customer.name;
      }
      return "N/A";
    },

    deleteReservation() {
      if (confirm("Are you sure you want to delete this reservation?")) {
        // Perform delete operation
        console.log("Deleting reservation:", this.itemReservationTemp.id);

        // Simulate delete API call
        this.api
          .delete(this.itemReservationTemp.id)
          .then((response) => {
            this.refreshTable();
            this.infoList.push({
              header: "Success",
              message: "Reservation deleted successfully",
              color: "success",
            });
            this.addReservationFormPopup = false;
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    cancelReservation() {
      // Simply close the modal without saving any changes
      this.itemReservationTemp = {};
      this.addReservationFormPopup = false;
      this.availability.startDate = "";
      this.availability.endDate = "";
      this.message = `Start Date Reset to: ${this.availability.startDate}`;

      // Remove previous temporary event
      this.events = this.events.filter((event) => !event.tempEvent);
    },

    saveReservation() {
      console.log("this.itemReservationTemp", this.itemReservationTemp);
      if (this.itemReservationTemp.id) {
        console.log("UPDATE");
        this.api
          .update(this.itemReservationTemp)
          .then((response) => {
            self.obj = response.result;

            this.refreshTable();
            this.infoList.push({
              header: "Success",
              message: "Reservation update",
              color: "success",
            });
            this.addReservationFormPopup = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        console.log("ADD");
        this.api
          .create(this.itemReservationTemp)
          .then((response) => {
            self.obj = response.result;

            this.refreshTable();
            this.infoList.push({
              header: "Success",
              message: "Reservation saved",
              color: "success",
            });
            this.addReservationFormPopup = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      // this.customerApi
      //   .create(this.itemAddNewCustomer)
      //   .then((response) => {
      //     console.log("onCustomerPopupConfirmation", response);
      //     var addedCustomer = response.result;
      //     this.refreshCustomer();
      //     this.selectedCustomer = addedCustomer;
      //     // self.$router.push({ path: "/tenants/customerList" });
      //   })
      //   .catch(({ data }) => {
      //     self.toast("Error", helper.getErrorMessage(data), "danger");
      //   });
      this.itemReservationTemp = {};
    },

    getClassByColor(colorName) {
      // console.log("getClassByColor", colorName);
      return colorName.toLowerCase();
    },

    onSelectRentalProduct() {
      // this.refreshTable();
    },

    fetchStatuses() {
      var self = this;
      self.api
        .getStatus()
        .then((response) => {
          this.statuses = response.result.map((state) => ({
            value: state.id,
            label: state.name,
            color: this.getStatusColor(state.name),
          }));

          // console.log("this.statuses", this.statuses);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    getStatusColor(statusName) {
      switch (statusName.toLowerCase()) {
        case "available":
          return "rgba(40, 167, 69, 0.2)"; // Green
        case "close":
          return "rgba(108, 117, 125, 0.2)"; // Gray
        case "cleaning":
          return "rgba(255, 193, 7, 0.2)"; // Yellow
        case "maintenance":
          return "rgba(220, 53, 69, 0.2)"; // Red
        default:
          return "rgba(100, 100, 255, 0.3)"; // Default blue
      }
    },
    getEventClass(event) {
      // console.log("Applying event class:", event);
      if (event.customColor) {
        return `event-${event.customColor.replace(/[^a-z0-9]/gi, "")}`; // Creates a unique class
      }
      return "event-default"; // Fallback class
    },

    // getEventClass(status) {
    //   switch (status) {
    //     case "Available":
    //       return "available-background";
    //     case "Close":
    //       return "closed-background";
    //     case "Cleaning":
    //       return "cleaning-background";
    //     case "Maintenance":
    //       return "maintenance-background";
    //     default:
    //       return "default-background";
    //   }
    // },

    refreshTable() {
      var self = this;
      self.loading = true;
      // console.log("refreshTable");

      const params = {
        rentalProductId: this.filterCriteria.rentalProductId,
        startDate: this.filterCriteria.startDate,
        endDate: this.filterCriteria.endDate,
        totalDays: this.filterCriteria.totalDays || 0, // ✅ Pass totalDays if set
        cleaningIsPaid: this.filterCriteria.cleaningIsPaid, // ✅ Pass cleaningIsPaid if selected
        minDaysFilter: this.filterCriteria.minDaysFilter,
      };

      console.log("params", params);
      self.api
        .getList(params)
        .then((response) => {
          self.items = response.result;
          console.log("self.items", self.items);
          this.events = response.result.map((a) => ({
            title: a.customerName,
            startDate: new Date(a.startDate),
            endDate: new Date(a.endDate),
            allDay: true, // ✅ Ensures the full day is covered
            classes: this.getClassByColor(a.rentalProduct.colorName),
            id: a.id,
            price: a.price,
            remarks: a.remarks,
            rentalProductId: a.rentalProductId,
            customerName: a.customerName,
            customerPhone: a.customerPhone,
            cleaningVendorId: a.cleaningVendorId,
            cleaningCost: a.cleaningCost,
            cleaningIsPaid: a.cleaningIsPaid,
            cleaningPaymentDate: new Date(a.cleaningPaymentDate),
          }));

          console.log("this.events", this.events);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    // saveReservation() {
    //   if (!this.selectedProductId) {
    //     alert("Please select a rental product");
    //     return;
    //   }

    //   try {
    //     const data = {
    //       rentalProductId: this.selectedProductId,
    //       startDateTime: this.availability.startDate,
    //       endDateTime: this.availability.endDate,
    //       price: this.availability.price,
    //       status: this.availability.status,
    //     };
    //     console.log("data", data);
    //     this.api
    //       .create(data)
    //       .then((response) => {
    //         self.obj = response.result;

    //         this.refreshTable();
    //         this.infoList.push({
    //           header: "Success",
    //           message: "Reservation saved",
    //           color: "success",
    //         });
    //       })
    //       .catch(({ data }) => {
    //         self.toast("Error", helper.getErrorMessage(data), "danger");
    //       });
    //   } catch (error) {
    //     console.error("Failed to save availability", error);
    //     this.infoList.push({
    //       header: "Error",
    //       message: "Failed to save",
    //       color: "danger",
    //     });
    //   }
    // },
    loadRentalProducts() {
      this.rentalProductApi
        .getListByCurrentBusiness()
        .then((response) => {
          this.filterRentalProducts = [
            { value: "", label: "ALL" }, // Add default option
            ...response.result.map((p) => ({
              value: p.id,
              label: p.name,
              color: p.color || "rgba(0, 123, 255, 0.2)",
            })),
          ];

          this.rentalProducts = response.result.map((p) => ({
            value: p.id,
            label: p.name,
            color: p.color || "rgba(0, 123, 255, 0.2)",
          }));
          console.log("this.rentalProducts", this.rentalProducts);
          this.selectedProductId = "";
        })
        .catch(({ data }) => {
          this.toast("Error", helper.getErrorMessage(data), "danger");
          this.loading = false;
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
    setShowDate(d) {
      this.showDate = d;
    },
    onClickDay(date) {
      this.message = `You clicked: ${date.toLocaleDateString()}`;
      // Convert to local date (removes time zone issues)
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      // If start date is not set, set it first
      if (!this.availability.startDate) {
        this.availability.startDate = localDate;
        this.message = `Start Date Selected: ${this.availability.startDate}`;
        this.events.push({
          title: "Selected...",
          startDate: new Date(this.availability.startDate),
          endDate: new Date(this.availability.startDate),
          tempEvent: true, // Mark as temporary event
        });
      }
      // If start date is set but end date is not, set the end date
      else if (!this.availability.endDate) {
        if (new Date(localDate) >= new Date(this.availability.startDate)) {
          this.availability.endDate = localDate;
          this.message = `End Date Selected: ${this.availability.endDate}`;
          this.events = this.events.filter((event) => !event.tempEvent);
          this.events.push({
            title: "Selected...",
            startDate: new Date(this.availability.startDate),
            endDate: new Date(this.availability.endDate),
            tempEvent: true, // Mark as temporary event
          });

          delete this.itemReservationTemp.id;
          this.itemReservationTemp.startDate = this.availability.startDate;
          this.itemReservationTemp.endDate = this.availability.endDate;
          this.itemReservationTemp.price = 0;
          console.log("this.rentalProducts", this.rentalProducts);
          this.itemReservationTemp.rentalProductId =
            this.rentalProducts[0].value;

          console.log("this.itemReservationTemp", this.itemReservationTemp);
          this.addReservationFormPopup = true;
          this.availability.startDate = "";
          this.availability.endDate = "";
        } else {
          this.availability.startDate = localDate;
          this.availability.endDate = "";
          this.message = `Start Date Reset to: ${this.availability.startDate}`;

          // Remove previous temporary event
          this.events = this.events.filter((event) => !event.tempEvent);

          this.events.push({
            title: "Selected...",
            startDate: new Date(this.availability.startDate),
            endDate: new Date(this.availability.startDate),
            tempEvent: true, // Mark as temporary event
          });
        }
      }
      // If both are already set, reset and start over
      else {
        this.availability.startDate = "";
        this.availability.endDate = "";
        this.message = `Start Date Reset to: ${this.availability.startDate}`;

        // Remove previous temporary event
        this.events = this.events.filter((event) => !event.tempEvent);
      }
    },
    onClickEvent(e) {
      this.message = `You clicked: ${e.title}`;
      console.log("e", e);
      // this.itemReservationTemp = e.originalEvent;
      this.itemReservationTemp.id = e.originalEvent.id;
      this.itemReservationTemp.rentalProductId =
        e.originalEvent.rentalProductId;
      this.itemReservationTemp.startDate = e.originalEvent.startDate
        .toISOString()
        .split("T")[0];
      this.itemReservationTemp.endDate = e.originalEvent.endDate
        .toISOString()
        .split("T")[0];
      this.itemReservationTemp.price = e.originalEvent.price;
      this.itemReservationTemp.customerName = e.originalEvent.customerName;
      this.itemReservationTemp.customerPhone = e.originalEvent.customerPhone;
      this.itemReservationTemp.cleaningVendorId =
        e.originalEvent.cleaningVendorId;
      this.itemReservationTemp.cleaningCost = e.originalEvent.cleaningCost;
      this.itemReservationTemp.cleaningIsPaid = e.originalEvent.cleaningIsPaid;
      this.itemReservationTemp.cleaningPaymentDate =
        e.originalEvent.cleaningPaymentDate.toISOString().split("T")[0];
      console.log("this.itemReservationTemp", this.itemReservationTemp);
      this.addReservationFormPopup = true;
    },
    onDrop(event, date) {
      this.message = `Moved: ${
        event.title || event.id
      } to ${date.toLocaleDateString()}`;
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the event.
      const eLength = this.dayDiff(event.startDate, date);
      event.originalEvent.startDate = this.addDays(event.startDate, eLength);
      event.originalEvent.endDate = this.addDays(event.endDate, eLength);
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/style";
#calendar {
  color: $body-color;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
}
.theme-default .cv-event {
  background-color: #c8ced3;
  border-color: $table-border-color;
  color: $body-color;
}
.theme-default .cv-event.success {
  background-color: $success;
  border-color: lighten($success, 5%);
}
.theme-default .cv-event.danger {
  background-color: $danger;
}
.theme-default .cv-event.primary {
  background-color: #20a8d8;
}
.theme-default .cv-event.orange {
  background-color: #f8cb00;
  border-color: lighten(#f8cb00, 5%);
}
.theme-default .cv-event.red {
  background-color: #ff5733;
  border-color: lighten(#ff5733, 5%);
  color: white !important;

}

.theme-default .cv-event.blue {
  background-color: #007bff;
  border-color: lighten(#007bff, 5%);
  color: white !important;

}

.theme-default .cv-event.green {
  background-color: #28a745;
  border-color: lighten(#28a745, 5%);
}

.theme-default .cv-event.yellow {
  background-color: #ffc107;
  border-color: lighten(#ffc107, 5%);
}

.theme-default .cv-event.purple {
  background-color: #6f42c1;
  border-color: lighten(#6f42c1, 5%);
  color: white !important;
}

.theme-default .cv-event.black {
  background-color: #343a40;
  border-color: lighten(#343a40, 5%);

}

.theme-default .cv-event.white {
  background-color: #f8f9fa;
  border-color: lighten(#f8f9fa, 5%);
}

.theme-default .cv-event.orange {
  background-color: #fd7e14;
  border-color: lighten(#fd7e14, 5%);
}

.theme-default .cv-event.brown {
  background-color: #795548;
  border-color: lighten(#795548, 5%);
}

.theme-default .cv-event.cyan {
  background-color: #17a2b8;
  border-color: lighten(#17a2b8, 5%);
}

.theme-default .cv-event.amber {
  background-color: #ffbf00;
  border-color: lighten(#ffbf00, 5%);
}

.theme-default .cv-day.today {
  background-color: $gray-300;
}
.theme-default .cv-day.today > .cv-day-number {
  background-color: #20a8d8;
  border-radius: 50%;
  position: absolute;
  left: 0;
}
.theme-default .cv-day.past {
  background-color: $body-bg;
}
.theme-default .cv-day.outsideOfMonth {
  background-color: $body-bg;
}
.theme-default .cv-weeks,
.theme-default .cv-day {
  border-color: $table-border-color;
}
.theme-default .cv-header,
.theme-default .cv-header-days,
.theme-default .cv-header-day {
  background-color: #e4e5e6;
  border-color: $table-border-color;
  border-style: solid;
}
.theme-default .cv-header-nav > button {
  color: $body-color;
  background-color: $input-bg;
  border-color: $input-border-color;
}
.theme-default .cv-day.draghover {
  box-shadow: inset 0 0 0.2em 0.2em #321fdb;
}


// .cv-header-day:first-child {
//   order: 6; /* Move Sunday to the last position */
// }

// .cv-header-day:nth-child(2) {
//   order: 1; /* Move Monday to the first position */
// }
</style>

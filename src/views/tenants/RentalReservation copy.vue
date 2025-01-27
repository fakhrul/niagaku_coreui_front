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
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> Reservation </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="8">
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
                <CCol sm="4"
                  ><CForm>
                    <!-- <CLabel>Set Reservation</CLabel> -->
                    <CRow>
                      <CCol>
                        <CSelect
                          :value.sync="selectedProductId"
                          :options="rentalProducts"
                          label="Select Rental Product"
                          @change="onSelectRentalProduct"
                        />
                      </CCol>
                    </CRow>
                    <CBadge
                      :style="{
                        backgroundColor: selectedProductColor,
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        display: 'inline-block',
                        marginTop: '5px',
                        width: '100%',
                        height: '100px',
                      }"
                    >
                      {{ selectedProductLabel }}
                    </CBadge>
                    <CInput
                      label="Start"
                      type="date"
                      v-model="availability.startDate"
                      placeholder="Start Date"
                    />
                    <CInput
                      label="End"
                      type="date"
                      v-model="availability.endDate"
                      placeholder="End Date"
                    />
                    <CInput
                      label="Price"
                      type="number"
                      v-model="availability.price"
                      placeholder="Price"
                    />

                    <CButton color="primary" @click="saveReservation"
                      >Save Reservation</CButton
                    >
                  </CForm></CCol
                >
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
    </div>
    <div>
      <CModal
        title="Add New Customer"
        size="xl"
        :show.sync="addReservationFormPopup"
        @update:show="onReservationPopupConfirmation"
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
              label="Price"
              type="number"
              v-model="itemReservationTemp.price"
              placeholder="Price"
            />
            <!-- <CButton color="primary" @click="saveReservation"
              >Save Reservation</CButton
            > -->
          </CCol>
        </CRow>
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
    return {
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
      selectedProductId: "",
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
    selectedProductStyle() {
      return {
        "--selected-product-color": this.selectedProductColor,
      };
    },
    selectedProductColor() {
      const product = this.rentalProducts.find(
        (p) => p.value === this.selectedProductId
      );
      return product ? product.color : "rgba(0, 0, 0, 0.2)"; // Default gray
    },
    selectedProductLabel() {
      const product = this.rentalProducts.find(
        (p) => p.value === this.selectedProductId
      );
      return product ? product.name : "Unknown";
    },

    // dayClasses() {
    //   return (day) => {
    //     const dayKey = day.toISOString().split("T")[0];
    //     return this.coloredDays[dayKey] || "";
    //   };
    // },
    // dayClasses() {
    //   return (day) => {
    //     const dayKey = day.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    //     console.log(`Checking dayClasses for: ${dayKey}`); // ✅ Debug
    //     return this.coloredDays[dayKey] || ""; // Return matching class or empty
    //   };
    // },
    themeClasses() {
      return {
        "theme-default": this.useDefaultTheme,
        "holiday-us-traditional": this.useHolidayTheme,
        "holiday-us-official": this.useHolidayTheme,
      };
    },
  },
  methods: {
    onReservationPopupConfirmation(status, evt, accept) {
      if (accept) {
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
      }
      this.itemReservationTemp = {};
    },

    getClassByColor(colorName) {
      console.log("getClassByColor", colorName);
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

          console.log("this.statuses", this.statuses);
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
      console.log("Applying event class:", event);
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
      console.log("refreshTable");

      const params = {
        rentalProductId: "",
      };
      console.log("params", params);
      self.api
        .getList(params)
        .then((response) => {
          self.items = response.result;
          console.log("self.items", self.items);
          this.events = response.result.map((a) => ({
            title: a.rentalProduct.name,
            startDate: new Date(a.startDate),
            endDate: new Date(a.endDate),
            allDay: true, // ✅ Ensures the full day is covered
            classes: this.getClassByColor(a.rentalProduct.colorName),
            id: a.id,
            price: a.price,
            remarks: a.remarks,
            rentalProductId: a.rentalProductId,
          }));

          console.log("this.events", this.events);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    saveReservation() {
      if (!this.selectedProductId) {
        alert("Please select a rental product");
        return;
      }

      try {
        const data = {
          rentalProductId: this.selectedProductId,
          startDateTime: this.availability.startDate,
          endDateTime: this.availability.endDate,
          price: this.availability.price,
          status: this.availability.status,
        };
        console.log("data", data);
        this.api
          .create(data)
          .then((response) => {
            self.obj = response.result;

            this.refreshTable();
            this.infoList.push({
              header: "Success",
              message: "Reservation saved",
              color: "success",
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } catch (error) {
        console.error("Failed to save availability", error);
        this.infoList.push({
          header: "Error",
          message: "Failed to save",
          color: "danger",
        });
      }
    },
    loadRentalProducts() {
      this.rentalProductApi
        .getListByCurrentBusiness()
        .then((response) => {
          this.rentalProducts = response.result.map((p) => ({
            value: p.id,
            label: p.name,
            color: p.color || "rgba(0, 123, 255, 0.2)",
          }));
          console.log("this.rentalProducts", this.rentalProducts);
          this.selectedProductId = response.result[0].id;
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

      const eventColor = this.selectedProductColor;
      console.log("eventcolo", eventColor);
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
  height: 63vh;
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
}

.theme-default .cv-event.blue {
  background-color: #007bff;
  border-color: lighten(#007bff, 5%);
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
</style>

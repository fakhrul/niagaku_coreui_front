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
            <CCardHeader> Availability </CCardHeader>
            <CCardBody>
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

              <CRow>
                <CCol sm="8"
                  ><calendar-view
                    id="calendar"
                    :events="events"
                    enable-drag-drop
                    :show-date="showDate"
                    :displayPeriodUom="displayPeriod"
                    currentPeriodLabel="icons"
                    :class="themeClasses"
                    :day-classes="dayClasses"
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
                    /> </calendar-view
                ></CCol>
                <CCol sm="4"
                  ><CForm>
                    <!-- <CLabel>Set Availability</CLabel> -->
                    <CInput
                      type="date"
                      v-model="availability.startDate"
                      placeholder="Start Date"
                    />
                    <CInput
                      type="date"
                      v-model="availability.endDate"
                      placeholder="End Date"
                    />

                    <CSelect
                      :value.sync="availability.status"
                      :options="this.statuses"
                      label="Status"
                    />
                    <!-- <CRow>
                      <CCol sm="12">
                        <div
                          :style="{
                            backgroundColor: selectedStatusColor,
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            marginTop: '5px',
                            height: '100px'
                          }"
                        ></div>
                      </CCol>
                    </CRow> -->
                    <CBadge
                      :style="{
                        backgroundColor: selectedStatusColor,
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        display: 'inline-block',
                        marginTop: '5px',
                        width: '100%',
                        height: '100px',
                      }"
                    >
                      {{ selectedStatusLabel }}
                    </CBadge>
                    <CInput
                      label="Price"
                      type="number"
                      v-model="availability.price"
                      placeholder="Price"
                    />

                    <CButton color="primary" @click="saveAvailability"
                      >Save Availability</CButton
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
  </div>
</template>

<script>
// import BillApi from "@/lib/billApi";
import RentalAvailabilityApi from "@/lib/rentalAvailabilityApi";
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
const sampleEvents = [
  {
    title: "Test 1",
    allDay: true,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 1),
  },

  {
    title: "All Day Event very long title",
    allDay: true,
    startDate: new Date(currYear, currMonth, 0),
    endDate: new Date(currYear, currMonth, 1),
  },
  {
    title: "Long Event",
    startDate: new Date(currYear, currMonth, 7),
    endDate: new Date(currYear, currMonth, 10),
  },

  {
    title: "DTS STARTS",
    startDate: new Date(currYear + 1, 2, 13, 0, 0, 0),
    endDate: new Date(currYear + 1, 2, 20, 0, 0, 0),
  },

  {
    title: "DTS ENDS",
    startDate: new Date(currYear + 1, 10, 6, 0, 0, 0),
    endDate: new Date(currYear + 1, 10, 13, 0, 0, 0),
  },

  {
    title: "Some Event",
    startDate: new Date(currYear, currMonth, 9, 0, 0, 0),
    endDate: new Date(currYear, currMonth, 9, 0, 0, 0),
  },
  {
    title: "Conference",
    startDate: new Date(currYear, currMonth, 11),
    endDate: new Date(currYear, currMonth, 13),
    desc: "Big conference for important people",
    classes: "orange",
  },
  {
    title: "Meeting",
    startDate: new Date(currYear, currMonth, 12, 10, 30, 0, 0),
    endDate: new Date(currYear, currMonth, 12, 12, 30, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting",
  },
  {
    title: "Lunch",
    startDate: new Date(currYear, currMonth, 12, 12, 0, 0, 0),
    endDate: new Date(currYear, currMonth, 12, 13, 0, 0, 0),
    desc: "Power lunch",
  },
  {
    title: "Meeting",
    startDate: new Date(currYear, currMonth, 14, 14, 0, 0, 0),
    endDate: new Date(currYear, currMonth, 14, 15, 0, 0, 0),
  },
  {
    title: "Happy Hour",
    startDate: new Date(currYear, currMonth, 12, 17, 0, 0, 0),
    endDate: new Date(currYear, currMonth, 12, 17, 30, 0, 0),
    desc: "Most important meal of the day",
    classes: "primary",
  },
  {
    title: "Dinner",
    startDate: new Date(currYear, currMonth, 26, 20, 0, 0, 0),
    endDate: new Date(currYear, currMonth, 26, 21, 0, 0, 0),
    classes: "success",
  },
  {
    title: "Birthday Party",
    startDate: new Date(currYear, currMonth, 13, 7, 0, 0),
    endDate: new Date(currYear, currMonth, 13, 10, 30, 0),
  },
  {
    title: "Birthday Party 2",
    startDate: new Date(currYear, currMonth, 24, 17, 0, 0),
    endDate: new Date(currYear, currMonth, 24, 18, 30, 0),
    classes: "primary",
  },
  {
    title: "Late Night Event",
    startDate: new Date(currYear, currMonth, 17, 19, 30, 0),
    endDate: new Date(currYear, currMonth, 18, 2, 0, 0),
    classes: "danger",
  },
  {
    title: "Multi-day Event",
    startDate: new Date(currYear, currMonth, 20, 19, 30, 0),
    endDate: new Date(currYear, currMonth, 22, 2, 0, 0),
  },
];

export default {
  name: "RentalAvailability",
  mixins: [CalendarMathMixin],
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  data() {
    return {
      statuses: [],
      items: [],
      availability: {
        startDate: "",
        endDate: "",
        price: 0,
        status: 0,
      },
      selectedProductId: null,
      rentalProducts: [],
      infoList: [],
      message: "",
      showDate: currDate,
      displayPeriod: "month",
      events: sampleEvents,
      // events: [],
      useDefaultTheme: true,
      coloredDays: {},
      // useHolidayTheme: true,
      api: new RentalAvailabilityApi(),
      rentalProductApi: new RentalProductApi(),
    };
  },
  mounted() {
    this.fetchStatuses();

    this.loadRentalProducts();
    this.refreshTable();
  },
  computed: {
    selectedStatusColor() {
      const status = this.statuses.find(
        (s) => s.value === this.availability.status
      );
      return status ? status.color : "#000"; // Default black if not found
    },
    selectedStatusLabel() {
      const status = this.statuses.find(
        (s) => s.value === this.availability.status
      );
      return status ? status.label : "Unknown"; // Default black if not found
    },

    // dayClasses() {
    //   return (day) => {
    //     const dayKey = day.toISOString().split("T")[0];
    //     return this.coloredDays[dayKey] || "";
    //   };
    // },
    dayClasses() {
      return (day) => {
        const dayKey = day.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
        console.log(`Checking dayClasses for: ${dayKey}`); // ✅ Debug
        return this.coloredDays[dayKey] || ""; // Return matching class or empty
      };
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
    onSelectRentalProduct() {
      this.refreshTable();
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
    getEventClass(status) {
      switch (status) {
        case "Available":
          return "available-background";
        case "Close":
          return "closed-background";
        case "Cleaning":
          return "cleaning-background";
        case "Maintenance":
          return "maintenance-background";
        default:
          return "default-background";
      }
    },

    refreshTable() {
      var self = this;
      self.loading = true;
      console.log("self.selectedProductId", self.selectedProductId);
      if (self.selectedProductId) {
        self.api
          .getListByRentalProduct(self.selectedProductId)
          .then((response) => {
            self.items = response.result;
            console.log("self.items", self.items);
            this.events = response.result.map((a) => ({
              title: " ",
              startDate: new Date(a.startDateTime),
              endDate: new Date(a.endDateTime),
              allDay: true, // ✅ Ensures the full day is covered
              classes: this.getEventClass(a.statusDescription),
            }));
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    saveAvailability() {
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
              message: "Availability saved",
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
          this.rentalProducts = [
            { value: "", label: "Please Select" }, // Add default option
            ...response.result.map((p) => ({
              value: p.id,
              label: p.name,
            })),
          ];
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
          classes: "selection-background",
        });
      }
      // If start date is set but end date is not, set the end date
      else if (!this.availability.endDate) {
        if (new Date(localDate) >= new Date(this.availability.startDate)) {
          this.availability.endDate = localDate;
          this.message = `End Date Selected: ${this.availability.endDate}`;

          // var foundEvent = this.events.filter(event => event.tempEvent)[0];
          // foundEvent.endDate = new Date(this.availability.endDate);

          // Remove previous temporary event
          this.events = this.events.filter((event) => !event.tempEvent);

          // Add a new event to highlight selected range in the calendar
          this.events.push({
            title: "Selected...",
            startDate: new Date(this.availability.startDate),
            endDate: new Date(this.availability.endDate),
            tempEvent: true, // Mark as temporary event
            classes: "selection-background",
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
            classes: "selection-background",
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

        // this.events.push({
        //   title: "Selected...",
        //   startDate: new Date(this.availability.startDate),
        //   endDate: new Date(this.availability.startDate),
        //   tempEvent: true, // Mark as temporary event
        //   classes: "selection-day",
        // });
      }
    },
    onClickEvent(e) {
      this.message = `You clicked: ${e.title}`;
      console.log("e", e);
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
.theme-default .cv-day.today {
  background-color: $gray-300;
}
.theme-default .cv-day.orange {
  background-color: #f8cb00;
  border-color: lighten(#f8cb00, 5%);
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

.theme-default .cv-day.available-day {
  background-color: rgba(40, 167, 69, 0.2) !important; // Light green
}
.theme-default .cv-day.closed-day {
  background-color: rgba(108, 117, 125, 0.2) !important; // Light gray
}
.theme-default .cv-day.cleaning-day {
  background-color: rgba(255, 193, 7, 0.2) !important; // Light yellow
}
.theme-default .cv-day.maintenance-day {
  background-color: rgba(220, 53, 69, 0.2) !important; // Light red
}
.theme-default .cv-day.selection-day {
  background-color: rgba(100, 100, 255, 0.3) !important; // Light blue
}

// .theme-default .cv-event.available-event {
//   background-color: #28a745 !important;  // Green for Available
// }
// .theme-default .cv-event.closed-event {
//   background-color: #6c757d !important;  // Gray for Closed
// }
// .theme-default .cv-event.cleaning-event {
//   background-color: #ffc107 !important;  // Yellow for Cleaning
// }
// .theme-default .cv-event.maintenance-event {
//   background-color: #dc3545 !important;  // Red for Maintenance
// }
// .theme-default .cv-event.default-event {
//   background-color: #007bff !important;  // Blue for Default
// }

.theme-default .cv-event.available-background {
  background-color: rgba(40, 167, 69, 0.3) !important; /* Light Green */
  // width: 100%; /* Cover entire cell */
  height: 100%;
  // position: absolute;
  // left: 0;
  top: 0 !important;
  border-radius: 0;
  pointer-events: none;
}

.theme-default .cv-event.closed-background {
  background-color: rgba(108, 117, 125, 0.3) !important; /* Light Gray */
  // width: 100%; /* Cover entire cell */
  height: 100%;
  // position: absolute;
  // left: 0;
  top: 0 !important;
  border-radius: 0;
  pointer-events: none;
}

.theme-default .cv-event.cleaning-background {
  background-color: rgba(255, 193, 7, 0.3) !important; /* Light Yellow */
  // width: 100%; /* Cover entire cell */
  height: 100%;
  // position: absolute;
  // left: 0;
  top: 0 !important;
  border-radius: 0;
  pointer-events: none;
}

.theme-default .cv-event.maintenance-background {
  background-color: rgba(220, 53, 69, 0.3) !important; /* Light Red */
  // width: 100%; /* Cover entire cell */
  height: 100%;
  // position: absolute;
  // left: 0;
  top: 0 !important;
  border-radius: 0;
  pointer-events: none;
}

.theme-default .cv-event.selection-background {
  background-color: rgba(173, 216, 230, 0.3) !important; /* Light Red */
  // width: 100%; /* Cover entire cell */
  height: 100%;
  // position: absolute;
  // left: 0;
  top: 0 !important;
  border-radius: 0;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;
  // text-align: center;
}
</style>

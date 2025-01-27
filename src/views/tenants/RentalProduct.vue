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
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Rental Product</strong>
              <a href="" target="_blank" :class="getBadgeClass()">
                {{ obj.stateDescription }}
              </a>
              <div class="card-header-actions">
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Action"
                  color="light"
                  class="m-2 d-inline-block tour-cdropdown"
                  size="sm"
                >
                  <CDropdownItem @click="onConvertToInvoice(obj)"
                    >Duplicate</CDropdownItem
                  >
                  <CDropdownDivider />
                  <CDropdownHeader>Change Status To:</CDropdownHeader>
                  <template v-for="status in statuses">
                    <CDropdownItem @click="changeState(status)">{{
                      status.name
                    }}</CDropdownItem>
                  </template>
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput label="Name" v-model="obj.name" />
                <CInput label="Type" v-model="obj.type" />
                <CTextarea
                  label="Description"
                  v-model="obj.description"
                  placeholder=""
                  rows="4"
                />

                <!-- ✅ Color Picker Input -->
                <!-- <CInput
                  label="Select Color"
                  type="color"
                  v-model="obj.color"
                  placeholder="Choose a color"
                /> -->
                <CSelect
                :value.sync="selectedColorName"
                  :options="
                    presetColors.map((color) => ({
                      value: color.name,
                      label: color.name,
                      code: color.code,
                      name: color.name,
                      label: color.label,
                    }))
                  "
                  label="Select Color"
                  @change="updateSelectedColor"
                >
                <!-- <template v-slot:option="{ option }">
                    <div class="color-option">
                      <span
                        class="color-preview"
                        :style="{ backgroundColor: option.code }"
                      ></span>
                      {{ option.name }}
                    </div>
                  </template> -->


                  <template v-slot:option="{ option }">
                    <div class="color-option">
                      <span
                        class="color-preview"
                        :style="{ backgroundColor: getColorCode(option.value) }"
                      ></span>
                      {{ option.label }}
                    </div>
                  </template>
                </CSelect>

                <!-- Show Color Preview -->
                <div
                  v-if="obj.color"
                  :style="{
                    backgroundColor: obj.color,
                    width: '50px',
                    height: '30px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    border: '1px solid #ddd',
                  }"
                ></div>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" color="light" @click="submit">
                Save</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import RentalProductApi from "../../lib/rentalProductApi";
import moment from "moment";

export default {
  name: "RentalProduct",
  components: {},
  data: () => {
    return {
      selectedColorName: "",
      presetColors: [
        { name: "Red", code: "#FF5733", label: "🔴 Red" },
        { name: "Blue", code: "#007bff", label: "🔵 Blue" },
        { name: "Green", code: "#28a745", label: "🟢 Green" },
        { name: "Yellow", code: "#ffc107", label: "🟡 Yellow" },
        { name: "Purple", code: "#6f42c1", label: "🟣 Purple" },
        { name: "Black", code: "#343a40", label: "⚫ Black" },
        { name: "White", code: "#f8f9fa", label: "⚪ White" },
        { name: "Orange", code: "#fd7e14", label: "🟠 Orange" },
        // { name: "Pink", code: "#e83e8c", label: "🌸 Pink" },
        { name: "Brown", code: "#795548", label: "🟤 Brown" },
        // { name: "Gray", code: "#6c757d", label: "🔘 Gray" },
        { name: "Cyan", code: "#17a2b8", label: "🟦 Cyan" },
        // { name: "Lime", code: "#cddc39", label: "🟢 Lime" },
        // { name: "Teal", code: "#20c997", label: "🟩 Teal" },
        // { name: "Indigo", code: "#6610f2", label: "💜 Indigo" },
        { name: "Amber", code: "#ffbf00", label: "🟨 Amber" },
        // { name: "Beige", code: "#f5f5dc", label: "🤍 Beige" },
        // { name: "Lavender", code: "#e6e6fa", label: "💜 Lavender" },
        // { name: "Turquoise", code: "#40e0d0", label: "🦚 Turquoise" },
        // { name: "Olive", code: "#808000", label: "🫒 Olive" },
      ],
      statuses: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new RentalProductApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    // this.fetchStatuses();
    self.resetObj();
  },
  computed: {},

  methods: {
    updateSelectedColor() {
      console.log("selectedColorName",this.selectedColorName);
      const color = this.presetColors.find((c) => c.name === this.selectedColorName);
      if (color) {
        this.selectedColorName = color.name;
        this.obj.colorName = color.name;
        this.obj.colorCode = color.code;
      }
    },
    getColorCode(colorName) {
      const color = this.presetColors.find((c) => c.name === colorName);
      return color ? color.code : "#000000"; // Default to black if not found
    },

    changeState(item) {
      var self = this;
      self.obj.state = item.id;
      if (self.obj.id) {
        this.api
          .updateState(self.obj)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    fetchStatuses() {
      var self = this;
      self.api
        .getStatusTypes()
        .then((response) => {
          this.statuses = response.result;
          console.log(this.statuses);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    getBadgeClass() {
      if (this.obj.stateDescription == "Draft") {
        return "badge badge-secondary ml-1";
      } else if (this.obj.stateDescription == "Accepted") {
        return "badge badge-primary ml-1";
      } else if (this.obj.stateDescription == "Approve") {
        return "badge badge-primary ml-1";
      } else if (this.obj.stateDescription == "Sent") {
        return "badge badge-success ml-1";
      } else if (this.obj.stateDescription == "Rejected") {
        return "badge badge-warning ml-1";
      } else if (this.obj.stateDescription == "Cancelled") {
        return "badge badge-danger ml-1";
      } else {
        return "badge badge-secondary ml-1";
      }
    },

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            // Set default color if none exists
            if (!self.obj.colorCode) {
              self.obj.colorCode = "#007bff"; // Default Blue
              self.obj.colorName = "Blue";
            }

            // Set only the color name
            self.selectedColorName = self.obj.colorName;
            console.log("self.obj", self.obj);
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      var self = this;
      self.obj.date = self.issuedDate;
      if (self.selectedVendor) {
        self.obj.vendorId = self.selectedVendor.id;
      }

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({
              path: `/tenants/RentalProduct/${self.obj.id}`,
            });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    onReset() {
      //evt.preventDefault();
      this.obj = {};
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    checkIfValid(fieldName) {
      const field = this.$v.obj[fieldName];
      if (!field.$dirty) {
        return null;
      }
      return !(field.$invalid || field.$model === "");
    },
    validate() {
      this.$v.$touch();
    },
    reset() {
      // this.obj = this.getEmptyObj();
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      return {
        name: "",
      };
    },
    submit() {
      // if (this.isValid) {
      this.onSubmit();
      this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/maplist" });
    },
  },
};
</script>

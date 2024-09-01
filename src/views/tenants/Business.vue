<template>
  <div>
    <CToaster :autohide="3000">
      <!-- Remove key from template and add it to CToast -->
      <CToast
        v-for="info in infoList"
        :key="info.message"
        :show="true"
        :header="info.header"
        :color="info.color"
      >
        <template #header>
          <CIcon :name="getIcon(info.color)" class="mr-2" /> {{ info.header }}
        </template>
        {{ info.message }}.
      </CToast>
    </CToaster>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Business</strong>
            <div class="card-header-actions">
              <CDropdown
                size="sm"
                toggler-text="Help"
                color="link"
                class="m-0 d-inline-block"
              >
                <!--  <template #toggler>
                  <CButton color="link">
                    <i class="material-icons">help_outline</i>
                  </CButton> 
                </template>-->
                <CDropdownItem disabled>Onboarding Tour</CDropdownItem>
                <CDropdownItem>Quick Info</CDropdownItem>
                <CDropdownItem disabled>Help Center & FAQ</CDropdownItem>
                <CDropdownItem disabled>Video Tutorial</CDropdownItem>
                <CDropdownItem disabled>Live Chat</CDropdownItem>
                <CDropdownItem disabled>Send Feedback</CDropdownItem>
              </CDropdown>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTabs add-tab-classes="mt-1">
              <CTab active>
                <template slot="title">
                  <CIcon name="cil-calculator" /> General
                </template>
                <CCard>
                  <CForm @submit.prevent="submit">
                    <CCardBody>
                      <!-- Group related fields for better UX -->
                      <CRow form>
                        <CCol md="6">
                          <CInput
                            label="Name"
                            v-model="obj.name"
                            placeholder="XYZ Sdn Bhd"
                            required
                            was-validated
                            v-c-tooltip.hover="{
                              content: `Your company name.`,
                              placement: 'right-end',
                            }"
                          />
                          <CInput
                            label="RegNo"
                            v-model="obj.regNo"
                            placeholder="123456-V"
                            required
                            was-validated
                          />
                          <CInput
                            label="Tagline"
                            v-model="obj.tagLine"
                            placeholder="Your Success, Our Commitment."
                          />
                          <CInput
                            label="Tax Identification Number"
                            v-model="obj.taxIdentificationNumber"
                            placeholder="C1234567890"
                          />
                          <CInput
                            label="Currency"
                            v-model="obj.currency"
                            readonly
                            placeholder="RM"
                          />
                          <CInput
                            label="Website"
                            v-model="obj.website"
                            placeholder="www.xyz.com.my"
                          />
                          <CInput
                            label="Phone"
                            v-model="obj.phone"
                            placeholder="03-897654321"
                          />
                        </CCol>
                        <CCol md="6">
                          <CTextarea
                            label="Address"
                            placeholder="No. 123, Jalan Example
Taman Example, 
12345 Kuala Lumpur,
Malaysia"
                            rows="5"
                            v-model="obj.address"
                            required
                            was-validated
                          />
                          <!-- ASEAN Country Selection -->
                          <CSelect
                            :value.sync="obj.country"
                            :options="aseanCountries"
                            label="Country"
                          />
                          <!-- State Selection -->
                          <CSelect
                            :value.sync="obj.state"
                            :options="stateOptions"
                            label="State"
                          />
                          <!-- District Selection -->
                          <CSelect
                            :value.sync="obj.district"
                            :options="statesAndDistricts[obj.state]"
                            label="District"
                          />

                          <CInput
                            label="Postcode"
                            v-model="obj.postcode"
                            placeholder="12345"
                          />
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol md="6"
                          ><CFormGroup wrapperClasses="input-group pt-2">
                            <template #label> Company Logo </template>
                            <template #input>
                              <div style="width: 100%">
                                <CRow>
                                  <CCol sm="6">
                                    <CImg
                                      :src="getImageUrl()"
                                      class="mb-2"
                                      thumbnail
                                      responsive
                                    />
                                  </CCol>
                                  <CCol sm="6"
                                    ><WidgetsUploadImage
                                      :logoUrl="logoUrl"
                                      @uploaded="uploaded"
                                  /></CCol>
                                </CRow>
                              </div>
                            </template> </CFormGroup
                        ></CCol>
                        <CCol md="6"
                          ><CFormGroup wrapperClasses="input-group pt-2">
                            <template #label> Company Chop </template>
                            <template #input>
                              <div style="width: 100%">
                                <CRow>
                                  <CCol sm="6">
                                    <CImg
                                      :src="getChopImageUrl()"
                                      class="mb-2"
                                      thumbnail
                                      responsive
                                    />
                                  </CCol>
                                  <CCol sm="6"
                                    ><WidgetsUploadImage
                                      :logoUrl="chopUrl"
                                      @uploaded="chop_uploaded"
                                  /></CCol>
                                </CRow>
                              </div>
                            </template> </CFormGroup
                        ></CCol>
                      </CRow>
                    </CCardBody>
                    <CCardFooter>
                      <CButton
                        type="submit"
                        size="sm"
                        color="primary"
                        :disabled="!isFormValid"
                      >
                        <CIcon name="cil-check-circle" /> Submit
                      </CButton>
                    </CCardFooter>
                  </CForm>
                </CCard>
              </CTab>

              <CTab v-if="!isNewApplication()">
                <template slot="title">
                  <CIcon name="cil-basket" /> Users
                </template>
                <CCard>
                  <CCardHeader> <strong> User </strong> List </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      :items="computedProfileItems"
                      :fields="profilefields"
                      column-filter
                      items-per-page-select
                      :items-per-page="10"
                      hover
                      sorter
                      pagination
                      :loading="profileLoading"
                    >
                      <template #show_details="{ item }">
                        <td>
                          <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="onEditProfile(item)"
                          >
                            Edit
                          </CButton>
                          <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="showDeleteProfileConfirmation(item)"
                          >
                            Delete
                          </CButton>
                        </td>
                      </template>
                    </CDataTable>
                  </CCardBody>
                  <CCardFooter>
                    <CButton
                      type="submit"
                      size="sm"
                      color="primary"
                      @click="addNewProfile"
                      ><CIcon name="cil-check-circle" /> Add New</CButton
                    >
                  </CCardFooter>
                </CCard>
                <CModal
                  title="Confirm Delete"
                  color="warning"
                  :show.sync="warningProfileModal"
                  @update:show="onDeleteProfileConfirmation"
                >
                  Are you sure you want to delete this {{ itemToDelete.code }} ?
                </CModal>
                <CModal
                  :show.sync="editProfileModal"
                  :no-close-on-backdrop="true"
                  :centered="true"
                  title="Profile"
                  size="lg"
                  color="primary"
                >
                  <CInput label="Name" horizontal v-model="profile.fullName" />

                  <CSelect
                    label="Role"
                    horizontal
                    :options="['Accountant', 'Staff']"
                    :value.sync="profile.appUser.role"
                  />
                  <CInput
                    label="Email"
                    horizontal
                    v-model="profile.email"
                    :readonly="isEmailReadOnly"
                  />

                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Is Reset Password?
                    </CCol>
                    <CCol sm="9">
                      <CSwitch
                        class="mr-1"
                        color="primary"
                        :checked.sync="isResetPassword"
                      />
                    </CCol>
                  </CRow>
                  <CInput
                    description="Please specifiy password. Minimum password is 8 character with combonation of capital letter, numbers and special chracter."
                    label="Password"
                    horizontal
                    autocomplete="password"
                    v-model="plainPassword"
                    v-if="isResetPassword"
                  />
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Is Enable?
                    </CCol>
                    <CCol sm="9">
                      <CSwitch
                        class="mr-1"
                        color="primary"
                        :checked.sync="profile.isEnable"
                      />
                    </CCol>
                  </CRow>

                  
                  <template #header>
                    <h6 class="modal-title">Add Or Update Profile</h6>
                    <CButtonClose
                      @click="editProfileModal = false"
                      class="text-white"
                    />
                  </template>
                  <template #footer>
                    <CButton
                      @click="editProfileModal = false"
                      color="danger"
                      >Cancel</CButton
                    >
                    <CButton @click="updateProfile" color="success"
                      >Accept</CButton
                    >
                  </template>
                </CModal>
              </CTab>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>


<script>
import BusinessApi from "@/lib/businessApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";
// import { CIcon } from "@coreui/icons-vue";
import ProfileApi from "@/lib/profileApi";

const profilefields = [
  { key: "fullName" },
  { key: "email" },
  { key: "business" },
  { key: "role" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Business",
  components: {
    WidgetsUploadImage,
    // CIcon,
  },
  data() {
    return {
      isResetPassword: false,
      plainPassword: "",
      isEmailReadOnly: false,

      profile: {
        fullName: "",
        appUser: {
          role: "Staff",
        },
        email: "",
        isEnable: true,
      },
      editProfileModal: false,

      itemToDelete: {},
      showQuickInfo: false,
      profileApi: new ProfileApi(),
      warningProfileModal: false,
      profileLoading: true,
      profileItems: [],
      profilefields,

      selectedState: "",
      selectedDistrict: "",
      selectedCountry: "",
      statesAndDistricts: {
        Johor: [
          "Batu Pahat",
          "Johor Bahru",
          "Kluang",
          "Kota Tinggi",
          "Mersing",
          "Muar",
          "Pontian",
          "Segamat",
          "Tangkak",
          "Kulai",
        ],
        Kedah: [
          "Baling",
          "Bandar Baharu",
          "Kota Setar",
          "Kuala Muda",
          "Kubang Pasu",
          "Kulim",
          "Langkawi",
          "Padang Terap",
          "Pendang",
          "Pokok Sena",
          "Sik",
          "Yan",
        ],
        Kelantan: [
          "Bachok",
          "Gua Musang",
          "Jeli",
          "Kota Bharu",
          "Kuala Krai",
          "Machang",
          "Pasir Mas",
          "Pasir Puteh",
          "Tanah Merah",
          "Tumpat",
        ],
        Malacca: ["Alor Gajah", "Jasin", "Central Melaka"],
        "Negeri Sembilan": [
          "Jelebu",
          "Jempol",
          "Kuala Pilah",
          "Port Dickson",
          "Rembau",
          "Seremban",
          "Tampin",
        ],
        Pahang: [
          "Bentong",
          "Bera",
          "Cameron Highlands",
          "Jerantut",
          "Kuantan",
          "Lipis",
          "Maran",
          "Pekan",
          "Raub",
          "Rompin",
          "Temerloh",
        ],
        Penang: [
          "Seberang Perai Selatan",
          "Seberang Perai Tengah",
          "Seberang Perai Utara",
          "Timur Laut",
          "Barat Daya",
        ],
        Perak: [
          "Batang Padang",
          "Hilir Perak",
          "Hulu Perak",
          "Kinta",
          "Kerian",
          "Kuala Kangsar",
          "Larut, Matang and Selama",
          "Manjung",
          "Perak Tengah",
          "Kampar",
          "Muallim",
          "Bagan Datuk",
        ],
        Perlis: ["Kangar", "Padang Besar", "Arau"],
        Sabah: [
          "Beaufort",
          "Beluran",
          "Kalabakan",
          "Keningau",
          "Kinabatangan",
          "Kota Belud",
          "Kota Kinabalu",
          "Kota Marudu",
          "Kuala Penyu",
          "Kudat",
          "Kunak",
          "Lahad Datu",
          "Nabawan",
          "Papar",
          "Penampang",
          "Pitas",
          "Putatan",
          "Ranau",
          "Sandakan",
          "Semporna",
          "Sipitang",
          "Tambunan",
          "Tawau",
          "Telupid",
          "Tenom",
          "Tongod",
          "Tuaran",
        ],
        Sarawak: [
          "Asajaya",
          "Bau",
          "Belaga",
          "Betong",
          "Bintulu",
          "Dalat",
          "Daro",
          "Julau",
          "Kapit",
          "Kuching",
          "Lawas",
          "Limbang",
          "Lubok Antu",
          "Lundu",
          "Maradong",
          "Matu",
          "Miri",
          "Mukah",
          "Pakan",
          "Pusa",
          "Samarahan",
          "Sarikei",
          "Sebauh",
          "Selangau",
          "Serian",
          "Sibu",
          "Simunjan",
          "Song",
          "Sri Aman",
          "Subis",
          "Tatau",
          "Tebedu",
        ],
        Selangor: [
          "Gombak",
          "Hulu Langat",
          "Hulu Selangor",
          "Klang",
          "Kuala Langat",
          "Kuala Selangor",
          "Petaling",
          "Sabak Bernam",
          "Sepang",
        ],
        Terengganu: [
          "Besut",
          "Dungun",
          "Hulu Terengganu",
          "Kemaman",
          "Kuala Nerus",
          "Kuala Terengganu",
          "Marang",
          "Setiu",
        ],
        "Kuala Lumpur": [
          "Cheras",
          "Kepong",
          "Lembah Pantai",
          "Seputeh",
          "Setiawangsa",
          "Titiwangsa",
          "Wangsa Maju",
          "Bukit Bintang",
        ],
        Labuan: ["Victoria"],
        Putrajaya: [
          "Presint 1",
          "Presint 2",
          "Presint 3",
          "Presint 4",
          "Presint 5",
          "Presint 6",
          "Presint 7",
          "Presint 8",
          "Presint 9",
          "Presint 10",
          "Presint 11",
          "Presint 12",
          "Presint 13",
          "Presint 14",
          "Presint 15",
          "Presint 16",
          "Presint 17",
          "Presint 18",
          "Presint 19",
          "Presint 20",
        ],
      },
      aseanCountries: [
        "Brunei",
        "Cambodia",
        "Indonesia",
        "Laos",
        "Malaysia",
        "Myanmar",
        "Philippines",
        "Singapore",
        "Thailand",
        "Vietnam",
      ],

      logoUrl: "",
      chopUrl: "",
      infoList: [],
      obj: {
        currency: "RM",
        country: "Malaysia",
        state: "Selangor",
        district: "Hulu Langat",
      },
      submitted: false,
      api: new BusinessApi(),
    };
  },
  mounted() {
    this.resetObj();
    this.refreshProfileTable();
  },

  computed: {
    computedProfileItems() {
      return this.profileItems.map((item) => {
        return {
          ...item,
          business: this.getProfileBusinessName(item),
          role: item.appUser.role,
        };
      });
    },

    stateOptions() {
      // Extract and sort state names alphabetically
      return Object.keys(this.statesAndDistricts)
        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
        .map((state) => ({
          label: state,
          value: state,
        }));
    },
    isFormValid() {
      // Example logic to check form validity
      return this.obj.name && this.obj.regNo && this.obj.address;
    },
    computedLogoUrl() {
      return this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
    },
  },
  methods: {
    updateProfile() {
      this.addOrUpdateProfile(this.profile);
    },
    addOrUpdateProfile(editObj) {
      var self = this;
      var profileDto = {
        profile: editObj,
        isResetPassword: self.isResetPassword,
        plainPassword: self.plainPassword,
        role: editObj.appUser.role,
      };

      if (!editObj.id) {
        this.profileApi
          .createProfileEmployee(profileDto)
          .then((response) => {
            // self.$router.push({ path: "/tenants/subscriptionList" });
            self.refreshProfileTable();
            self.editProfileModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.profileApi
          .updateProfileAppUser(profileDto)
          .then((response) => {
            self.toast("Success", "Database had been update", "success");
            self.refreshProfileTable();
            self.editProfileModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    getProfileBusinessName(item) {
      try {
        return item.defaultBusiness.name;
      } catch (error) {
        return "N/A";
      }
    },
    /// For Profile List
    onEditProfile(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteProfileConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteProfileConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningProfileModal = true;
    },
    addNewProfile() {
      this.profile = {
        fullName: "",
        appUser: {
          role: "Staff",
        },
        email: "",
        isEnable: true,
        defaultBusinessId: this.obj.id,
      };
      this.isResetPassword = true;
      this.editProfileModal = true;
      // this.$router.push({ path: "/admins/Tenant" });
    },
    refreshProfileTable() {
      var self = this;
      self.profileLoading = false;
      self.profileApi
        .getListByBusinessId(this.$route.params.id)
        .then((response) => {
          self.profileItems = response.result;
          console.log(self.profileItems);
          self.profileLoading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    isNewApplication() {
      if (this.$route.params.id) return false;
      return true;
    },
    onStateChange() {
      this.selectedDistrict = ""; // Reset district selection when state changes
    },
    uploaded(data) {
      this.obj.logoUrl = "/Documents/File/" + data.uploadedFiles[0].id;
    },
    chop_uploaded(data) {
      this.obj.companyChopUrl = "/Documents/File/" + data.uploadedFiles[0].id;
    },
    getChopImageUrl() {
      return this.removeTrailingSlash(apiUrl) + this.obj.companyChopUrl;
    },
    getImageUrl() {
      return this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
    onSubmit() {
      if (!this.obj.id) {
        this.api
          .createByCurrentTenant(this.obj)
          .then(() => {
            this.toast("Success", "Business created successfully", "success");
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(this.obj)
          .then(() => {
            this.toast("Success", "Business updated successfully", "success");
            this.resetObj();
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    toast(header, message, color) {
      this.infoList.push({ header, message, color });
    },
    getIcon(color) {
      switch (color) {
        case "success":
          return "cil-check-circle";
        case "danger":
          return "cil-x-circle";
        case "info":
          return "cil-info";
        default:
          return "cil-bell";
      }
    },
    resetObj() {
      if (this.$route.params.id) {
        this.api
          .get(this.$route.params.id)
          .then((response) => {
            this.obj = response.result;
            console.log(this.obj);
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.obj = this.getEmptyObj();
        this.api
          .getDefaultLogoUrl()
          .then((response) => {
            this.obj.logoUrl = response.result;
            console.log(this.obj);
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    getEmptyObj() {
      return {
        currency: "RM",
        country: "Malaysia",
        state: "Selangor",
        district: "Hulu Langat",
        logoUrl: "",
      };
    },
    removeTrailingSlash(str) {
      return str.endsWith("/") ? str.slice(0, -1) : str;
    },
  },
};
</script>

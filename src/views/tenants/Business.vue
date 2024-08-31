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
            <strong>Business Information</strong>
          </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="submit">
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

                  <!-- <CSelect
                    v-model="selectedState"
                    @change="onStateChange"
                    label="Select State"
                  >
                    <option
                      v-for="(districts, state) in statesAndDistricts"
                      :key="state"
                      :value="state"
                    >
                      {{ state }}
                    </option>
                  </CSelect> -->

                  <!-- District Selection -->
                  <CSelect
                    :value.sync="obj.district"
                    :options="statesAndDistricts[obj.state]"
                    label="District"
                  />
                  <!-- 
                  <CSelect
                    v-if="selectedState"
                    v-model="selectedDistrict"
                    label="Select District"
                  >
                    <option
                      v-for="district in statesAndDistricts[selectedState]"
                      :key="district"
                      :value="district"
                    >
                      {{ district }}
                    </option>
                  </CSelect> -->

                  <!-- <CSelect
                    v-model="selectedCountry"
                    label="Select Country"
                  >
                    <option
                      v-for="country in aseanCountries"
                      :key="country"
                      :value="country"
                    >
                      {{ country }}
                    </option>
                  </CSelect> -->

                  <!-- <CInput label="City" v-model="obj.city" />
                  <CInput label="Country" v-model="obj.country" />
                  <CInput label="State" v-model="obj.state" /> -->
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
              <!-- Logo Upload Section -->
              <!-- <CRow form class="form-group align-items-center">
                <CCol tag="label" sm="3" class="col-form-label">
                  Company Logo
                </CCol>
                <CCol sm="9">
                  <CImg
                    :src="getImageUrl()"
                    class="mb-2"
                    thumbnail
                    responsive
                  />
                  <WidgetsUploadImage :logoUrl="logoUrl" @uploaded="uploaded" />
                </CCol>
              </CRow> -->

              <!-- Company Chop Upload Section -->
              <!-- <CRow form class="form-group align-items-center">
                <CCol tag="label" sm="3" class="col-form-label">
                  Company Chop
                </CCol>
                <CCol sm="9">
                  <CImg
                    :src="getChopImageUrl()"
                    class="mb-2"
                    thumbnail
                    responsive
                  />
                  <WidgetsUploadImage
                    :logoUrl="chopUrl"
                    @uploaded="chop_uploaded"
                  />
                </CCol>
              </CRow> -->

              <!-- Submit Button -->
              <CButton
                type="submit"
                size="sm"
                color="primary"
                :disabled="!isFormValid"
              >
                <CIcon name="cil-check-circle" /> Submit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>


<script>
import BusinessApi from "@/lib/businessApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";
import { CIcon } from "@coreui/icons-vue";

export default {
  name: "Business",
  components: {
    WidgetsUploadImage,
    CIcon,
  },
  data() {
    return {
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
  },

  computed: {
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
  },
  methods: {
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
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.obj = this.getEmptyObj();
      }
    },
    getEmptyObj() {
      return {
        currency: "RM",
        country: "Malaysia",
        state: "Selangor",
        district: "Hulu Langat",
      };
    },
    removeTrailingSlash(str) {
      return str.endsWith("/") ? str.slice(0, -1) : str;
    },
  },
};
</script>

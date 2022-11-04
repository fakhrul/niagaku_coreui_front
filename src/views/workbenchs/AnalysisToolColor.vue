<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol>
            <h4>Drawing: {{ category }}</h4>
            <h4>Method: {{ method }}</h4>
            <strong>Instruction: {{ instruction }}</strong>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <table class="w-100">
              <tbody>
                <tr>
                  <td class="text-muted">HEX:</td>
                  <td class="font-weight-bold">{{ this.hexColor }}</td>
                </tr>
                <tr>
                  <td class="text-muted">RGB:</td>
                  <td class="font-weight-bold">{{ this.bgColor }}</td>
                </tr>
              </tbody>
            </table>

            <div :style="{ paddingTop: '10%', background: this.bgColor }"></div>
          </CCol>
        </CRow>
        <CRow>
          <CRow
            ><CCol>
              <CButton
                size="lg"
                variant="outline"
                color="info"
                block
                @click="startClick"
                v-c-tooltip="'Scale'"
              >
                Start
              </CButton></CCol
            >
          </CRow>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { rgbToHex } from "@coreui/utils/src";

export default {
  props: {
    colorCode: [],
    category: "",
    method: "",
    instruction: "",
  },
  methods: {
    startClick() {
      this.$emit("startClick");
    },
  },

  data() {
    return {
      showSettings: true,
      //bgColor: 'rgb(255, 255, 255)'
    };
  },
  computed: {
    hexColor() {
      return rgbToHex(this.bgColor);
    },
    bgColor() {
      return (
        "rgb(" +
        this.colorCode[0] +
        "," +
        this.colorCode[1] +
        "," +
        this.colorCode[2] +
        ")"
      );
    },
    colorInString() {
      try {
        if (this.colorCode) {
          var colorCodeInString =
            "(" +
            this.colorCode[0] +
            "," +
            this.colorCode[1] +
            "," +
            this.colorCode[2] +
            ")";
          return colorCodeInString;
        }
        return "??";
      } catch (error) {
        console.log("error", error);
        return "UNKNOWN";
      }
    },
  },
  watch: {},
};
</script>

<style lang="sass" scoped>
aside
  width: 15rem
</style>
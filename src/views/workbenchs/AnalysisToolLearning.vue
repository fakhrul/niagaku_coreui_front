<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol>
            <h4>Drawing: {{ category }}</h4>
            <h4>Method: {{ method }}</h4>
            <strong>Instruction: {{ instruction }}</strong></CCol
          >
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
    };
  },

  watch: {},
};
</script>

<style lang="sass" scoped>
aside
  width: 15rem
</style>
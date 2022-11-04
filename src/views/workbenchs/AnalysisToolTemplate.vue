<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol> Please draw the template for wall</CCol>
        </CRow>
        <CRow>
          <CCol v-for="item in template" :key="item.code"> x={{ item.x }}{{ item.y }}</CCol>
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
                Analayze
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
  methods: {
    startClick() {
      this.$emit("startClick");
    },
  },
  props: {
    template: null,
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
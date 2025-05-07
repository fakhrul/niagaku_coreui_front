<template>
  <CToaster :autohide="3000">
    <CToast
      v-for="(info, index) in toasts"
      :key="`${info.header}-${index}`"
      :show="true"
      :header="info.header"
      :color="info.color"
    >
      {{ info.message }}
    </CToast>
  </CToaster>
</template>
  
  <script>
export default {
  name: "ToastContainer",
  props: {
    toasts: {
      type: Array,
      required: true,
    },
  },
};
</script>
  
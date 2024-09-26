<template>
  <CSidebar
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CImg :src="logoUrl" height="48"></CImg>
      <!-- 
       <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 642 134"
      /> -->
      <!--  <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      /> -->
    </CSidebarBrand>
    <CRenderFunction flat :contentToRender="navigation" />
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />
  </CSidebar>
</template>

<script>
import adminNav from "./_adminNav";
import tenantAdminNav from "./_tenantAdminNav";
import accountantNav from "./_accountantNav";
import nav from "./_nav";

import accountantNavMyLedger from "./_accountantNavMyLedger";
import navMyLedger from "./_navMyLedger";

import { mapState } from "vuex"; // Import Vuex helpers


export default {
  name: "TheSidebar",
  nav,
  adminNav,
  data: () => {
    return {
      //logoUrl: "/img/logo.png",
    };
  },
  computed: {
    ...mapState({
      // logoUrl: (state) => state.logoUrl, // Access the logo from Vuex
      logoUrl: (state) => state.logoUrl || "/logo.png", // Access the logo from Vuex
      primaryColor: (state) => state.primaryColor || "#756CFB", // Access the primary color from Vuex
    }),
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
    navigation() {
      try {
        var role = auth.getRole();
        // console.log("role", role);
        const fullDomain = window.location.hostname;

        console.log(fullDomain);
        if (fullDomain == "myledger.safa.com.my") {
          if (role == "SystemAdmin") {
            return adminNav;
          } else if (role == "TenantAdmin") {
            return tenantAdminNav;
          } else if (role == "Accountant") {
            return accountantNavMyLedger;
          } else {
            return navMyLedger;
          }
        } else {
          if (role == "SystemAdmin") {
            return adminNav;
          } else if (role == "TenantAdmin") {
            return tenantAdminNav;
          } else if (role == "Accountant") {
            return accountantNav;
          } else {
            return nav;
          }
        }
      } catch (error) {}
      return nav;
    },
  },
};
</script>


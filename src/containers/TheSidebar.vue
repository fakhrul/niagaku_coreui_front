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
    <CRenderFunction flat :contentToRender="navigation"/>
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />
  </CSidebar>
</template>

<script>
import adminNav from "./_adminNav";
import nav from "./_nav";

export default {
  name: 'TheSidebar',
  nav,
  adminNav,
  data: () => {
    return {
      logoUrl: "img/logo.png",
    };
  },
  computed: {
    show () {
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    },
    navigation() {
       try {
        var role = auth.getRole();
        console.log('role',role);
        if (role == "admin") {
          return adminNav;
        }
        if (role == "normal") {
          return nav;
        }
      } catch (error) {}
      return nav;

      return ;
    },
  }
}
</script>


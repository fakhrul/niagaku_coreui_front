<template>
  <CHeader>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />

    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
   
    <CHeaderNav class="mr-auto">
      <CHeaderNavItem class="px-3">
        <TheHeaderDropdownBusiness></TheHeaderDropdownBusiness>
      </CHeaderNavItem>
   <!--   <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink> 
      </CHeaderNavItem>-->
    </CHeaderNav>
    <CHeaderNav>
      
     <CHeaderNavItem class="px-3 c-d-legacy-none">
        <button
          @click="() => $store.commit('toggle', 'darkMode')"
          class="c-header-nav-btn"
        >
          <CIcon v-if="$store.state.darkMode" name="cil-sun"/>
          <CIcon v-else name="cil-moon"/>
        </button>
      </CHeaderNavItem>  <!-- -->
    <!--   <TheHeaderDropdownNotif/> -->
       <!--<TheHeaderDropdownTasks/>
      <TheHeaderDropdownMssgs/> -->
      <TheHeaderDropdownAccnt/>
      <!-- <CHeaderNavItem class="px-3">
        <button
          class="c-header-nav-btn"
          @click="$store.commit('toggle', 'asideShow')"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2"/>
        </button>
      </CHeaderNavItem> -->
    </CHeaderNav>

    <!-- <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader> -->
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
import TheHeaderDropdownMssgs from './TheHeaderDropdownMssgs'
import TheHeaderDropdownBusiness from './TheHeaderDropdownBusiness'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    TheHeaderDropdownNotif,
    TheHeaderDropdownTasks,
    TheHeaderDropdownMssgs,
    TheHeaderDropdownBusiness
  },
   data: () => {
    return {
      logoUrl: "/img/logo.png",
    };
  },
  computed: {
    userName() {
      try {
        return auth.getUserName();
      } catch (error) {}
      return "Unknown";
    },
    businessName() {
      try {
        return auth.getDefaultBusinessName();
      } catch (error) {}
      return "Unknown";
    },

    
  },
}
</script>

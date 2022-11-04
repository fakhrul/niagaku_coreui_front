<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img src="img/avatars/1.jpg" class="c-avatar-img" />
        </div>
      </CHeaderNavLink>
    </template>
    <!-- <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
   -->
    <CDropdownItem @click="onDashboard">
      <CIcon name="cil-lock-locked" /> Dashboard
    </CDropdownItem>
    <!-- <CDropdownItem @click="onLogout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem> -->
  </CDropdown>
</template>

<script>
export default {
  name: "WorkHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42,
    };
  },
  methods: {
    onProfile() {
      this.$router.push({ path: "/general/profile" });
    },
    onDashboard() {
      this.$router.push({ path: "/" });
    },
    onLogout() {
      let self = this;
      auth.logout();
      self.$router.push({ path: "/pages/login" });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
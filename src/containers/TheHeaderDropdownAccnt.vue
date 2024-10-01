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
          <img src="/img/avatars/6.jpg" class="c-avatar-img" />
        </div>
      </CHeaderNavLink> </template
    ><!--
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
 <CDropdownItem>
      <CIcon name="cil-bell"/> Updates
      <CBadge color="info" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem> -->
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem @click="navigateTo('/pages/profile')">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem
      v-if="isTenantAdmin()"
      @click="navigateTo('/tenants/subscriptionList')"
    >
      <CIcon name="cilTags" />
      Subsriptions
    </CDropdownItem>
    <CDropdownItem v-if="isTenantAdmin()" @click="navigateTo('/tenants/businessList')">
      <CIcon name="cilIndustry" /> Business
      <!-- <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge> -->
    </CDropdownItem>
    <CDropdownItem v-if="isTenantAdmin()" @click="navigateTo('/tenants/branding')">
      <CIcon name="cil-file" /> Branding
      <!-- <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge> -->
    </CDropdownItem>
    <CDropdownDivider />
    <!-- <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem>     -->
    <CDropdownItem @click="onLogout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: "TheHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42,
    };
  },
  methods: {
    isTenantAdmin() {
      var role = auth.getRole();
      if (role == "TenantAdmin") return true;
      return false;
    },
    navigateTo(path) {
      this.$router.push({ path: path });
    },
    onProfile() {
      this.$router.push({ path: "/general/profile" });
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
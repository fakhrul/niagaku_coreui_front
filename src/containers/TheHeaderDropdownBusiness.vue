<template>
  <div class="wrapper">
    <CDropdown
      v-if="isTenantAdmin()"
      placement="bottom"
      :caret="false"
      in-nav
      class="c-header-nav-items"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavLink>
          {{ currentBusinessShortName }}
          <!-- <CIcon name="cil-bell" />
        <CBadge shape="pill" color="danger">{{ itemsCount }}</CBadge> -->
        </CHeaderNavLink>
      </template>
      <CDropdownHeader tag="div" class="text-center bg-light">
        <strong>Select your buisness</strong>
      </CDropdownHeader>
      <CDropdownItem
        v-for="item in businessList"
        :key="item.id"
        @click="changeBusiness(item)"
      >
        {{ item.name }}
      </CDropdownItem>
    </CDropdown>
    <div v-else>
      {{ currentBusinessShortName }}
    </div>
  </div>
</template>
<script>
import ProfileApi from "@/lib/profileApi";
import BusinessApi from "@/lib/businessApi";

export default {
  name: "TheHeaderDropdownNotif",
  data() {
    return {
      profileaApi: new ProfileApi(),
      businessApi: new BusinessApi(),
      businessList: [],
      currentProfile: {},
      itemsCount: 5,
      infoList: [],
    };
  },

  mounted() {
    this.initalize();
  },
  computed: {
    currentRole() {
      return this.currentProfile.appUser.role;
    },
    currentBusinessShortName() {
      try {
        return this.currentProfile.defaultBusiness.shortName;
      } catch (error) {
        return "???";
      }
    },
  },

  methods: {
    isTenantAdmin() {
      var role = auth.getRole();
      if (role == "TenantAdmin") return true;
      return false;
    },
    initalize() {
      this.fetchCurrentProfile();
      this.fetchBusinessList();
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    changeBusiness(item) {
      var self = this;
      self.businessApi
        .updateDefaultBusiness(item)
        .then((response) => {
          this.initalize();
          this.$router.push({ path: "/" }).then(() => {
            // Force reload the page to clear all cached data
            window.location.reload();
          });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchCurrentProfile() {
      var self = this;
      this.profileaApi
        .getCurrentProfile()
        .then((response) => {
          self.currentProfile = response.result;
          // console.log(self.currentProfile);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchBusinessList() {
      var self = this;
      self.businessApi
        .getListByCurrentTenant()
        .then((response) => {
          self.businessList = response.result;
          // console.log(self.businessList);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
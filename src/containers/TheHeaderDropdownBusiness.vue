
<template>
  <div class="wrapper">
    <!-- <ToastContainer :toasts="infoList" /> -->

    <CDropdown
      v-if="isTenantAdmin()"
      placement="bottom"
      :caret="false"
      in-nav
      class="c-header-nav-items"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavLink class="dropdown-toggler">
          <img
            :src="getBusinessIcon(currentBusiness)"
            alt="Business Logo"
            class="business-icon"
          />
          {{ currentBusinessShortName }}
          <CIcon name="cil-chevron-bottom" class="ml-2 dropdown-icon" />
        </CHeaderNavLink>
      </template>
      <CDropdownHeader tag="div" class="text-center bg-light">
        <strong>Select your business</strong>
      </CDropdownHeader>
      <CDropdownItem
        v-for="item in businessList"
        :key="item.id"
        @click="changeBusiness(item)"
        class="dropdown-item"
        :disabled="item.id == currentBusiness.id"
      >
        <img
          :src="getBusinessIcon(item)"
          alt="Business Logo"
          class="business-icon"
        />
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
import ToastContainer from "@/views/widgets/ToastContainer.vue";

export default {
  name: "TheHeaderDropdownBusiness",
  components: {
    ToastContainer,
  },
  data() {
    return {
      defaultIcon: "/img/avatars/6.jpg",
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
    currentBusiness() {
      try {
        return this.currentProfile.defaultBusiness;
      } catch (error) {
        return null;
      }
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
    getBusinessIcon(item) {
      try {
        return item.logoUrl ? this.getImageUrl(item.logoUrl) : this.defaultIcon;
      } catch (error) {
        return this.defaultIcon;
      }
    },
    getImageUrl(url) {
      return this.removeTrailingSlash(apiUrl) + url;
    },
    removeTrailingSlash(str) {
      return str.endsWith("/") ? str.slice(0, -1) : str;
    },
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
      console.log("Current business:", this.currentBusiness);
      console.log("Changing business...", item);
      if (item.id == this.currentBusiness.id) {
        this.toast("Info", "You are already in this business", "info");
        return;
      }
      var self = this;
      self.businessApi
        .updateDefaultBusiness(item)
        .then((response) => {
          this.initalize();
          this.$router
            .push({ path: "/dashboard" })
            .then(() => {
              window.location.reload();k
            })
            .catch((err) => {
              window.location.reload(); // Still reload even on same path
            });
          // this.$router.push({ path: "/" }).then(() => {
          //   // Force reload the page to clear all cached data
          //   window.location.reload();
          // });
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
          auth.updateDefaultBusiness(
            self.currentProfile.defaultBusiness
          ); // Update auth with the new default business
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
          console.log(self.businessList);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
  },
};
</script>
<style scoped>
.dropdown-toggler {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--cui-header-bg);
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.dropdown-toggler:hover {
  background-color: var(--cui-hover-bg);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.dropdown-icon {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: var(--cui-hover-bg);
  color: var(--cui-primary);
}

.business-icon {
  width: 24px; /* Set a fixed width */
  height: 24px; /* Set a fixed height */
  margin-right: 8px;
  border-radius: 50%; /* Make it circular */
  object-fit: cover; /* Ensures the image fits well */
}
</style>
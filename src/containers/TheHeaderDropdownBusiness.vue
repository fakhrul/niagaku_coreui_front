<template>
  <div class="wrapper">
    <div>
      <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast
            :key="info.message"
            :show="true"
            :header="info.header"
            :color="info.color"
          >
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster>
    </div>
    <CDropdown
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
        <CIcon name="cil-basket" class="text-primary" /> {{ item.name }}
      </CDropdownItem>

      <!-- <CDropdownItem>
      <CIcon name="cil-user-follow" class="text-success" /> New user registered
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-user-unfollow" class="text-danger" /> User deleted
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-chart-pie" class="text-info" /> Sales report is ready
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-basket" class="text-primary" /> New client
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-speedometer" class="text-warning" /> Server overloaded
    </CDropdownItem>
    <CDropdownHeader tag="div" class="text-center bg-light">
      <strong>Server</strong>
    </CDropdownHeader>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>CPU Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="info" :value="25" />
      <small class="text-muted">348 Processes. 1/4 Cores.</small>
    </CDropdownItem>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>Memory Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="warning" :value="70" />
      <small class="text-muted">11444GB/16384MB</small>
    </CDropdownItem>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>SSD 1 Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="danger" :value="90" />
      <small class="text-muted">243GB/256GB</small>
    </CDropdownItem> -->
    </CDropdown>
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
        return "???"
      }
    },
  },

  methods: {
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
          console.log(self.currentProfile);
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
.c-icon {
  margin-right: 0.3rem;
}
</style>
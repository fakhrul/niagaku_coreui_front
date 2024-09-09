<template>
  <router-view></router-view>
</template>

<script>
import BrandingApi from "@/lib/brandingApi";
import { mapMutations } from "vuex";

export default {
  name: "App",
  data() {
    return {
      brandApi: new BrandingApi(),
    };
  },
  created() {
    this.resetBrand(); // Fetch branding on app load
  },
  methods: {
    ...mapMutations(["setBranding"]), // Vuex mutation to update branding state
    removeTrailingSlash(str) {
      if (str.endsWith("/")) {
        return str.slice(0, -1);
      }
      return str;
    },
    getFullLogoUrl(logoUrl) {
      var url = this.removeTrailingSlash(apiUrl) + logoUrl;
      return url;
    },
    resetBrand() {
      const self = this;
      const fullDomain = window.location.hostname; // e.g., "tenant1.niagaku.com"

      // Call the branding API to fetch tenant-specific branding by domain
      this.brandApi
        .getByDomain(fullDomain)
        .then((response) => {
          const obj = response.result;
          console.log(obj);
          obj.logoUrl = this.getFullLogoUrl(obj.logoUrl);
          obj.faviconUrl = this.getFullLogoUrl(obj.faviconUrl);
          // Commit branding data to Vuex
          this.setBranding(obj);

          // Apply the branding (logo, colors, etc.)
          this.applyBranding(obj);
        })
        .catch((error) => {
          this.applyDefaultBranding(); // Apply default branding if the API call fails
        });
    },

    // Apply branding to the app using CSS variables and logo updates
    applyBranding(branding) {
      // Update CSS variables for colors and fonts
      document.documentElement.style.setProperty(
        "--primary-color",
        branding.primaryColor || "#756CFB"
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        branding.secondaryColor || "#756CFB"
      );
      document.documentElement.style.setProperty(
        "--font-family",
        branding.fontFamily || "Arial"
      );

      // Update the logo dynamically
      this.updateLogo(branding.logoUrl || "/logo.png");

      // Optionally update favicon
      this.updateFavicon(branding.faviconUrl || "/favicon.ico");
    },

    // Fallback for default branding if no tenant-specific branding is found
    applyDefaultBranding() {
      document.documentElement.style.setProperty("--primary-color", "#756CFB");
      document.documentElement.style.setProperty(
        "--secondary-color",
        "#756CFB"
      );
      document.documentElement.style.setProperty("--font-family", "Arial");

      this.updateLogo("/logo.png");
      this.updateFavicon("/favicon.ico");
    },

    // Update the logo element dynamically
    updateLogo(logoUrl) {
      const logoElement = document.getElementById("logo");
      if (logoElement) {
        logoElement.src = logoUrl;
      }
    },

    // Update favicon dynamically
    updateFavicon(faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = faviconUrl;
    },
  },
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>

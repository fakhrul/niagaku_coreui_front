<template>
  <div class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <TheSidebar/>
    <TheAside/>
    <CWrapper>
      <TheHeader/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </CWrapper>
    
    <!-- N8N Chat Widget - Floating Chat -->
    <N8nChatWidget 
      v-if="showChatWidget && isWebhookReady"
      :webhook-url="dynamicWebhookUrl"
      mode="window"
      :show-welcome-screen="false"
      :initial-messages="contextualInitialMessages"
      :metadata="enrichedChatMetadata"
      :customization="currentCustomization"
      @chat-initialized="onChatInitialized"
      @chat-error="onChatError"
      @chat-loading="onChatLoading"
    />
  </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import TheAside from './TheAside'
import N8nChatWidget from '../views/widgets/N8nChatWidget.vue'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter,
    TheAside,
    N8nChatWidget
  },
  data() {
    return {
      showChatWidget: true,
      chatInitialized: false,
      isWebhookReady: false,
      sessionId: null,
      
      // Base webhook configuration
      webhookConfig: {
        baseUrl: 'https://n8n.safa.com.my/webhook',
        webhookId: '5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd',
        // webhookId: 'aca39e23-1b3f-48e0-b2b0-f058617d556c',
        endpoint: 'chat'
      }
    }
  },
  
  async created() {
    await this.initializeComponent()
  },
  
  computed: {
    // Build dynamic webhook URL with parameters
    dynamicWebhookUrl() {
      if (!this.isWebhookReady) return ''
      
      try {
        const { baseUrl, webhookId, endpoint } = this.webhookConfig
        const baseWebhookUrl = `${baseUrl}/${webhookId}/${endpoint}`
        
        // Build query parameters
        const params = new URLSearchParams()
        
        // Add business context
        if (this.currentUser?.businessId) {
          params.append('businessId', this.currentUser.businessId)
        }
        
        // Add profile context
        if (this.currentUser?.profileId) {
          params.append('profileId', this.currentUser.profileId)
        }
        
        // Add user role
        if (this.currentUser?.role) {
          params.append('role', this.currentUser.role)
        }
        
        // Add session identifier
        // if (this.sessionId) {
        //   params.append('sessionId', this.sessionId)
        // }
        
        // // Add application context
        // params.append('source', 'vue-app')
        // params.append('version', process.env.VUE_APP_VERSION || '1.0.0')
        // params.append('timestamp', Date.now().toString())
        
        const queryString = params.toString()
        const finalUrl = queryString ? `${baseWebhookUrl}?${queryString}` : baseWebhookUrl
        
        console.log('Dynamic webhook URL generated:', finalUrl)
        return finalUrl
        
      } catch (error) {
        console.error('Error building webhook URL:', error)
        return `${this.webhookConfig.baseUrl}/${this.webhookConfig.webhookId}/${this.webhookConfig.endpoint}`
      }
    },
    
    // Get current user from store with fallbacks
    currentUser() {

     let localUser = auth.getLocalUser();
     console.log('Current user from local storage:', localUser);
      if (localUser) {
        return {
          profileId: localUser.profileId || '',
          businessId: localUser.profile.defaultBusinessId || '',
          name: localUser.profile.fullName || '???',
          userName: localUser.userName || '',
          role: localUser.role || 'visitor',
          email: localUser.email || null
        }
      }
      return null;

      // return this.$store.getters.getCurrentUser || this.$store.state.user || {
      //   id: 'anonymous',
      //   name: 'Guest User',
      //   role: 'visitor',
      //   email: null
      // }
    },
    
    // Get current business context
    // currentBusiness() {


    //   return this.$store.getters.getCurrentBusiness || 
    //          this.$store.state.currentBusiness || 
    //          this.$store.state.business || null
    // },
    
    // Get current profile context
    // currentProfile() {
    //   return this.$store.getters.getCurrentProfile || 
    //          this.$store.state.currentProfile || 
    //          this.$store.state.profile || null
    // },
    
    // Contextual initial messages based on user/business
    contextualInitialMessages() {
      const userName = this.currentUser?.name || 'there'
      const businessName = 'Niaga-Ku'
      
      const messages = [
        `Hello ${userName}! 👋`,
        `Welcome to ${businessName} support chat!`
      ]
      
      // Add role-specific messaging
      if (this.currentUser?.role) {
        switch (this.currentUser.role.toLowerCase()) {
          case 'admin':
          case 'administrator':
            messages.push('As an administrator, I can help you with system management and advanced features.')
            break
          case 'manager':
            messages.push('I can assist you with management tools and reporting features.')
            break
          case 'user':
          case 'client':
            messages.push('How can I help you today?')
            break
          default:
            messages.push('How can I assist you today?')
        }
      } else {
        messages.push('How can I help you today?')
      }
      
      return messages
    },
    
    // Enhanced metadata with all available context
    enrichedChatMetadata() {
      const metadata = {
        // User context
        userId: this.currentUser?.id || 'anonymous',
        userName: this.currentUser?.name || 'Guest',
        userEmail: this.currentUser?.email || null,
        userRole: this.currentUser?.role || 'visitor',
        
        // Business context
        businessId: this.currentUser?.businessId || null,
        // businessName: this.currentBusiness?.name || null,
        // businessType: this.currentBusiness?.type || null,
        
        // Profile context
        profileId: this.currentUser?.profileId || null,
        // profileRole: this.currentProfile?.role || null,
        // profilePermissions: this.currentProfile?.permissions || [],
        
        // Application context
        source: 'vue-app',
        currentRoute: this.$route?.name || 'unknown',
        currentPath: this.$route?.path || '/',
        
        // Environment context
        appVersion: process.env.VUE_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        darkMode: this.$store.state.darkMode,
        
        // Session context
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language || 'en-US'
      }
      
      // Remove null/undefined values to keep metadata clean
      return Object.fromEntries(
        Object.entries(metadata).filter(([, value]) => value != null)
      )
    },
    
    // Dynamic customization based on dark mode and business branding
    currentCustomization() {
      const baseCustomization = {
        windowWidth: '380px',
        windowHeight: '600px',
        borderRadius: '12px',
        toggleSize: '60px'
      }
      
      // Apply business branding if available
      // const businessColors = this.currentBusiness?.branding || {}
      
      if (this.$store.state.darkMode) {
        return {
          ...baseCustomization,
          primaryColor: '#4f46e5',
          secondaryColor:'#06b6d4',
          backgroundColor: '#1f2937',
          textColor: '#f9fafb',
          headerBackground:  '#111827',
          headerColor: '#f9fafb'
        }
      } else {
        return {
          ...baseCustomization,
          primaryColor:  '#667eea',
          secondaryColor:  '#764ba2',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          headerBackground:  '#667eea',
          headerColor: '#ffffff'
        }
      }
    }
  },
  
  methods: {
    // Initialize component with proper async handling
    async initializeComponent() {
      try {
        // Generate session ID
        this.generateSessionId()
        
        // Wait for store to be ready
        await this.waitForStoreReady()
        
        // Validate webhook configuration
        this.validateWebhookConfig()
        
        // Mark as ready
        this.isWebhookReady = true
        
        console.log('Chat component initialized successfully')
        
      } catch (error) {
        console.error('Failed to initialize chat component:', error)
        this.handleInitializationError(error)
      }
    },
    
    // Wait for store to have necessary data
    waitForStoreReady(timeout = 5000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now()
        
        const checkStore = () => {
          // Check if we have at least basic user data
          let localUser = auth.getLocalUser();
          if (localUser && localUser.profile && localUser.profile.defaultBusinessId) {
            resolve()
            return
          }
          
          // Timeout check
          if (Date.now() - startTime > timeout) {
            console.warn('Store data not ready within timeout, proceeding anyway')
            resolve()
            return
          }
          
          // Check again in 100ms
          setTimeout(checkStore, 100)
        }
        
        checkStore()
      })
    },
    
    // Validate webhook configuration
    validateWebhookConfig() {
      const { baseUrl, webhookId, endpoint } = this.webhookConfig
      
      if (!baseUrl || !webhookId || !endpoint) {
        throw new Error('Invalid webhook configuration')
      }
      
      // Validate URL format
      try {
        new URL(`${baseUrl}/${webhookId}/${endpoint}`)
      } catch (error) {
        throw new Error('Invalid webhook URL format')
      }
    },
    
    // Generate unique session ID
    generateSessionId() {
      if (!this.sessionId) {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substr(2, 9)
        const userId = this.currentUser?.profileId || 'anon'
        this.sessionId = `${userId}_${timestamp}_${random}`
      }
      return this.sessionId
    },
    
    // Chat event handlers
    onChatInitialized(chatInstance) {
      console.log('N8N Chat initialized successfully:', chatInstance)
      this.chatInitialized = true
      
      // Store chat instance in Vuex if needed
      if (this.$store.commit) {
        this.$store.commit('setChatInstance', chatInstance)
      }
      
      // Track analytics event
      this.trackChatEvent('chat_initialized', {
        userId: this.currentUser?.profileId,
        businessId: this.currentUser?.businessId,
        sessionId: this.sessionId
      })
      
      // Show success notification
      this.showSuccessNotification('Chat support is now available!')
    },
    
    onChatError(error) {
      console.error('N8N Chat initialization failed:', error)
      this.chatInitialized = false
      
      // Track error event
      this.trackChatEvent('chat_error', {
        error: error.message,
        userId: this.currentUser?.profileId,
        sessionId: this.sessionId
      })
      
      // Handle error gracefully
      this.handleChatError(error)
    },
    
    onChatLoading(isLoading) {
      console.log('Chat loading state:', isLoading)
      // Could update global loading state if needed
    },
    
    // Error handling
    handleInitializationError(error) {
      console.error('Chat initialization error:', error)
      this.showErrorNotification('Unable to initialize chat. Please refresh the page.')
    },
    
    handleChatError(error) {
      const isNetworkError = error.message.includes('network') || error.message.includes('fetch')
      
      if (isNetworkError) {
        this.showErrorNotification('Network error. Please check your connection and try again.')
      } else {
        this.showErrorNotification('Chat service is temporarily unavailable. Please try again later.')
      }
      
      // Auto-hide chat widget after persistent errors
      setTimeout(() => {
        if (!this.chatInitialized) {
          this.showChatWidget = false
        }
      }, 10000)
    },
    
    // Notification methods (integrate with your notification system)
    showSuccessNotification(message) {
      // Integrate with your existing notification system
      if (this.$toast?.success) {
        this.$toast.success(message, {
          position: 'top-right',
          timeout: 3000
        })
      } else {
        console.log('SUCCESS:', message)
      }
    },
    
    showErrorNotification(message) {
      // Integrate with your existing notification system
      if (this.$toast?.error) {
        this.$toast.error(message, {
          position: 'top-right',
          timeout: 5000
        })
      } else {
        console.error('ERROR:', message)
      }
    },
    
    // Analytics tracking
    trackChatEvent(eventName, properties = {}) {
      // Integrate with your analytics service (GA, Mixpanel, etc.)
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties)
      } else if (typeof analytics !== 'undefined') {
        analytics.track(eventName, properties)
      } else {
        console.log('ANALYTICS:', eventName, properties)
      }
    },
    
    // Utility methods for external control
    toggleChatWidget() {
      this.showChatWidget = !this.showChatWidget
      
      this.trackChatEvent('chat_toggled', {
        visible: this.showChatWidget,
        userId: this.currentUser?.profileId
      })
    },
    
    refreshChatWidget() {
      this.showChatWidget = false
      this.chatInitialized = false
      
      this.$nextTick(() => {
        this.showChatWidget = true
      })
      
      this.trackChatEvent('chat_refreshed', {
        userId: this.currentUser?.profileId,
        sessionId: this.sessionId
      })
    },
    
    // Programmatically update webhook parameters
    updateWebhookParams(newParams = {}) {
      // This would trigger a reactive update of the webhook URL
      // Useful for when business/profile context changes
      this.$forceUpdate()
      
      console.log('Webhook parameters updated:', newParams)
    }
  },
  
  watch: {
    // React to route changes
    '$route'(newRoute, oldRoute) {
      console.log('Route changed:', oldRoute?.name, '->', newRoute?.name)
      
      // Track page view for chat context
      this.trackChatEvent('page_view', {
        from: oldRoute?.name,
        to: newRoute?.name,
        userId: this.currentUser?.profileId
      })
    },
    
    // React to dark mode changes
    '$store.state.darkMode'(newValue) {
      console.log('Dark mode toggled:', newValue)
      
      this.trackChatEvent('theme_changed', {
        darkMode: newValue,
        userId: this.currentUser?.profileId
      })
    },
    
    // React to business context changes
    // currentBusiness: {
    //   handler(newBusiness, oldBusiness) {
    //     if (newBusiness?.id !== oldBusiness?.id) {
    //       console.log('Business context changed:', oldBusiness?.id, '->', newBusiness?.id)
          
    //       // Refresh chat with new context
    //       this.refreshChatWidget()
    //     }
    //   },
    //   deep: true
    // },
    
    // React to user context changes
    currentUser: {
      handler(newUser, oldUser) {
        if (newUser?.profileId !== oldUser?.profileId) {
          console.log('User context changed:', oldUser?.profileId, '->', newUser?.profileId)
          
          // Generate new session ID for new user
          this.sessionId = null
          this.generateSessionId()
          
          // Refresh chat with new context
          this.refreshChatWidget()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Ensure chat widget doesn't interfere with layout */
.c-app {
  position: relative;
}
</style>
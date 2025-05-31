<template>
  <div class="n8n-chat-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="chat-loading">
      <div class="loading-spinner"></div>
      <span>Initializing chat...</span>
    </div>
    
    <!-- Error state -->
    <div v-if="hasError && !isLoading" class="chat-error">
      <div class="error-icon">⚠️</div>
      <span>Chat unavailable</span>
      <button @click="retryInitialization" class="retry-btn">Retry</button>
    </div>
    
    <!-- Chat container -->
    <div :id="targetId" v-show="!isLoading && !hasError"></div>
  </div>
</template>

<script>
export default {
  name: 'N8nChatWidget',
  props: {
    webhookUrl: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'window',
      validator: (value) => ['window', 'fullscreen'].includes(value)
    },
    showWelcomeScreen: {
      type: Boolean,
      default: false
    },
    initialMessages: {
      type: Array,
      default: () => [
        'Hi there! 👋',
        'How can I assist you today?'
      ]
    },
    chatInputKey: {
      type: String,
      default: 'chatInput'
    },
    chatSessionKey: {
      type: String,
      default: 'sessionId'
    },
    metadata: {
      type: Object,
      default: () => ({})
    },
    customization: {
      type: Object,
      default: () => ({})
    },
    i18n: {
      type: Object,
      default: () => ({
        en: {
          title: 'Hi there! 👋',
          subtitle: "Start a chat. We're here to help you 24/7.",
          footer: '',
          getStarted: 'New Conversation',
          inputPlaceholder: 'Type your question..',
        }
      })
    }
  },
  data() {
    return {
      targetId: `n8n-chat-${Date.now()}`,
      isLoading: false,
      hasError: false,
      chatInstance: null,
      scriptsLoaded: false,
      retryCount: 0,
      maxRetries: 3
    }
  },
  mounted() {
    this.initializeChat()
  },
  beforeDestroy() {
    this.cleanup()
  },
  methods: {
    async initializeChat() {
      if (this.isLoading) return
      
      this.isLoading = true
      this.hasError = false
      this.$emit('chat-loading', true)
      
      try {
        await this.loadChatResources()
        await this.createChatInstance()
        
        this.isLoading = false
        this.retryCount = 0
        this.$emit('chat-loading', false)
        this.$emit('chat-initialized', this.chatInstance)
        
      } catch (error) {
        console.error('Failed to initialize n8n chat:', error)
        this.isLoading = false
        this.hasError = true
        this.$emit('chat-loading', false)
        this.$emit('chat-error', error)
        
        // Auto retry
        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          console.log(`Retrying chat initialization (${this.retryCount}/${this.maxRetries})`)
          setTimeout(() => {
            this.initializeChat()
          }, 2000 * this.retryCount)
        }
      }
    },
    
    async loadChatResources() {
      // Load CSS
      if (!document.querySelector('link[data-n8n-chat-css]')) {
        const cssLink = document.createElement('link')
        cssLink.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css'
        cssLink.rel = 'stylesheet'
        cssLink.setAttribute('data-n8n-chat-css', 'true')
        document.head.appendChild(cssLink)
        
        // Wait for CSS to load
        await new Promise(resolve => {
          cssLink.onload = resolve
          cssLink.onerror = resolve // Continue even if CSS fails
        })
      }
      
      // Load JavaScript module
      if (!window.n8nChatModule) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.type = 'module'
          script.innerHTML = `
            try {
              const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
              window.n8nChatModule = { createChat };
              window.dispatchEvent(new CustomEvent('n8nChatLoaded', { detail: { success: true } }));
            } catch (error) {
              console.error('Failed to load n8n chat module:', error);
              window.dispatchEvent(new CustomEvent('n8nChatLoaded', { detail: { success: false, error } }));
            }
          `
          
          const handleLoad = (event) => {
            window.removeEventListener('n8nChatLoaded', handleLoad)
            if (event.detail.success) {
              resolve()
            } else {
              reject(new Error('Failed to load n8n chat module: ' + event.detail.error))
            }
          }
          
          window.addEventListener('n8nChatLoaded', handleLoad)
          document.head.appendChild(script)
          
          // Timeout after 10 seconds
          setTimeout(() => {
            window.removeEventListener('n8nChatLoaded', handleLoad)
            reject(new Error('Timeout loading n8n chat module'))
          }, 10000)
        })
      }
    },
    
    async createChatInstance() {
      if (!window.n8nChatModule || !window.n8nChatModule.createChat) {
        throw new Error('N8N chat module not loaded')
      }
      
      // Apply customization before creating chat
      if (this.customization && Object.keys(this.customization).length > 0) {
        this.applyChatCustomization(this.customization)
      }
      
      // Wait a bit for DOM to be ready
      await this.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const chatConfig = {
        webhookUrl: this.webhookUrl,
        target: `#${this.targetId}`,
        mode: this.mode,
        showWelcomeScreen: this.showWelcomeScreen,
        initialMessages: this.initialMessages,
        chatInputKey: this.chatInputKey,
        chatSessionKey: this.chatSessionKey,
        metadata: this.metadata,
        defaultLanguage: 'en',
        i18n: this.i18n,
        webhookConfig: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
      
      console.log('Creating chat with config:', chatConfig)
      this.chatInstance = await window.n8nChatModule.createChat(chatConfig)
    },
    
    applyChatCustomization(customization) {
      const root = document.documentElement
      const cssVariableMap = {
        primaryColor: '--chat--color-primary',
        secondaryColor: '--chat--color-secondary',
        backgroundColor: '--chat--color-light',
        textColor: '--chat--color-dark',
        windowWidth: '--chat--window--width',
        windowHeight: '--chat--window--height',
        borderRadius: '--chat--border-radius',
        fontSize: '--chat--message--font-size',
        headerBackground: '--chat--header--background',
        headerColor: '--chat--header--color',
        toggleSize: '--chat--toggle--size'
      }
      
      Object.entries(customization).forEach(([key, value]) => {
        if (cssVariableMap[key]) {
          root.style.setProperty(cssVariableMap[key], value)
        }
      })
    },
    
    retryInitialization() {
      this.retryCount = 0
      this.initializeChat()
    },
    
    cleanup() {
      if (this.chatInstance && typeof this.chatInstance.destroy === 'function') {
        try {
          this.chatInstance.destroy()
        } catch (error) {
          console.warn('Error destroying chat instance:', error)
        }
      }
    }
  },
  
  watch: {
    customization: {
      handler(newCustomization) {
        if (newCustomization && Object.keys(newCustomization).length > 0) {
          this.applyChatCustomization(newCustomization)
        }
      },
      deep: true
    },
    
    webhookUrl() {
      // Reinitialize chat if webhook URL changes
      this.cleanup()
      this.initializeChat()
    }
  }
}
</script>

<style scoped>

</style>
<template>
    <div class="chatbot-widget">
      <div class="chat-header" @click="toggleChat">
        💬 Chat with Niagaku Bot
      </div>
  
      <div v-if="open" class="chat-body">
        <div class="chat-messages">
          <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
            <strong>{{ msg.role === 'user' ? 'You' : 'Bot' }}:</strong> {{ msg.text }}
          </div>
        </div>
  
        <div class="chat-input">
          <input
            v-model="input"
            @keyup.enter="sendMessage"
            placeholder="Type your question..."
          />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ChatbotAiApi from '../../lib/chatbotAiApi'; // adjust path as needed
  const chatbotApi = new ChatbotAiApi();
  
  export default {
    name: 'ChatbotWidget',
    data() {
      return {
        open: false,
        input: '',
        messages: []
      };
    },
    methods: {
      toggleChat() {
        this.open = !this.open;
      },
      async sendMessage() {
        if (!this.input) return;
  
        const userMessage = this.input;
        this.messages.push({ role: 'user', text: userMessage });
        this.input = '';
  
        try {
        //   const user = JSON.parse(window.localStorage.getItem('user'));

          const user = auth.getLocalUser(); // or response.user if wrapped
          console.log('User:', user); // Debugging line
          const businessId = user.profile.defaultBusinessId;
          const profileId = user.profileId;

        //   const businessId = user?.businessId || 'default';
        //   const profileId = user?.profileId || 'default';
  
          const res = await chatbotApi.ask(userMessage, businessId, profileId);
          this.messages.push({ role: 'bot', text: res.answer || 'No answer returned.' });
        } catch (err) {
          console.error(err);
          this.messages.push({
            role: 'bot',
            text: 'Error: Unable to get response from chatbot.'
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .chatbot-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    font-family: sans-serif;
  }
  
  .chat-header {
    background-color: #0066cc;
    color: white;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
  }
  
  .chat-body {
    border: 1px solid #ccc;
    background: white;
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border-radius: 0 0 10px 10px;
  }
  
  .chat-messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
  
  .user {
    text-align: right;
    margin: 5px 0;
  }
  
  .bot {
    text-align: left;
    margin: 5px 0;
  }
  
  .chat-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  
  .chat-input input {
    flex: 1;
    padding: 5px;
    margin-right: 5px;
  }
  
  .chat-input button {
    background: #0066cc;
    color: white;
    border: none;
    padding: 6px 10px;
    cursor: pointer;
  }
  </style>
  
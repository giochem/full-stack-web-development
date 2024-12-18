<template>
  <Transition name="fade">
    <div v-if="isVisible" class="notification" :class="type" role="alert">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";

const isVisible = ref(false);
const message = ref("");
const type = ref("info"); // info, success, error, warning

// Method to show notification
const show = (msg, msgType = "info", duration = 3000) => {
  message.value = msg;
  type.value = msgType;
  isVisible.value = true;

  setTimeout(() => {
    isVisible.value = false;
  }, duration);
};

// Expose methods to parent components
defineExpose({
  show
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
  min-width: 300px;
}

.info {
  background: #fde073;
  color: #000;
}

.success {
  background: #4caf50;
  color: white;
}

.error {
  background: #f44336;
  color: white;
}

.warning {
  background: #ff9800;
  color: white;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

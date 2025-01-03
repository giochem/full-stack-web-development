import { createApp } from "vue";
import Notification from "@/components/common/Notification.vue";

export const notification = {
  install: (app) => {
    // Create a notification instance
    const notificationComponent = createApp(Notification).mount(
      document.createElement("div")
    );

    // Add to DOM
    document.body.appendChild(notificationComponent.$el);

    // Add global method
    app.config.globalProperties.$notify = (
      message,
      type = "info",
      duration = 3000
    ) => {
      notificationComponent.show(message, type, duration);
    };
  }
};

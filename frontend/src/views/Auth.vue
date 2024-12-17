<template>
  <div class="auth">
    <div class="auth-container">
      <div class="auth-content">
        <!-- Left side - Brand Section -->
        <div class="brand-section">
          <div class="brand-content">
            <h1>{{ $t("Views.Auth.ShortCompanyName") }}</h1>
            <p class="brand-description">
              {{ $t("Views.Auth.NewsletterDescription") }}
            </p>
            <div class="brand-image">
              <img
                src="@/assets/images/products/apparel1.jpg"
                alt="Fashion Banner"
              />
            </div>
          </div>
        </div>

        <!-- Right side - Auth Form -->
        <div class="auth-form-container">
          <form class="auth-form" @submit.prevent>
            <h2>
              {{
                status === "login"
                  ? $t("Views.Auth.Login")
                  : $t("Views.Auth.Register")
              }}
            </h2>

            <div class="form-group">
              <label for="email">{{ $t("Views.Auth.LabelEmail") }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :placeholder="$t('Views.Auth.PlaceholderEmail')"
              />
            </div>

            <div class="form-group">
              <label for="password">{{ $t("Views.Auth.LabelPassword") }}</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="on"
                :placeholder="$t('Views.Auth.PlaceholderPassword')"
              />
            </div>

            <div v-if="status === 'register'" class="form-group">
              <label for="password2">{{
                $t("Views.Auth.LabelPassword2")
              }}</label>
              <input
                id="password2"
                v-model="form.password2"
                type="password"
                required
                autocomplete="on"
                :placeholder="$t('Views.Auth.PlaceholderPassword2')"
              />
            </div>

            <div class="form-actions">
              <button
                class="primary-btn"
                @click="status === 'login' ? login() : register()"
              >
                {{
                  status === "login"
                    ? $t("Views.Auth.Login")
                    : $t("Views.Auth.Register")
                }}
              </button>

              <div class="secondary-actions">
                <button class="text-btn" @click="toggleStatus">
                  {{
                    status === "login"
                      ? $t("Views.Auth.CreateAccount")
                      : $t("Views.Auth.HaveAccount")
                  }}
                </button>

                <button class="text-btn" @click="forgotPassword">
                  {{ $t("Views.Auth.ForgotPassword") }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const app = getCurrentInstance();
const router = useRouter();
const authStore = useAuthStore();
const status = ref("login");

const form = ref({
  email: "",
  password: "",
  password2: ""
});

async function login() {
  const { email, password } = form.value;
  const result = await authStore.login(email, password);

  if (result.success) {
    if (result.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

async function register() {
  const { email, password, password2 } = form.value;

  if (!email || !password || !password2) {
    app?.proxy.$notify("Vui lòng nhập đủ thông tin", "warning");
    return;
  }

  if (password !== password2) {
    app?.proxy.$notify("Mật khẩu nhập lại không trùng khớp", "error");
    return;
  }

  const result = await authStore.register(email, password);
  if (result.success) {
    if (result.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

function forgotPassword() {
  console.log("Coming soon: Forgot password functionality");
}

function toggleStatus() {
  status.value = status.value === "login" ? "register" : "login";
}
</script>

<style scoped>
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--light-bg-color);
}

.auth-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.brand-section {
  background: var(--secondary-color);
  padding: 4rem 2rem;
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
}

.brand-content {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.brand-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.brand-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.brand-image {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.brand-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.auth-form-container {
  padding: 2rem;
}

.auth-form {
  max-width: 400px;
  margin: 0 auto;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-dark-color);
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-dark-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(121, 74, 250, 0.1);
}

.form-actions {
  margin-top: 2rem;
}

.primary-btn {
  width: 100%;
  padding: 0.875rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
}

.secondary-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.text-btn {
  background: none;
  border: none;
  color: var(--secondary-dark-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.5rem;
}

.text-btn:hover {
  color: var(--secondary-color);
}

@media (max-width: 1024px) {
  .auth-content {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .brand-section {
    padding: 2rem;
  }

  .brand-content h1 {
    font-size: 2rem;
  }
}

@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-content {
    border-radius: 12px;
  }

  .brand-section {
    padding: 1.5rem;
  }

  .auth-form-container {
    padding: 1.5rem;
  }

  .secondary-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>

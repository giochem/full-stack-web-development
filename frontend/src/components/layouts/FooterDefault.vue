<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="company-info">
          <h3>{{ $t("Components.Layouts.FooterDefault.CompanyName") }}</h3>
          <ul class="contact-list">
            <li>
              <strong
                >{{ $t("Components.Layouts.FooterDefault.Hotline") }}:
              </strong>
              <a href="tel:0973285886">0973 285 886</a>
            </li>
            <li>
              <strong>Email: </strong>
              <a href="mailto:website.vn@gmail.com">website.vn@gmail.com</a>
            </li>
            <li>
              <strong
                >{{ $t("Components.Layouts.FooterDefault.GPKD") }}:</strong
              >
              0107756568
            </li>
          </ul>
        </div>

        <div class="newsletter">
          <div class="subscribe-form">
            <input
              type="email"
              :placeholder="
                $t('Components.Layouts.FooterDefault.EmailPlaceholder')
              "
              class="subscribe-input"
            />
            <button class="subscribe-btn">
              {{ $t("Components.Layouts.FooterDefault.Subscribe") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">
      <div class="container">
        <p>{{ $t("Components.Layouts.FooterDefault.Copyright") }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--light-bg-color-2);
  padding: 3rem 0 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.company-info {
  flex: 1;
  min-width: 280px;
}

.company-info h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: var(--secondary-dark-color);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-list li {
  color: var(--secondary-dark-color);
}

.contact-list a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-list a:hover {
  color: var(--primary-color);
}

.newsletter {
  flex: 1;
  min-width: 280px;
}

.subscribe-form {
  display: flex;
  gap: 0.5rem;
}

.subscribe-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.subscribe-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.subscribe-btn {
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.subscribe-btn:hover {
  background-color: var(--secondary-color);
}

.copyright {
  margin-top: 3rem;
  padding: 1.5rem 0;
  background-color: var(--secondary-dark-color);
  color: white;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .subscribe-btn {
    width: 100%;
  }
}
</style>

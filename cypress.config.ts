import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
  },

  env: {
    test_email: "mohammed9baz@gmail.com",
    test_password: "Napil-2010",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

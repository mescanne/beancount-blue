import { mount, unmount } from "svelte";
import CashflowApp from "./cashflow/CashflowApp.svelte";

let currentApp: Record<string, any> | null = null;

export default {
  init: async function () {
    console.log("Cashflow Svelte Module initialized.");
  },

  onExtensionPageLoad: function () {
    const root = document.getElementById("cashflow-root");
    if (!root) return;

    if (currentApp) {
      unmount(currentApp);
      currentApp = null;
    }

    // Clear fallback HTML
    root.innerHTML = "";

    currentApp = mount(CashflowApp, {
      target: root,
    });
  },
};

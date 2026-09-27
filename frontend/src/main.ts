import { mount, unmount } from "svelte";
import BankSyncApp from "./BankSyncApp.svelte";

let currentApp: Record<string, any> | null = null;

export default {
  init: async function () {
    console.log("BankSync Svelte Module initialized.");
  },

  onExtensionPageLoad: function () {
    const root = document.getElementById("api-config-root");
    if (!root) return;

    if (currentApp) {
      unmount(currentApp);
      currentApp = null;
    }

    // Clear static fallback HTML inside root
    root.innerHTML = "";

    currentApp = mount(BankSyncApp, {
      target: root,
    });
  },
};

import {defineConfig} from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EchoX",
  description: "UI = f(reactive, template)",
  cleanUrls: true,
  head: [["link", {rel: "icon", type: "image/png", href: "/logo.png"}]],
  appearance: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [{icon: "github", link: "https://github.com/blinkblinkhq/echox"}],
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2024-${new Date().getUTCFullYear()} Bairui SU`,
    },
    logo: "/logo.png",
    search: {
      provider: "local",
    },
  },
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./services/styles/global.css";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { Theme } from "@astryxdesign/core/theme";
import viVN from "@astryxdesign/core/locales/vi-VN.generated.js";
import { themes, defaultThemeSlug, themeModes } from "./astryx-themes";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme theme={themes[defaultThemeSlug]} mode={themeModes[defaultThemeSlug] ?? "system"}>
      <InternationalizationProvider
        locale="vi-VN"
        messages={{ "vi-VN": viVN }}
      >
        <App />
      </InternationalizationProvider>
    </Theme>
  </StrictMode>,
);

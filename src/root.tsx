import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik/build";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" class="font-headline text-secondary-dark" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
        <script dangerouslySetInnerHTML={`
            (function() {
              function setTheme(theme) {
                document.documentElement.className = theme;
                localStorage.setItem('theme', theme);
              }
              const theme = localStorage.getItem('theme');
     
              if (theme) {
                setTheme(theme);
              } else {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  setTheme('dark');}
                  else {
                    setTheme('light');}}
            })();
          `}
        ></script>
      </head>
      <body lang="en" class="font-body text-primary">
      <RouterOutlet />
      {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});

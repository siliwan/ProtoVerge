import { component$, Slot, useContextProvider, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import "@fontsource/roboto";
import { type RequestHandler, server$ } from "@builder.io/qwik-city";
import { DarkModeToggle } from "~/components/darkModeToggle";
import { type ComAtprotoServerDescribeServer } from "@atproto/api";
import type { Health, HealthResponse } from "~/models/pds/health";
import axios from "axios";
import { useServerDescriptionStore } from "~/stores/serverDescriptionStore";
import { ServerDescriptionContext } from "~/contexts/serverDescriptionContext";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const fetchPdsServerHealth = server$(async () => {
  try {
    const res = await axios.get<HealthResponse>(
      `${import.meta.env.PUBLIC_INSTANCE_URL}/xrpc/_health`,
    );
    const health: Health =
      res.status === 200
        ? {
          isHealthy: true,
          data: res.data,
        }
        : {
          isHealthy: false,
          data: undefined,
        };
    return {
      health,
    };
  } catch (error) {
    const health: Health = {
      isHealthy: false,
      data: undefined,
    };

    return {
      health,
    };
  }
});
export function formatServerName(did?: string) {
  return did?.replace("did:web:", "");
}
export function getServerLink(
  linkType: keyof ComAtprotoServerDescribeServer.Links,
  response?: ComAtprotoServerDescribeServer.OutputSchema,
) {
  return response?.links?.[linkType]?.toString();
}
export function getServerContact(
  contactType: keyof ComAtprotoServerDescribeServer.Contact,
  response?: ComAtprotoServerDescribeServer.OutputSchema,
) {
  return response?.contact?.[contactType]?.toString();
}
export function renderHealthStatus(health?: Health) {
  if (health === undefined) {
    return <span class="text-gray-500">checking...</span>;
  }

  return health.isHealthy ? (
    <span>
      <span class="text-green-500">up</span> (running{" "}
      <span
        class="cursor-pointer font-mono text-gray-500"
        onClick$={() => copyVersionToClipboard(health.data.version)}
      >
        {health.data.version}
      </span>
      )
    </span>
  ) : (
    <span class="font-bold text-red-500">down</span>
  );
}
function copyVersionToClipboard(version: string) {
  navigator.clipboard
    .writeText(version)
    .then(() => alert("Version copied to clipboard!"));
}

export default component$(() => {
  const pdsServerHealth = useSignal<Health>();
  const { store: serverDescription, loadServerDescription } = useServerDescriptionStore();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    pdsServerHealth.value = (await fetchPdsServerHealth()).health;

    const intervalId = setInterval(async () => {
      pdsServerHealth.value = (await fetchPdsServerHealth()).health;
    }, 5000);

    return () => clearInterval(intervalId);
  });

  useTask$(() => loadServerDescription());

  useContextProvider(ServerDescriptionContext, serverDescription);

  return (
    <div class="flex flex-col min-h-screen bg-secondary-light dark:bg-secondary-dark">
      <header class="w-full flex justify-end">
        <DarkModeToggle />
      </header>
      <main class="flex flex-grow flex-col items-center justify-center w-full">
        <Slot />
      </main>
      <footer class="w-full bg-secondary-dark dark:bg-secondary-darker py-6 text-white mt-auto">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-center justify-between md:flex-row">
            <div class="items-center">
              <p class="text-sm">
                <a
                  href={import.meta.env.PUBLIC_INSTANCE_URL}
                  class="text-primary underline hover:text-highlight"
                  target="_blank"
                >
                  {formatServerName(serverDescription.data?.did) ?? "Server"}
                </a>{" "}
                is {renderHealthStatus(pdsServerHealth.value)}
              </p>
            </div>
            <div class="items-center text-center md:text-left">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                Powered by <a href={import.meta.env.PUBLIC_HOMEPAGE}
                              class="text-primary underline hover:text-highlight"
                              target="_blank">ProtoVerge</a>
              </p>
            </div>
            <div class="items-center">
              <a
                href={getServerLink("privacyPolicy", serverDescription.data) ?? "#"}
                class={`mx-2 text-sm text-gray-400 hover:text-white ${getServerLink("privacyPolicy", serverDescription.data) ? "" : "hidden"}`}
              >
                Privacy Policy
              </a>
              <a
                href={getServerLink("termsOfService", serverDescription.data) ?? "#"}
                class={`mx-2 text-sm text-gray-400 hover:text-white ${getServerLink("termsOfService", serverDescription.data) ? "" : "hidden"}`}
              >
                Terms Of Service
              </a>
              <a
                href={`mailto:${getServerContact("email", serverDescription.data)}`}
                class={`mx-2 text-sm text-gray-400 hover:text-white ${getServerContact("email", serverDescription.data) ? "" : "hidden"}`}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

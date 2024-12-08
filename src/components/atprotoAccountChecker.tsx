import {
  component$,
  useSignal,
  useTask$,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { generateRandomElementId } from "~/utils/componentIdGenerator";
import { AtpAgent } from "@atproto/api";
import { XRPCError } from "@atproto/xrpc";

// Ensure the function executes on the server
export const checkAccountAvailability = server$(
  async (handle: string): Promise<boolean> => {
    try {
      const agent = new AtpAgent({
        service: import.meta.env.PUBLIC_INSTANCE_URL,
      });

      const did = await agent.resolveHandle({
        handle,
      });

      return !did.success;
    } catch (error) {
      if (
        error instanceof XRPCError &&
        error.error === "InvalidRequest" &&
        error.message === "Unable to resolve handle"
      ) {
        return true;
      }

      console.log(error);

      return true;
    }
  },
);

export const getAvailableHandles = server$(async (): Promise<string[]> => {
  try {
    const agent = new AtpAgent({
      service: import.meta.env.PUBLIC_INSTANCE_URL,
    });
    const description = await agent.com.atproto.server.describeServer();

    if (!description.success) {
      return [];
    }

    return description.data.availableUserDomains;
  } catch (error) {
    return [];
  }
});

export const AtprotoAccountChecker = component$(() => {
  const accountCheckInputElId = useSignal<string>(
    generateRandomElementId("account-check"),
  );
  const isHandleAvailable = useSignal<boolean | null>(null); // Use `null` for an uninitialized state.
  const currentHandle = useSignal<string>("");
  const isChecking = useSignal<boolean>(false);

  const availableDomains = useSignal<string[]>([]);
  const selectedDomain = useSignal<string>("");

  const checkAvailabilityAndSet = $(async (handle: string) => {
    if (isChecking.value) return;

    isChecking.value = true;
    try {
      isHandleAvailable.value = await checkAccountAvailability(handle);
    } finally {
      isChecking.value = false;
    }
  });

  const usernames = [
    "cool_user",
    "tech_wizard",
    "qwik_fan",
    "dev_guru",
    "code_master",
    "debug_ninja",
    "frontend_hero",
    "backend_boss",
    "fullstack_pro",
    "api_king",
    "ui_queen",
    "ux_genius",
    "react_rockstar",
    "vue_veteran",
    "angular_ace",
    "node_knight",
    "typescript_titan",
    "javascript_jedi",
    "css_champion",
    "html_hustler",
  ];

  const placeholder = useSignal<string>("");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    let index = 0;
    let direction = "add";
    let charIndex = 0;

    const animatePlaceholder = () => {
      if (direction === "remove") {
        if (charIndex > 0) {
          placeholder.value = usernames[index].slice(0, charIndex - 1);
          charIndex--;
          setTimeout(animatePlaceholder, 100); // Adjust speed of animation here
          return;
        } else {
          direction = "add";
          index = (index + 1) % usernames.length;
          setTimeout(animatePlaceholder, 100); // Adjust speed of animation here
          return;
        }
      } else if (direction === "add") {
        if (charIndex < usernames[index].length) {
          placeholder.value = usernames[index].slice(0, charIndex + 1);
          charIndex++;
          setTimeout(animatePlaceholder, 100); // Adjust speed of animation here
          return;
        } else {
          direction = "remove";
          setTimeout(animatePlaceholder, 2000); // Adjust speed of animation here
          return;
        }
      }
    };

    animatePlaceholder();
  });

  useTask$(async () => {
    availableDomains.value = await getAvailableHandles();
    selectedDomain.value = availableDomains.value[0];
  });

  return (
    <div class="flex flex-col items-center p-4 bg-white dark:bg-gray-800">
      <label
        for={accountCheckInputElId.value}
        class="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300"
      >
        Is my preferred account name available?
      </label>
      <div class="relative mb-4 w-full">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
      @
    </span>
        <input
          id={accountCheckInputElId.value}
          type="text"
          placeholder={placeholder.value}
          disabled={isChecking.value}
          onInput$={(event) => {
            currentHandle.value = (event.target as HTMLInputElement).value;
            isHandleAvailable.value = null; // Reset the check result when input changes
          }}
          class="w-full px-4 py-2 pl-7 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:border-blue-500 disabled:opacity-50"
        />
        <select
          class={`absolute inset-y-0 right-0 flex items-center bg-transparent pl-1 focus:border-blue-500 ${availableDomains.value.length <= 3 ? "appearance-none pr-4" : ""}`}
          onChange$={(event) => {
            selectedDomain.value = (event.target as HTMLSelectElement).value;
            isHandleAvailable.value = null; // Reset the check result when input changes
          }}
          disabled={isChecking.value || availableDomains.value.length <= 1}
        >
          {availableDomains.value.map((handle) => (
            <option key={handle} value={handle}>
              {handle}
            </option>
          ))}
        </select>
      </div>
      <button
        class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        onClick$={() =>
          checkAvailabilityAndSet(
            `${currentHandle.value}${selectedDomain.value}`,
          )
        }
        disabled={isChecking.value || currentHandle.value.length === 0}
      >
        {isChecking.value ? "Checking..." : "Check Availability"}
      </button>
      {isHandleAvailable.value !== null && (
        <div
          class={`mt-4 w-full rounded-lg p-4 text-center ${isHandleAvailable.value ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"}`}
        >
          {isHandleAvailable.value ? (
            <p>
          <span class="cursor-pointer font-mono text-gray-500 dark:text-gray-300">
            @{currentHandle.value}
            {selectedDomain.value}
          </span>{" "}
              is available!
            </p>
          ) : (
            "Handle is not available."
          )}
        </div>
      )}
    </div>
  );
});

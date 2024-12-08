import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { AtprotoAccountChecker } from "~/components/atprotoAccountChecker";
import { InviteOnlyIndicator } from "~/components/inviteOnlyIndicator";

export default component$(() => {
  return (
    <>
        <div class="flex flex-grow flex-col items-center justify-center">
          <div class="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
            <div class="flex flex-col items-center justify-between mb-4">
              <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Welcome to {import.meta.env.PUBLIC_INSTANCE_NAME}
              </h1>
              <InviteOnlyIndicator />
            </div>
            <AtprotoAccountChecker />
          </div>
        </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "ProtoVerge",
  meta: [
    {
      name: "description",
      content: `Status site for ${import.meta.env.PUBLIC_INSTANCE_NAME}, powered by ProtoVerge.`,
    },
  ],
};

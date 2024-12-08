import { component$, useContext } from "@builder.io/qwik";
import type { ServerDescriptionData } from "~/stores/serverDescriptionStore";
import { ServerDescriptionContext } from "~/contexts/serverDescriptionContext";

export const InviteOnlyIndicator = component$(() => {
  const serverDescription = useContext<ServerDescriptionData>(ServerDescriptionContext);

  //useTask$(() => loadServerDescription());
  return (
    <>
      {serverDescription.data?.inviteCodeRequired === true ? (
        <span class="text-red-500">Invite Only</span>
      ) : serverDescription.data?.inviteCodeRequired === false ? (
        <span class="text-green-500">Open</span>
      ) : (
        <span class="text-gray-500">Unknown</span>
      )}
    </>
  )
});
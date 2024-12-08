import { $,  useStore } from "@builder.io/qwik";
import type { ComAtprotoServerDescribeServer } from "@atproto/api";
import { AtpAgent } from "@atproto/api";

export interface ServerDescriptionData{
  data: ComAtprotoServerDescribeServer.OutputSchema | undefined;
  errorMessage: string | undefined;
  error: object | undefined;
}

export const useServerDescriptionStore = () => {
  const store = useStore<ServerDescriptionData>({
    data: undefined,
    errorMessage: undefined,
    error: undefined,
  });

  const loadServerDescription = $(async () => {
    try {
      const agent = new AtpAgent({
        service: import.meta.env.PUBLIC_INSTANCE_URL,
      });
      const description = await agent.com.atproto.server.describeServer();
      store.data = description.data;
    } catch (error) {
      store.errorMessage = "Something went wrong";
      store.error = error as object;
    }
  });

  return { store, loadServerDescription };
};
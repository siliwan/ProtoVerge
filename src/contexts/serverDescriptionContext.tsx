import {
  createContextId,
} from '@builder.io/qwik';
import type { ServerDescriptionData } from "~/stores/serverDescriptionStore";


export const ServerDescriptionContext = createContextId<ServerDescriptionData>("com.atproto.server.describeServer");
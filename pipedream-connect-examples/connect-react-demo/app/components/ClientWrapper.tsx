"use client"

import { FrontendClientProvider } from "@pipedream/connect-react"
import { createFrontendClient } from "@pipedream/sdk/browser"

import { fetchToken } from "../actions/backendClient"

import Demo from "./Demo"

import { AppStateProvider } from "@/lib/app-state"
import { useStableUuid } from "@/lib/stable-uuid"

export const ClientWrapper = () => {
  const [externalUserId] = useStableUuid()

  const client = createFrontendClient({
    environment: "development",
    tokenCallback: fetchToken,
    externalUserId,
  });

  return (
    <FrontendClientProvider client={client}>
      <AppStateProvider>
        <Demo />
      </AppStateProvider>
    </FrontendClientProvider>
  );
}

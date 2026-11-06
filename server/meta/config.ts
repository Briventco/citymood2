import "server-only";

import { readServerEnvironment } from "@/server/env";

export function readMetaConfiguration() {
  const environment = readServerEnvironment();
  return {
    appId: environment.metaAppId,
    appSecret: environment.metaAppSecret,
    redirectUri: environment.metaRedirectUri,
    tokenEncryptionKey: environment.metaTokenEncryptionKey,
    graphVersion: environment.metaGraphVersion,
    webhookVerifyToken: environment.metaWebhookVerifyToken,
  };
}

export function hasMetaConfiguration(): boolean {
  const configuration = readMetaConfiguration();
  return Object.values(configuration).every(Boolean);
}

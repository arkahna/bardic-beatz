import type { FeatureBoardClient, ServerClient } from '@featureboard/node-sdk'
import type { Logger } from 'pino'
import type { User } from 'remix-auth-spotify'

declare module '@remix-run/server-runtime' {
    export interface AppLoadContext {
        log: Logger
        requestId: string
        featuresFor(whom?: null | User): FeatureBoardClient
    }

    // This is the module that is exported from apps/portal/app/entry.server.ts
    // server.ts always accesses the latest version of this file, enabling the
    // use of the latest code, without reloading the web server
    export interface ServerEntryModule {
        /** Root logger */
        log: Logger
        getLoadContext(log: Logger, requestId: string, serverClient: ServerClient): AppLoadContext

        // TODO: is this required?
        // We export both because we will subscribe once, but we will always
        // use the latest handler implementation when handling jobs
        // If you add new jobs, you will have to restart the web server
        // subscribeUsingDefaultHandlers: typeof subscribeUsingDefaultHandlers
    }
}

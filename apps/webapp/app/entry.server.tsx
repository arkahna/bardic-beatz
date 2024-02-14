/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from 'node:stream'

import type { AppLoadContext, EntryContext } from '@remix-run/node'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import type { Logger } from 'pino'
import { ServerClient } from '@featureboard/node-sdk'
import { User } from 'remix-auth-spotify'

const ABORT_DELAY = 5_000

export function getLoadContext(log: Logger, requestId: string, serverClient: ServerClient): AppLoadContext {
    return {
        log,
        requestId,
        featuresFor: createFeaturesFor(serverClient),
    }
}

function createFeaturesFor(serverClient: ServerClient): AppLoadContext['featuresFor'] {
    return function featuresFor(whom) {
        if (whom == null) {
            return serverClient.request([])
        }
        return serverClient.request([
            `plan-${whom.product}`,
            ...(whom.explicitContent ? [] : ['preference-no-explicit']),
        ])
    }
}

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    loadContext: AppLoadContext
) {
    return isbot(request.headers.get('user-agent'))
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext)
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
            {
                onAllReady() {
                    shellRendered = true
                    const body = new PassThrough()
                    const stream = createReadableStreamFromReadable(body)

                    responseHeaders.set('Content-Type', 'text/html')

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    )

                    pipe(body)
                },
                onShellError(error: unknown) {
                    reject(error)
                },
                onError(error: unknown) {
                    responseStatusCode = 500
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error)
                    }
                },
            }
        )

        setTimeout(abort, ABORT_DELAY)
    })
}

function handleBrowserRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
            {
                onShellReady() {
                    shellRendered = true
                    const body = new PassThrough()
                    const stream = createReadableStreamFromReadable(body)

                    responseHeaders.set('Content-Type', 'text/html')

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    )

                    pipe(body)
                },
                onShellError(error: unknown) {
                    reject(error)
                },
                onError(error: unknown) {
                    responseStatusCode = 500
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error)
                    }
                },
            }
        )

        setTimeout(abort, ABORT_DELAY)
    })
}

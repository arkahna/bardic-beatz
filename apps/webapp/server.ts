/* eslint-disable @typescript-eslint/no-base-to-string */
import type { RequestHandler } from '@remix-run/express'
import { createRequestHandler } from '@remix-run/express'
import type { ServerBuild } from '@remix-run/node'
import { broadcastDevReady, installGlobals } from '@remix-run/node'
import closeWithGrace from 'close-with-grace'
import compression from 'compression'
import express from 'express'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import pinoHttp from 'pino-http'
import sourceMapSupport from 'source-map-support'
import { REGISTER_LOCAL_DEV_PROXY_APIKEY } from './app/lib/config.server'
import { logger as log } from './log.server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    log.error({ reason, p }, 'Unhandled Rejection')
})
process.on('uncaughtException', (err: Error) => {
    log.error({ err }, `Caught exception`)
})

log.info({ mode: process.env.NODE_ENV }, 'Starting server...')

const port = process.env.PORT || 3000

sourceMapSupport.install()
installGlobals()

const BUILD_DIR =
    process.env.NODE_ENV === 'production' && !process.env.E2E ? process.cwd() : path.join(process.cwd(), 'build')
const VERSION_PATH = path.resolve('./version.txt')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const initialBuild: ServerBuild = require(BUILD_DIR)

/*******
 * Perform once of initialisations which run inside the server, these do not get reloaded as server code changes
 ******/

// Subscribe to jobs
// initialBuild.entry.module.subscribeUsingDefaultHandlers(initialBuild.entry.module.getLoadContext(log, 'init'), () => {
//     const latestBuild = reimportServer()
//     return Promise.resolve(latestBuild.entry.module.jobHandlers)
// })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    log.error({ reason, p }, 'Unhandled Rejection')
})
process.on('uncaughtException', (err: Error) => {
    log.error({ err }, `Caught exception`)
})

log.info({ mode: process.env.NODE_ENV }, 'Starting server...')

const httpLogger = pinoHttp({
    logger: log,
    level: process.env.LOG_LEVEL || 'debug',
    genReqId: function (req, res) {
        if (req.id) {
            res.setHeader('X-Request-Id', req.id.toString())
            return req.id.toString()
        }
        const requestIdHeader = req.headers['x-request-id']
        if (requestIdHeader) {
            req.id = requestIdHeader
            res.setHeader('X-Request-Id', requestIdHeader)
            return requestIdHeader
        }

        const id = randomUUID()
        res.setHeader('X-Request-Id', id)
        req.id = id
        return id
    },
})

const app = express()

app.use((req, res, next) => {
    // helpful headers:
    if (process.env.AZURE_REGION) {
        res.set('x-azure-region', process.env.AZURE_REGION)
    }
    res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`)

    // /clean-urls/ -> /clean-urls
    if (req.path.endsWith('/') && req.path.length > 1) {
        const query = req.url.slice(req.path.length)
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
        res.redirect(301, safepath + query)
        return
    }
    next()
})

    .use(compression())
    // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
    .disable('x-powered-by')

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static('public/build', {
        immutable: true,
        maxAge: '1y',
    }),
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(httpLogger).all('*', createRemixRequestHandler())

const server = app.listen(port, () => {
    console.log(`✅ Ready: http://localhost:${port}`)

    // Register proxy for local dev
    if (process.env.NODE_ENV === 'development') {
        if (!process.env.REGISTER_LOCAL_DEV_PROXY_APIKEY) {
            throw new Error('Missing REGISTER_LOCAL_DEV_PROXY_APIKEY')
        }

        void (async () => {
            try {
                log.info('Registering local dev proxy')
                // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/consistent-type-imports
                const localtunnel = require('localtunnel') as typeof import('localtunnel')

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                const tunnel = await localtunnel({ port: 3000 })
                log.info(`Tunnel created: ${tunnel.url}, registering with dev`)
                const registerProxyUrl = 'https://marketplace.elements.dev.arkahna.cloud/api/local-dev/register-proxy'
                // The below URL can be used for testing, you can start the dev server
                // then update the offer in Partner Center to point at the local tunnel URL
                // This will register with itself
                // const registerProxyUrl = 'http://localhost:3000/api/local-dev/register-proxy'
                await fetch(registerProxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        'x-api-key': REGISTER_LOCAL_DEV_PROXY_APIKEY!,
                    },
                    body: JSON.stringify({
                        url: tunnel.url,
                    }),
                })
            } catch (err) {
                log.error({ err }, 'Failed to register local dev proxy')
            }
        })()

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        broadcastDevReady(initialBuild).catch((err) => log.error({ err }, 'Failed to broadcast dev ready'))
    }
})

function createRemixRequestHandler(): RequestHandler {
    if (process.env.NODE_ENV === 'development') {
        return createDevRequestHandler(initialBuild)
    }

    return createRequestHandler({
        build: initialBuild,
        mode: initialBuild.mode,
        getLoadContext: (req) => {
            return initialBuild.entry.module.getLoadContext(req.log, req.id.toString())
        },
    })
}

closeWithGrace(async () => {
    await new Promise((resolve, reject) => {
        server.close((e) => (e ? reject(e) : resolve('Closed gracefully')))
    })
})

function reimportServer(): ServerBuild {
    if (process.env.NODE_ENV === 'production') {
        return initialBuild
    }
    purgeRequireCache()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
    const serverBuild: ServerBuild = require(BUILD_DIR)

    return serverBuild
}

function createDevRequestHandler(initialBuild: ServerBuild): RequestHandler {
    let build = initialBuild
    async function handleServerUpdate() {
        // 1. re-import the server build
        build = reimportServer()
        // 2. tell Remix that this app server is now up-to-date and ready
        await broadcastDevReady(build)
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/consistent-type-imports
    const chokidar = require('chokidar') as typeof import('chokidar')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-misused-promises
    chokidar.watch(VERSION_PATH, { ignoreInitial: true }).on('add', handleServerUpdate).on('change', handleServerUpdate)

    // wrap request handler to make sure its recreated with the latest build for every request
    return async (req, res, next) => {
        try {
            return createRequestHandler({
                build,
                mode: 'development',
                getLoadContext: (req) => {
                    return initialBuild.entry.module.getLoadContext(req.log, req.id.toString())
                },
            })(req, res, next)
        } catch (err) {
            log.error({ err }, 'Error handling request')
            next(err)
        }
    }
}

function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, we prefer the DX of this though, so we've included it
    // for you by default
    for (const key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete require.cache[key]
        }
    }
}

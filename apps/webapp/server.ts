import { createRequestHandler } from '@remix-run/express'
import type { AppLoadContext, ServerBuild } from '@remix-run/node'
import { installGlobals } from '@remix-run/node'
import closeWithGrace from 'close-with-grace'
import compression from 'compression'
import express from 'express'
import { randomUUID } from 'node:crypto'
import pinoHttp from 'pino-http'
import sourceMapSupport from 'source-map-support'
import { log } from './app/log.server'
import type { ServerClient } from '@featureboard/node-sdk'
import { createServerClient } from '@featureboard/node-sdk'
import { FEATUREBOARD_ENVIRONMENT_APIKEY } from './app/lib/config.server'
import type { User } from 'remix-auth-spotify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    log.error({ reason, p }, 'Unhandled Rejection')
})
process.on('uncaughtException', (err: Error) => {
    log.error({ err }, `Caught exception`)
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (err: unknown, p: Promise<any>) => {
    log.error({ err, p }, 'Unhandled Rejection')
})

log.info({ mode: process.env.NODE_ENV }, 'Starting server...')
const port = process.env.PORT || 3000

sourceMapSupport.install()
installGlobals()

void (async () => {
    const viteDevServer =
        process.env.NODE_ENV === 'production'
            ? undefined
            : await import('vite').then((vite) =>
                  vite.createServer({
                      server: { middlewareMode: true },
                  })
              )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resolveBuild: ServerBuild | (() => Promise<ServerBuild>) = viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : // @ts-expect-error - this will not exist at build time
          // eslint-disable-next-line import/no-unresolved
          await import('./server/index.js')

    const initialBuild = typeof resolveBuild === 'function' ? await resolveBuild() : resolveBuild
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

    const serverClient = createServerClient({
        environmentApiKey: FEATUREBOARD_ENVIRONMENT_APIKEY,
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
    if (viteDevServer) {
        app.use(viteDevServer.middlewares)
    } else {
        app.use(
            '/assets',
            express.static('client/assets', {
                immutable: true,
                maxAge: '1y',
            })
        )
    }
    app.use(express.static('client', { maxAge: '1h' }))

    app.use(httpLogger).all(
        '*',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        createRequestHandler({
            build: resolveBuild,
            mode: initialBuild.mode,

            getLoadContext: (req) => {
                return initialBuild.entry.module.getLoadContext(req.log, req.id.toString(), serverClient)
            },
        })
    )

    const server = app.listen(port, () => {
        console.log(`✅ Ready: http://localhost:${port}`)
    })

    closeWithGrace(async () => {
        await new Promise((resolve, reject) => {
            server.close((e) => (e ? reject(e) : resolve('Closed gracefully')))
        })
    })
})()

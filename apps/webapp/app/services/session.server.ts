import { createCookieSessionStorage } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '_session', // use any name you want here
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: ['s3cr3t'], // replace this with an actual secret from env variable
        secure: process.env.NODE_ENV === 'production', // enable this in prod only
    },
})

export const { getSession, commitSession, destroySession } = sessionStorage

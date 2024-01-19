import pino from 'pino'
import pretty from 'pino-pretty'

export const logger =
    process.env.NODE_ENV === 'test'
        ? pino(
              pretty({
                  sync: true,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  minimumLevel:
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (process.env.LOG_LEVEL as any) || (process.env.VERBOSE ? 'trace' : 'error'),
              })
          )
        : pino({
              level: process.env.LOG_LEVEL || 'debug',
              redact: {
                  paths: [
                      'partnerPublisher.clientSecretEncrypted',
                      'subscription.purchaserEmail',
                      'subscription.purchaserFirstName',
                      'subscription.purchaserLastName',
                      'subscription.notificationEmail',
                      'email',
                      'password',
                      'req.headers.cookie',
                  ],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                //   censor(value: any, path: string[]) {
                //     // TODO: this is for session storage, do we need it at all?
                //       if (path[0] === 'req' && path[1] === 'headers' && path[2] === 'cookie') {
                //           // eslint-disable-next-line
                //           return value.replace(/(portal_session=)([^;]+)/, '$1[REDACTED]')
                //       }
                //       if (path[0] === 'res' && path[1] === 'headers' && path[2] === 'set-cookie') {
                //           // eslint-disable-next-line
                //           return value.replace(/(portal_session=)([^;]+)/, '$1[REDACTED]')
                //       }

                //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                //       return value
                //   },
              },
          })

import { z } from 'zod'

// TODO: remove these
export const storeAccountConnectionInfo = z
    .union([
        z.object({
            STORAGE_URI: z.string().refine((arg) => arg || undefined),
            type: z.literal('storage-uri').default('storage-uri'),
        }),
        z.object({
            STORAGE_CONNECTION_STRING: z.string().refine((arg) => arg || undefined),
            type: z.literal('connection-string').default('connection-string'),
        }),
    ])
    .parse(process.env)

export const tableStoreAccountConnectionInfo = z
    .union([
        z.object({
            TABLE_STORAGE_URI: z.string().refine((arg) => arg || undefined),
            type: z.literal('table-storage-uri').default('table-storage-uri'),
        }),
        z.object({
            TABLE_STORAGE_CONNECTION_STRING: z.string().refine((arg) => arg || undefined),
            type: z.literal('table-connection-string').default('table-connection-string'),
        }),
    ])
    .parse(process.env)

    // TODO: trim me
export const {
    WEB_APP_AAD_CLIENT_ID,
    WEB_APP_AAD_CLIENT_SECRET,
    WEB_APP_AAD_TENANT_ID,
    ELEMENTS_PUBLIC_KEY,
    SENDGRID_API_KEY,
    SESSION_SECRET,
    STORAGE_COMPANY_LOGO_CONTAINER_NAME,
    STORAGE_COMPANY_LOGO_FOLDER_PATH,
    WEB_URL,
    KEYVAULT_NAME,
    KEYVAULT_URL,
    PUBLISHER_APP_REGISTRATIONS_SP_CLIENT_ID,
    PUBLISHER_APP_REGISTRATIONS_SP_CLIENT_SECRET,
    PUBLISHER_APP_REGISTRATIONS_SP_TENANT_ID,
    ENVIRONMENT_NAME,
    AUDIT_TABLE_NAME,
    FROM_EMAIL,
    REGISTER_LOCAL_DEV_PROXY_APIKEY,
    FEATUREBOARD_ENVIRONMENT_APIKEY,
    APPLICATIONINSIGHTS_CONNECTION_STRING,
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
    HONEYCOMB_API_KEY,
} = z
    .object({
        NODE_ENV: z.string().default('development'),
        ENVIRONMENT_NAME: z.string(),
        SESSION_SECRET: z.string().default('SESSION_SECRET'),
        WEB_URL: z.string(),

        // These are used by the web application for AAD authentication of the website
        WEB_APP_AAD_CLIENT_ID: z.string(),
        WEB_APP_AAD_CLIENT_SECRET: z.string(),
        WEB_APP_AAD_TENANT_ID: z.string(),

        // This service principal has permissions to create app registrations in the app registration tenant
        PUBLISHER_APP_REGISTRATIONS_SP_CLIENT_ID: z.string(),
        PUBLISHER_APP_REGISTRATIONS_SP_CLIENT_SECRET: z.string(),
        PUBLISHER_APP_REGISTRATIONS_SP_TENANT_ID: z.string().default('dfc6e43c-50cc-4bcb-83c9-182be2a8747e'),

        STORAGE_COMPANY_LOGO_CONTAINER_NAME: z.string().default('companylogos'),
        STORAGE_COMPANY_LOGO_FOLDER_PATH: z.string().default(''),
        SENDGRID_API_KEY: z.string().default('SENDGRID_API_KEY'),
        ELEMENTS_PUBLIC_KEY: z.string().optional(),
        KEYVAULT_URL: z.string().url(),
        KEYVAULT_NAME: z.string(),
        AUDIT_TABLE_NAME: z.string().default('audits'),

        FROM_EMAIL: z.string().default('Arkahna Marketplace Elements <info@arkahna.io>'),

        REGISTER_LOCAL_DEV_PROXY_APIKEY: z.string().optional(),

        FEATUREBOARD_ENVIRONMENT_APIKEY: z.string().optional(),
        APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
        OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().optional(),
        OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: z.string().optional(),
        OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: z.string().optional(),
        HONEYCOMB_API_KEY: z.string().optional(),
    })
    .parse(process.env)

export const FULL_WEB_URL = `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${WEB_URL}`

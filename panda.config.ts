import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    presets: [
        '@pandacss/preset-base',
        createPreset({
            accentColor: 'jade',
            grayColor: 'slate',
            borderRadius: 'sm',
        }),
    ],

    // Where to look for your css declarations
    include: ['./app/**/*.{js,jsx,ts,tsx}'],

    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        tokens: {
            colors: {
                primary: { value: '#1A805D' },
                secondary: { value: '#004C45' },
                accent: { value: '#D12F96' },
                background: { value: '#262D33' },
                text: { value: '#D5D7D8' },
                success: { value: '#2ED169' },
            },
            fonts: {
                body: { value: 'Barlow, Aptos, sans-serif' },
            },
            // Add more tokens as needed
        },
    },

    // The output directory for your css system
    outdir: 'styled-system',
    jsxFramework: 'react',
})

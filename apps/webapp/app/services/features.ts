import '@featureboard/js-sdk'

export interface BardicBeatzFeatures {

    /**
    * Balloons on login
    * @description 
    */
    'balloons-on-login': boolean

    /**
    * Birthday Wishes
    * @description Send users a special message or offer on their birthday.
    */
    'birthday-wishes-engagement': boolean

    /**
    * Concurrent devices
    * @description Number of devices where users can simultaneously stream or sync their music.
    */
    'concurrent-devices-limit': number

    /**
    * Curated Playlists
    * @description Access to expertly curated playlists based on moods, genres, etc.
    */
    'curated-playlists-limit': boolean

    /**
    * Explicit Content Access
    * @description Control over access to songs with explicit content.
    */
    'explicit-content-access-toggle': boolean

    /**
    * Family Sharing
    * @description Allows sharing of the subscription benefits with family members.
    */
    'family-sharing-limit': boolean

    /**
    * Has concurrent device limit
    * @description Is there concurrent devices protection enabled?
    */
    'has-concurrent-device-limit-kill': boolean

    /**
    * High-Res Audio
    * @description Enhanced audio quality for a superior listening experience.
    */
    'high-res-audio-toggle': boolean

    /**
    * Integrated Social Features
    * @description Allow users to share what they're listening to, create public playlists, and more.
    */
    'integrated-social-features-toggle': boolean

    /**
    * Offline Downloads
    * @description Can the user download songs for offline listening
    */
    'offline-downloads-limit': boolean

    /**
    * Personalized Music Recommendations
    * @description Users receive song and playlist suggestions based on their listening history and preferences.
    */
    'personalized-music-recommendations-engagement': boolean

    /**
    * Platform Usage Tips
    * @description Share tips, tricks, and tutorials to help users get the most out of the platform.
    */
    'platform-usage-tips-engagement': boolean

    /**
    * Podcast Support
    * @description Introduce podcast streaming and subscriptions.
    */
    'podcast-support-toggle': boolean

    /**
    * Progress bar style
    * @description 
    */
    'progress-bar-style': 'normal' | 'starwars' | 'vine'

    /**
    * Promotion Tools
    * @description Set of tools for creators to use to promote their music on the platform (paid ad/playlist placements on basic users playlists)
    */
    'promotion-tools-toggle': boolean

    /**
    * Serve Advertisements
    * @description Displays ads between songs or on the interface.
    */
    'serve-advertisements-kill': boolean

    /**
    * Skip songs
    * @description Can the user skip songs
    */
    'skip-songs': boolean

    /**
    * Song Lyrics Integration
    * @description Display song lyrics in sync with the music.
    */
    'song-lyrics-integration-toggle': boolean

    /**
    * Renewal Reminders
    * @description Users receive notifications or reminders as their subscription renewal date approaches.
    */
    'subscription-renewal-reminders-engagement': boolean
}

declare module '@featureboard/js-sdk' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Features extends BardicBeatzFeatures {}
}

export type BardicBeatzFeature = keyof BardicBeatzFeatures
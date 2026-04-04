import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'الزتونة | Az-Zaitouna',
        short_name: 'الزتونة',
        description: 'المنصة التعليمية الذكية للطلاب. المذاكرة بذكاء مش بمجهود.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#00f2ff',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}

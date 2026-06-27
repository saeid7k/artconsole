import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import colors from './Themes/theme';

const metaAppName = typeof document !== 'undefined' ? document.querySelector('meta[name="app-name"]')?.getAttribute('content') : null;
const appName = metaAppName || import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: colors.purple[500],
    },
});

router.on('navigate', (event) => {
    if (import.meta.env.PROD && typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('config', 'G-EH7WD273HX', {
            page_path: event.detail.page.url,
        });
    }
});

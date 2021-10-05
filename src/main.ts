// register vue composition api globally
import { ViteSSG } from 'vite-ssg'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueScrollTo from 'vue-scrollto'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import log from 'loglevel'
import App from './App.vue'

// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// naive-ui
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
// your custom styles here
import './styles/main.css'
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css'
// windicss devtools support (dev only)
import 'virtual:windi-devtools'

const routes = setupLayouts(generatedRoutes)

log.setDefaultLevel('debug')

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).map(i => i.install?.(ctx))

    ctx.app.use(VueScrollTo)

    if (import.meta.env.PROD) {
      log.setLevel('error')

      Sentry.init({
        Vue: ctx.app,
        dsn: String(import.meta.env.VITE_SENTRY_DNS),
        integrations: [new Integrations.BrowserTracing({
          // routingInstrumentation: Sentry.vueRouterInstrumentation(ctx.router),
        })],
        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
      })
    }
  },
)



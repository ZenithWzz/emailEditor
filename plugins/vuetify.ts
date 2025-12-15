import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#3f51b5',
            secondary: '#00bcd4',
            accent: '#673ab7'
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [{
    'u-dark-text': 'u-text-gray-400',
    'u-dark-title': 'u-text-gray-300',
    'u-nav-link': 'u-text-gray-500 hover:u-text-black dark:u-text-gray-400 dark:hover:u-text-gray-300',
    'u-icon-btn': 'u-cursor-pointer u-select-none u-opacity-75 u-transition u-duration-200 u-ease-in-out hover:u-opacity-100 hover:u-text-teal-600',
  }],
  presets: [
    presetUno({
      prefix: 'u-',
      prefixedOnly: true,
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})

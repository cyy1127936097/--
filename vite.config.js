import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  plugins: [
    uni(),
    {
      name: 'copy-libs',
      writeBundle(options) {
        const outDir = options.dir || 'dist/dev/mp-weixin'
        const libsDir = resolve(outDir, 'libs')
        if (!existsSync(libsDir)) {
          mkdirSync(libsDir, { recursive: true })
        }
        const src = resolve(__dirname, 'src/libs/qqmap-wx-jssdk.min.js')
        const dest = resolve(libsDir, 'qqmap-wx-jssdk.min.js')
        if (existsSync(src)) {
          copyFileSync(src, dest)
        }
      }
    }
  ]
})

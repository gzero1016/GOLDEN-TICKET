import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'nojekyll',
      closeBundle() {
        writeFileSync(join(__dirname, 'dist', '.nojekyll'), '')
      }
    }
  ],
  base: '/GOLDEN-TICKET/',
})


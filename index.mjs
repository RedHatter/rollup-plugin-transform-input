import { promises as fs } from 'fs'
import { relative } from 'path'
import { createFilter } from '@rollup/pluginutils'

export default function (options = {}) {
  const {
    include,
    exclude = 'node_modules/**',
    silent = false,
    load = false,
    transform,
  } = options

  if (typeof transform != 'function')
    throw new TypeError('The transform option must be a function')

  const filter = createFilter(include, exclude)
  const cwd = process.cwd()

  async function transformSource (source, id) {
    const start = process.hrtime.bigint()
    const formatted = await transform(source, id)

    if (formatted != source) {
      await fs.writeFile(id, formatted)
      if (silent) return null

      const diff = process.hrtime.bigint() - start
      const time = (diff - (diff % 1000000n)) / 1000000n
      console.log(`${relative(cwd, id)} ${time}ms`)
    }
  }

  return {
    name: 'transform-input',
    async load (id) {
      if (!load || !filter(id)) return null

      await transformSource(await fs.readFile(id, 'utf8'), id)
      return null
    },

    async transform(source, id) {
      if (load || !filter(id)) return null

      await transformSource(source, id)
      return null
    },
  }
}

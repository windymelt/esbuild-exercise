import * as esbuild from 'esbuild'
import { scalaJsPlugin } from 'esbuild-scalajs'

const opts = {
	"scalaVersion": "3.5.2",
	"scalaProjectName": "esbuild-exercise",
	"scalaTargetFileExtension": "js",
}

await esbuild.build({
  entryPoints: ['src/main/js/main.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist.cjs',
  minify: true,
  plugins: [scalaJsPlugin(opts)],
})

import * as esbuild from 'esbuild'

import { exec } from 'child_process'
import { readFileSync } from 'fs'
import crypto from 'crypto'

const nopPlugin = {
    name: 'nop',
    setup(build) {
        build.onResolve({ filter: /NOP/ }, args => {
            console.log('onResolve', args)
            return { path: args.path, namespace: 'nop' }
        })
        build.onLoad({ filter: /NOP/, namespace: 'nop' }, args => {
            console.log('onLoad', args)
            return { contents: '{}', loader: 'json'}
        })
    },
}

const scalaJsPlugin = {
    name: 'scala-js',
    setup(build) {
        const isProd = process.env.NODE_ENV === 'production'
        const scalaVersion = '3.5.2' // TODO: configurable
        const scalaProjectName = 'esbuild-exercise' // TODO: configurable
        const scalaTargetDirSuffix = isProd ? '-opt' : '-fastopt'
        const scalaTargetFileExtension = 'js' // TODO: configurable

        let onceBuildRun = false
        let filePathSHA256DigestCache = new Map

        const runSbtBuild = async () => {
            // TODO: choose run or not
            // TODO: configure command
            if (isProd) {
                await new Promise((resolve, reject) => {
                    exec('sbtn fullLinkJS', (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                            reject(err)
                        } else {
                            console.log(stdout)
                            resolve(stdout)
                        }
                 }
                 )
            })
            } else {
                exec('sbtn fastLinkJS', (err, stdout, stderr) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(stdout)
                    }
                }
            )
            }
        }


        build.onResolve({ filter: /scala:.+/ }, async args => {
            const importModuleName = args.path.replace(/^scala:/, '')
            const scalaTargetDir = `target/scala-${scalaVersion}/${scalaProjectName}${scalaTargetDirSuffix}/`
            const targetPath = `${scalaTargetDir}/${importModuleName}.${scalaTargetFileExtension}`
            const absoluteTargetPath = args.resolveDir + '/' + targetPath

            // cache verification.
            // read file and calculate SHA256 digest.
            // if the digest is the same, return the target path.
            // if not, fire sbt and rebuild entire project.
            // scala project is rebuild efficiently by sbt.
            const fileContent = readFileSync(absoluteTargetPath)
            const digest = crypto.createHash('sha256').update(fileContent).digest('hex')
            const cachedDigest = filePathSHA256DigestCache.get(absoluteTargetPath)
            if (digest === cachedDigest) {
                console.debug(`[esbuild-scala-js-plugin] ${importModuleName} is up-to-date.`)
                return { path: absoluteTargetPath }
            } else {
                if (!onceBuildRun) {
                    onceBuildRun = true
                    await runSbtBuild()
                    filePathSHA256DigestCache.set(absoluteTargetPath, digest)
                    // TODO: save digest to cache file.
                    return { path: absoluteTargetPath }
                } else  {
                    // build is already run.is something is wrong
                    // throw new Error(`[esbuild-scala-js-plugin] inconsistent state. ${importModuleName} is not up-to-date.`)
                    return { path: absoluteTargetPath } // TODO: intervent! wait for build.
                }
            }
        })
    }
}

await esbuild.build({
  entryPoints: ['main.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist.cjs',
  minify: true,
  plugins: [scalaJsPlugin],
})

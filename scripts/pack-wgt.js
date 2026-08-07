/**
 * 将 dist/build/app 内容打成 wgt（不包含 app 目录本身）
 * 用法：node scripts/pack-wgt.js
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const manifestPath = path.join(root, 'src', 'manifest.json')
const appDir = path.join(root, 'dist', 'build', 'app')
const outDir = path.join(root, 'unpackage', 'release')

function readAppId() {
  const raw = fs.readFileSync(manifestPath, 'utf8')
  // manifest.json 含注释，先去掉再解析
  const json = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  const manifest = JSON.parse(json)
  if (!manifest.appid) {
    throw new Error('manifest.json 中未找到 appid')
  }
  return manifest.appid
}

function packWithPowershell(sourceDir, wgtPath) {
  const zipPath = wgtPath.replace(/\.wgt$/i, '.zip')
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
  if (fs.existsSync(wgtPath)) fs.unlinkSync(wgtPath)

  const ps = `
    $ErrorActionPreference = 'Stop'
    $src = '${sourceDir.replace(/'/g, "''")}'
    $zip = '${zipPath.replace(/'/g, "''")}'
    if (Test-Path $zip) { Remove-Item $zip -Force }
    Compress-Archive -Path (Join-Path $src '*') -DestinationPath $zip -Force
  `
  execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], {
    stdio: 'inherit',
  })
  fs.renameSync(zipPath, wgtPath)
}

function main() {
  if (!fs.existsSync(appDir)) {
    console.error(`未找到编译产物：${appDir}`)
    console.error('请先执行：npm run build:app')
    process.exit(1)
  }

  const appid = readAppId()
  fs.mkdirSync(outDir, { recursive: true })
  const wgtPath = path.join(outDir, `${appid}.wgt`)

  console.log(`appid: ${appid}`)
  console.log(`source: ${appDir}`)
  console.log(`output: ${wgtPath}`)

  packWithPowershell(appDir, wgtPath)

  const size = fs.statSync(wgtPath).size
  console.log(`wgt 打包完成：${wgtPath} (${(size / 1024).toFixed(1)} KB)`)
}

main()

import { ExtensionContext, commands, window, ViewColumn, Uri } from 'vscode'
import { resolve } from 'path'
import { readFile } from 'fs'
import type { } from 'vscode'

async function GetWebviewContent(context: ExtensionContext): Promise<string> {
    const publicPath = resolve(context.extensionPath, 'public')
    const htmlPath = resolve(publicPath, 'index.html')
    const htmlContent = await new Promise<string>((resolve, reject) => readFile(htmlPath, 'utf-8', (err, data) => {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    }))
    return htmlContent.replace(/(<script.+?src=")(.+?)"/, (match, $1, $2) => {
        return `${$1}${Uri.file(resolve(publicPath, $2)).with({ scheme: 'vscode-resource' })}"`
    })
}

export function activate(context: ExtensionContext): void {
    context.subscriptions.push(commands.registerCommand('vscodeQRCode.preview', async () => {
        const panel = window.createWebviewPanel(
            'QRCodePreview',
            'WebView演示',
            ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [Uri.file(resolve(context.extensionPath, 'public'))]
            }
        )
        const html = await GetWebviewContent(context)
        panel.webview.html = html
    }))
}
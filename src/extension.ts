import { commands, window, ViewColumn, Uri } from 'vscode'
import { resolve } from 'path'
import { readFile } from 'fs'
import type { ExtensionContext, WebviewPanel } from 'vscode'

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
    let panel: WebviewPanel | null = null
    context.subscriptions.push(commands.registerCommand('vscodeQRCode.preview', async () => {
        if (panel) {
            panel.reveal(ViewColumn.Beside)
        } else {
            panel = window.createWebviewPanel(
                'QRCodePreview',
                '预览二维码',
                ViewColumn.Beside,
                {
                    enableScripts: true,
                    localResourceRoots: [Uri.file(resolve(context.extensionPath, 'public'))]
                }
            )
            const html = await GetWebviewContent(context)
            panel.webview.html = html
            panel.onDidDispose(() => {
                panel = null
            })
        }
        if (window.activeTextEditor) {
            const selection = window.activeTextEditor.selection
            if (!selection.isEmpty) {
                const document = window.activeTextEditor.document
                const text = document.getText(selection)
                panel.webview.postMessage({ type: 'update', data: text })
            }
        }
    }))
}
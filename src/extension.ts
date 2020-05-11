import { commands, window, ViewColumn, Uri, workspace } from 'vscode'
import { resolve } from 'path'
import { readFile } from 'fs'
import { toFile } from 'qrcode'
import type { ExtensionContext, WebviewPanel, Disposable, WorkspaceConfiguration } from 'vscode'
import type { InMessageMap, InMessageCB, OutMessage, Configuration } from './index'

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
    return htmlContent.replace(/(<script.+?src="|<link.+?href=")(.+?)"/g, (match, $1, $2) => {
        return `${$1}${Uri.file(resolve(publicPath, $2)).with({ scheme: 'vscode-resource' })}"`
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GetWithCallback(section: string, callback: (value: any) => boolean, obj: any): boolean {
    const path = section.split('.')
    let property = path.shift()
    while (property) {
        obj = obj[property as keyof typeof obj]
        property = path.shift()
    }
    return callback(obj)
}

export function activate(context: ExtensionContext): void {
    let panel: WebviewPanel | null = null
    let webviewContent: string | undefined
    let webviewContentPromise: Promise<string> | null = GetWebviewContent(context)
    webviewContentPromise.then((v) => {
        webviewContent = v
        webviewContentPromise = null
    })
    const configuration: Configuration = {
        margin: 4,
        color: {
            dark: '#000000FF',
            light: '#FFFFFFFF'
        }
    }
    const colorRex = /^#[0-9A-Fa-f]{8}$/
    const callbacks = [
        GetWithCallback.bind(null, 'margin', (value: number) => {
            if (value < 0) {
                return true
            }
            if (value === configuration.margin) {
                return true
            } else {
                configuration.margin = value
                return false
            }
        }),
        GetWithCallback.bind(null, 'width', (value: number | null | undefined) => {
            if (typeof value === 'number' && value <= 0) {
                return true
            }
            value = value === null ? undefined : value
            if (value === configuration.width) {
                return true
            } else {
                configuration.width = value
                return false
            }
        }),
        GetWithCallback.bind(null, 'color.dark', (value: string) => {
            if (!colorRex.test(value)) {
                return true
            }
            if (value === configuration.color.dark) {
                return true
            } else {
                configuration.color.dark
                return false
            }
        }),
        GetWithCallback.bind(null, 'color.light', (value: string) => {
            if (!colorRex.test(value)) {
                return true
            }
            if (value === configuration.color.light) {
                return true
            } else {
                configuration.color.light = value
                return false
            }
        })
    ]
    const onSave = async (text: string): Promise<void> => {
        const defaultUri = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri : undefined
        const uri = await window.showSaveDialog({ defaultUri, filters: { png: ['png',], svg: ['svg'] }, })
        if (uri) {
            toFile(uri.fsPath, text, configuration, (err) => {
                if (err) {
                    window.showErrorMessage(err.message)
                }
            })

        }
    }
    const validate = (configuration: WorkspaceConfiguration): boolean => {
        let flag = true
        for (let i = 0; i < callbacks.length; i++) {
            flag = callbacks[i](configuration) && flag
        }
        return flag
    }
    validate(workspace.getConfiguration('asurance.vscodeQRCode'))
    const inMessageCBMap: { [T in keyof InMessageMap]: InMessageCB<T> } = {
        Save: onSave
    }
    context.subscriptions.push(commands.registerCommand('asurance.vscodeQRCode', async () => {
        if (panel) {
            panel.reveal(ViewColumn.Beside)
        } else {
            let panelVisible = false
            panel = window.createWebviewPanel(
                'QRCode',
                '二维码',
                ViewColumn.Beside,
                {
                    enableScripts: true,
                    localResourceRoots: [Uri.file(resolve(context.extensionPath, 'public'))]
                }
            )
            const html = webviewContentPromise === null ? webviewContent! : await webviewContentPromise
            panel.webview.html = html
            const dispose: Disposable[] = []
            dispose.push(panel.onDidDispose(() => {
                panel = null
                dispose.forEach(d => d.dispose())
            }))
            dispose.push(panel.webview.onDidReceiveMessage(async (message) => {
                if (message.type in inMessageCBMap) {
                    inMessageCBMap[message.type as keyof InMessageMap](message.data)
                }
            }))
            dispose.push(
                panel.onDidChangeViewState(event => {
                    if (event.webviewPanel.visible && !panelVisible) {
                        const message: OutMessage<'Config'> = {
                            type: 'Config',
                            data: configuration
                        }
                        event.webviewPanel.webview.postMessage(message)
                    }
                    panelVisible = event.webviewPanel.visible
                }))
            dispose.push(workspace.onDidChangeConfiguration(event => {
                if (event.affectsConfiguration('asurance.vscodeQRCode') && !validate(workspace.getConfiguration('asurance.vscodeQRCode'))) {
                    if (panel) {
                        const message: OutMessage<'Config'> = {
                            type: 'Config',
                            data: configuration
                        }
                        panel.webview.postMessage(message)
                    }
                }
            }))
        }
        if (window.activeTextEditor) {
            const selection = window.activeTextEditor.selection
            if (!selection.isEmpty) {
                const document = window.activeTextEditor.document
                const message: OutMessage<'Text'> = {
                    type: 'Text',
                    data: document.getText(selection)
                }
                panel.webview.postMessage(message)
            }
        }
    }))
}
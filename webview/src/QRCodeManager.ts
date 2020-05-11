import { toCanvas } from 'qrcode'

const vscode = acquireVsCodeApi()

export class QRCodeManager {
    private config: Configuration = {
        margin: 4,
        color: {
            dark: '#000000FF',
            light: '#FFFFFFFF'
        }
    }
    private text: string;
    constructor(private canvas: HTMLCanvasElement, private textArea: HTMLTextAreaElement, private saveBtn: HTMLButtonElement) {
        textArea.oninput = this.onTextAreaInput
        this.text = (vscode.getState() ?? { text: '' }).text
        this.drawQRCodeWithText(false)
        window.onmessage = this.onMessage
        saveBtn.onclick = (): void => {
            vscode.postMessage({ type: 'Save', data: this.text })
        }
    }

    private drawQRCode(): void {
        if (this.text) {
            toCanvas(this.canvas, this.text, this.config)
        } else {
            toCanvas(this.canvas, this.textArea.placeholder, this.config)
        }
        if (this.textArea.value) {
            this.saveBtn.disabled = false
        } else {
            this.saveBtn.disabled = true
        }
    }

    private onTextAreaInput = (): void => {
        vscode.setState({ text: this.textArea.value })
        this.text = this.textArea.value
        this.drawQRCode()
    }

    private drawQRCodeWithText(save = true): void {
        this.textArea.value = this.text
        save && vscode.setState({ text: this.text })
        this.drawQRCode()
    }

    private onMessage = (ev: MessageEvent): void => {
        if (ev.data.type in this.inMessageCBMap) {
            this.inMessageCBMap[ev.data.type as keyof InMessageMap](ev.data.data)
        }
    }

    private onText = (text: string): void => {
        console.log('text')
        this.text = text
    }

    private onConfig = (config: Configuration): void => {
        console.log('config')
        this.config = config
        this.drawQRCodeWithText()
    }

    private inMessageCBMap: { [T in keyof InMessageMap]: InMessageCB<T> } = {
        Text: this.onText,
        Config: this.onConfig,
    }
}
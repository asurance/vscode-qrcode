import { toCanvas } from 'qrcode'

const vscode = acquireVsCodeApi()

export class QRCodeManager {
    constructor(private canvas: HTMLCanvasElement, private textArea: HTMLTextAreaElement) {
        textArea.oninput = this.onTextAreaInput
        const state = vscode.getState() ?? { text: '' }
        this.drawQRCodeWithText(state.text, false)
        window.onmessage = this.onMessage
    }

    private drawQRCode(): void {
        if (this.textArea.value) {
            toCanvas(this.canvas, this.textArea.value)
        } else {
            toCanvas(this.canvas, this.textArea.placeholder)
        }
    }

    private onTextAreaInput = (): void => {
        vscode.setState({ text: this.textArea.value })
        this.drawQRCode()
    }

    private drawQRCodeWithText(text: string, save = true): void {
        this.textArea.value = text
        save && vscode.setState({ text })
        this.drawQRCode()
    }

    private onMessage = (ev: MessageEvent): void => {
        if (ev.data.type === 'update') {
            this.drawQRCodeWithText(ev.data.data)
        }
    }
}
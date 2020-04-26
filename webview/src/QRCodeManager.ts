import { toCanvas } from 'qrcode'

const vscode = acquireVsCodeApi()

export class QRCodeManager {
    constructor(private canvas: HTMLCanvasElement, private textArea: HTMLTextAreaElement, private saveBtn: HTMLButtonElement) {
        textArea.oninput = this.onTextAreaInput
        const state = vscode.getState() ?? { text: '' }
        this.drawQRCodeWithText(state.text, false)
        window.onmessage = this.onMessage
        saveBtn.onclick = (): void => {
            vscode.postMessage({ type: 'Save', data: this.textArea.value })
        }
    }

    private drawQRCode(): void {
        if (this.textArea.value) {
            toCanvas(this.canvas, this.textArea.value)
            this.saveBtn.disabled = false
        } else {
            toCanvas(this.canvas, this.textArea.placeholder)
            this.saveBtn.disabled = true
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
        if (ev.data.type in this.inMessageCBMap) {
            this.inMessageCBMap[ev.data.type as keyof InMessageMap](ev.data.data)
        }
    }

    private onUpdate = (text: string): void => {
        this.drawQRCodeWithText(text)
    }

    private inMessageCBMap: { [T in keyof InMessageMap]: InMessageCB<T> } = {
        Update: this.onUpdate
    }
}
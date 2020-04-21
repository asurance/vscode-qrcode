import { toCanvas } from 'qrcode'
// const container = document.getElementById('container') as HTMLDivElement
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const textInput = document.getElementById('textInput') as HTMLTextAreaElement
toCanvas(canvas, textInput.placeholder)
textInput.oninput = (): void => {
    if (textInput.value) {
        toCanvas(canvas, textInput.value)
    } else {
        toCanvas(canvas, textInput.placeholder)
    }
}
import { toCanvas } from 'qrcode'
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const textInput = document.getElementById('textInput') as HTMLTextAreaElement
const submit = document.getElementById('submit') as HTMLButtonElement
submit.onclick = (): Promise<void> => toCanvas(canvas, textInput.value) 
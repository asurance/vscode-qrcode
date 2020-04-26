import { QRCodeManager } from './QRCodeManager'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const textInput = document.getElementById('textInput') as HTMLTextAreaElement
const saveBtn = document.getElementById('save') as HTMLButtonElement
new QRCodeManager(canvas, textInput, saveBtn)
import { QRCodeManager } from './QRCodeManager'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const textInput = document.getElementById('textInput') as HTMLTextAreaElement
new QRCodeManager(canvas, textInput)
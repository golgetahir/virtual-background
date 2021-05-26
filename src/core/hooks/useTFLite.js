import { useEffect, useState } from 'react'
import {
  getTFLiteModelFileName
} from '../helpers/segmentationHelper'

//declare function createTFLiteModule(): Promise<TFLite>
//declare function createTFLiteSIMDModule(): Promise<TFLite>

/*export class TFLite extends EmscriptenModule {
  _getModelBufferMemoryOffset()
  _getInputMemoryOffset()
  _getInputHeight()
  _getInputWidth()
  _getInputChannelCount()
  _getOutputMemoryOffset()
  _getOutputHeight()
  _getOutputWidth()
  _getOutputChannelCount()
  _loadModel(bufferSize)
  _runInference()
}*/

function useTFLite(segmentationConfig) {
  const [tflite, setTFLite] = useState<TFLite>(null)
  const [tfliteSIMD, setTFLiteSIMD] = useState<TFLite>(null)
  const [selectedTFLite, setSelectedTFLite] = useState<TFLite>(null)
  const [isSIMDSupported, setSIMDSupported] = useState(false)

  useEffect(() => {
    async function loadTFLite() {
      window.createTFLiteModule().then(setTFLite)
      try {
        const createdTFLiteSIMD = await window.createTFLiteSIMDModule()
        setTFLiteSIMD(createdTFLiteSIMD)
        setSIMDSupported(true)
      } catch (error) {
        console.warn('Failed to create TFLite SIMD WebAssembly module.', error)
      }
    }

    loadTFLite()
  }, [])

  useEffect(() => {
    async function loadTFLiteModel() {
      if (
        !tflite ||
        (isSIMDSupported && !tfliteSIMD) ||
        (!isSIMDSupported && segmentationConfig.backend === 'wasmSimd') ||
        (segmentationConfig.model !== 'meet' &&
          segmentationConfig.model !== 'mlkit')
      ) {
        return
      }

      setSelectedTFLite(undefined)

      const newSelectedTFLite =
        segmentationConfig.backend === 'wasmSimd' ? tfliteSIMD : tflite

      if (!newSelectedTFLite) {
        throw new Error(
          `TFLite backend unavailable: ${segmentationConfig.backend}`
        )
      }

      const modelFileName = getTFLiteModelFileName(
        segmentationConfig.model,
        segmentationConfig.inputResolution
      )
      console.log('Loading tflite model:', modelFileName)

      const modelResponse = await fetch(
        `${process.env.PUBLIC_URL}/models/${modelFileName}.tflite`
      )
      const model = await modelResponse.arrayBuffer()
      console.log('Model buffer size:', model.byteLength)

      const modelBufferOffset = newSelectedTFLite._getModelBufferMemoryOffset()
      console.log('Model buffer memory offset:', modelBufferOffset)
      console.log('Loading model buffer...')
      newSelectedTFLite.HEAPU8.set(new Uint8Array(model), modelBufferOffset)
      console.log(
        '_loadModel result:',
        newSelectedTFLite._loadModel(model.byteLength)
      )

      console.log(
        'Input memory offset:',
        newSelectedTFLite._getInputMemoryOffset()
      )
      console.log('Input height:', newSelectedTFLite._getInputHeight())
      console.log('Input width:', newSelectedTFLite._getInputWidth())
      console.log('Input channels:', newSelectedTFLite._getInputChannelCount())

      console.log(
        'Output memory offset:',
        newSelectedTFLite._getOutputMemoryOffset()
      )
      console.log('Output height:', newSelectedTFLite._getOutputHeight())
      console.log('Output width:', newSelectedTFLite._getOutputWidth())
      console.log(
        'Output channels:',
        newSelectedTFLite._getOutputChannelCount()
      )

      setSelectedTFLite(newSelectedTFLite)
    }

    loadTFLiteModel()
  }, [
    tflite,
    tfliteSIMD,
    isSIMDSupported,
    segmentationConfig.model,
    segmentationConfig.backend,
    segmentationConfig.inputResolution,
  ])

  return { tflite: selectedTFLite, isSIMDSupported }
}

export default useTFLite

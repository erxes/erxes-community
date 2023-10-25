import React, { useEffect, useRef, useState } from "react"

type Props = {}

const Recorder = (props: Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const audioContext = new AudioContext()
  const audioChunksRef = useRef<Float32Array[]>([])
  const canvasRef = useRef<HTMLCanvasElement | any>(null)
  const analyser = audioContext.createAnalyser()

  const canvasWidth = 800 // Adjust canvas width as needed
  const canvasHeight = 100 // Adjust canvas height as needed
  const segmentWidth = 2 // Width of each waveform segment

  useEffect(() => {
    if (isRecording) {
      const microphoneStream = navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      microphoneStream.then((stream) => {
        const mediaStreamSource = audioContext.createMediaStreamSource(stream)

        mediaStreamSource.connect(analyser)
        analyser.connect(audioContext.destination)

        analyser.fftSize = 256 // You can adjust this value for better visualization
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const canvas = canvasRef.current
        const canvasContext = canvas?.getContext("2d")

        if (canvasContext) {
          canvasContext.fillStyle = "rgba(0, 0, 0, 0.2)"

          const draw = () => {
            analyser.getByteTimeDomainData(dataArray)

            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)

            canvasContext.beginPath()
            for (let i = 0; i < bufferLength; i++) {
              const x = i * segmentWidth
              const y = (dataArray[i] / 128) * (canvasHeight / 2)

              if (i === 0) {
                canvasContext.moveTo(x, y)
              } else {
                canvasContext.lineTo(x, y)
              }
            }
            canvasContext.lineTo(canvasWidth, canvasHeight / 2)
            canvasContext.stroke()

            requestAnimationFrame(draw)
          }

          draw()
        }
      })
    }
  }, [isRecording])

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </div>
  )
}
export default Recorder

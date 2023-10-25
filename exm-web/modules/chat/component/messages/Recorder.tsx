import React, { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Pause, Play } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"

function AudioRecorder() {
  const { toast } = useToast()
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const [audioUrl, setAudioUrl] = useState<any>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [onPause, setOnPause] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (recordingTime >= 60) {
      stopRecording()
    }
  }, [recordingTime])

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream)
        audioChunks.current = []

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data)
          }
        }

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob([...audioChunks.current], {
            type: "audio/mpeg",
          })
          const audioUrl = URL.createObjectURL(audioBlob)
          setAudioUrl(audioUrl)
        }

        mediaRecorder.current.start()
        setIsRecording(true)

        intervalRef.current = window.setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1)
        }, 1000)
      })
      .catch((error) => {
        return toast({
          description: `Error accessing microphone`,
        })
      })
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach((track) => {
        track.stop()
      })
      setIsRecording(false)
      setOnPause(false)
      clearInterval(intervalRef.current as number)
      setRecordingTime(0)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause()
      setOnPause(true)
      clearInterval(intervalRef.current as number)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume()
      setOnPause(false)

      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${minutes}:${remainingSeconds}`
  }

  // Implement a function to visualize audio data in real-time using Canvas

  return (
    <div className="flex gap-4">
      <div className="flex gap-4">
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button onClick={onPause ? resumeRecording : pauseRecording}>
          {onPause ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
      <div className="flex w-full items-center gap-4 p-5 rounded-lg bg-[#F5FAFF] drop-shadow-md">
        <div className="bg-blue-200 w-1/12">{formatTime(recordingTime)}</div>
        <div className="bg-red-200 w-full">
          {audioUrl && (
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudioRecorder

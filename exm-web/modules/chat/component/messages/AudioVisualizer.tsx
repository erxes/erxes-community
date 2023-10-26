import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import WaveSurfer from "wavesurfer.js"

type Props = {}

const useWavesurfer = (
  containerRef: React.RefObject<HTMLDivElement>,
  options: any
) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
      waveColor: "#4c4c4c",
      progressColor: "#4F33AF",
      cursorWidth: 0,
      barWidth: 2,
      barGap: 2,
      barRadius: 4,
      height: 23,
      url: "/sound/audio.mp3",
      dragToSeek: true,
      backend: "WebAudio",
    })

    setWavesurfer(ws)

    return () => {
      ws.destroy()
    }
  }, [options, containerRef])

  return wavesurfer
}

const AudioVisualizer = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const wavesurfer = useWavesurfer(containerRef, props)

  const onPlayToggle = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }
  }, [wavesurfer])

  const onMuteToggle = useCallback(() => {
    if (wavesurfer) {
      setIsMuted(!wavesurfer.getMuted())
      wavesurfer.setMuted(!wavesurfer.getMuted())
    }
  }, [wavesurfer])

  useEffect(() => {
    if (!wavesurfer) return

    setCurrentTime("0:00")
    setIsPlaying(false)

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("audioprocess", () =>
        setCurrentTime(formatTime(wavesurfer.getCurrentTime() as number))
      ),
      wavesurfer.on("timeupdate", (currentTime) =>
        setCurrentTime(formatTime(currentTime))
      ),
      wavesurfer.on("ready", () => {
        const duration = wavesurfer.getDuration()

        console.log(duration)
        console.log((duration / 60) * 100)

        if (containerRef.current) {
          containerRef.current.style.width = `${Math.round(duration)}px`
        }
      }),
    ]

    return () => {
      subscriptions.forEach((unsub) => unsub())
    }
  }, [wavesurfer])

  const formatTime = (time: number) => {
    return [
      Math.floor((time % 3600) / 60),
      ("00" + Math.floor(time % 60)).slice(-2),
    ].join(":")
  }

  return (
    <div className="flex gap-2 items-center">
      <button onClick={onPlayToggle} className="bg-[#4F33AF] rounded-full p-1">
        {!isPlaying ? (
          <Play
            size={16}
            fill="#fff"
            color="#fff"
            strokeWidth={3}
            className="pl-[2px]"
          />
        ) : (
          <Pause size={16} color="#fff" fill="#fff" />
        )}
      </button>

      <div ref={containerRef}></div>
      <div className="w-[27px]">{currentTime}</div>
      <button onClick={onMuteToggle}>
        {!isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  )
}

export default memo(AudioVisualizer)

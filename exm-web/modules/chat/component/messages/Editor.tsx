import React, { useEffect, useRef, useState } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Mic, MicOff, Paperclip, Pause, Play, Smile } from "lucide-react"

import { readFile } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { AttachmentWithChatPreview } from "@/components/AttachmentWithChatPreview"
import uploadHandler from "@/components/uploader/uploadHandler"

import Recorder from "./Recorder"

type IProps = {
  reply: any
  setReply: (reply: any) => void
  sendMessage: ({
    content,
    relatedId,
    attachments,
  }: {
    content?: string
    relatedId?: string
    attachments?: string[]
  }) => void
}

const Editor = ({ sendMessage, reply, setReply }: IProps) => {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<any[]>([])
  const relatedId = (reply && reply._id) || null
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const [audioUrl, setAudioUrl] = useState<any>(null)

  const [showEmoji, setShowEmoji] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [onPause, setOnPause] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const textareaRef = useRef<any>(null)
  const audioContext = new ((window as any).AudioContext ||
    (window as any).webkitAudioContext)()

  useEffect(() => {
    if (recordingTime >= 60) {
      stopRecording()
    }

    // textareaRef.current.style.height = "auto"
    // textareaRef.current.style.height = textareaRef.current?.scrollHeight + "px"
  }, [recordingTime, message])

  const handleInputChange = (e: any) => {
    setMessage(e.target.value)
  }

  const deleteImage = (index: number) => {
    const updated = [...attachments]

    updated.splice(index, 1)

    setAttachments(updated)
  }

  const handleAttachmentChange = (e: any) => {
    const files = e.target.files

    uploadHandler({
      files,
      beforeUpload: () => {
        setLoading(true)
        return
      },

      afterUpload: ({ response, fileInfo }) => {
        setLoading(false)

        setAttachments((prevAttachments) => [
          ...prevAttachments,
          Object.assign({ url: response }, fileInfo),
        ])
      },
    })
  }

  const onSubmit = () => {
    if (message) {
      sendMessage({ content: message, relatedId, attachments })
    } else {
      return toast({
        description: `Please enter message`,
      })
    }

    setAttachments([])
    setMessage("")
    setReply(null)
  }

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      onSubmit()
    }
  }

  const attachmentsSection = () => {
    return (
      <div className="pt-2 overflow-auto scrollbar-hide">
        {attachments && attachments.length > 0 && (
          <AttachmentWithChatPreview
            attachments={attachments || []}
            className="pb-2 flex w-full gap-3"
            deleteImage={deleteImage}
          />
        )}
      </div>
    )
  }

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioInput = audioContext.createMediaStreamSource(stream)

        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)

        scriptProcessor.onaudioprocess = (event: any) => {
          const inputData = event.inputBuffer.getChannelData(0)
          // Process the audio data here
          console.log(inputData)
        }

        // Connect the audio input to the script processor
        audioInput.connect(scriptProcessor)
        scriptProcessor.connect(audioContext.destination)

        setIsRecording(true)
      })
      .catch((error) => {
        return toast({
          description: `Error accessing microphone`,
        })
      })
  }

  const stopRecording = () => {
    audioContext.close()

    setIsRecording(false)
    setOnPause(false)
  }

  const pauseRecording = () => {
    setOnPause(true)
  }

  const resumeRecording = () => {
    audioContext.resume()

    setOnPause(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0")
    return `${minutes}:${remainingSeconds}`
  }

  const audioRecordSection = () => {
    return (
      <div className="flex w-full items-center gap-4 p-5 rounded-lg bg-[#F5FAFF] drop-shadow-md">
        {/* <div className="bg-blue-200 w-1/12">{formatTime(recordingTime)}</div> */}
        <div className="bg-red-200 w-full">
          {/* {
            audioUrl && (
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
            )
            // console.log("audioUrl", audioUrl)
          } */}
          <Recorder />
        </div>
      </div>
    )
  }

  const emojiHandler = (emojiData: any, event: MouseEvent) => {
    setMessage((inputValue) => inputValue + emojiData.native)
  }

  return (
    <div className="border-t-2 py-4 px-10">
      {attachments && attachments.length > 0 && attachmentsSection()}
      <div className="flex h-[200px] w-[400px]">{audioRecordSection()}</div>
      <div className="flex items-center justify-around gap-7 ">
        <div className="flex gap-4">
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {isRecording ? (
            <button onClick={onPause ? resumeRecording : pauseRecording}>
              {onPause ? <Play size={16} /> : <Pause size={16} />}
            </button>
          ) : (
            <label className="cursor-pointer">
              <input
                autoComplete="off"
                type="file"
                multiple={true}
                onChange={handleAttachmentChange}
                className="hidden"
              />
              <Paperclip size={16} />
            </label>
          )}
        </div>
        {isRecording ? (
          audioRecordSection()
        ) : (
          <div className="relative flex flex-1 items-center gap-4 p-5 rounded-lg bg-[#F5FAFF] drop-shadow-md">
            <textarea
              value={message}
              onChange={handleInputChange}
              onKeyDown={onEnterPress}
              autoComplete="off"
              ref={textareaRef}
              className="outline-none w-full h-auto bg-transparent resize-none scrollbar-hide"
              placeholder="Type your message"
              rows={1}
            />
            {showEmoji && (
              <div className="absolute bottom-16 right-0 z-10">
                <Picker
                  data={data}
                  onEmojiSelect={emojiHandler}
                  previewPosition="none"
                  searchPosition="none"
                  theme="light"
                />
              </div>
            )}
            <button onClick={() => setShowEmoji(!showEmoji)}>
              <Smile size={16} />
            </button>
          </div>
        )}

        <button
          type="submit"
          className="rounded-md bg-[#4F33AF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5532c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onSubmit}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Editor

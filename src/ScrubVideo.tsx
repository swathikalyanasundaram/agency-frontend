import { useEffect, useRef } from 'react'

const SENSITIVITY = 0.8
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4'

export default function ScrubVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const seekTo = (time: number) => {
      targetTimeRef.current = time
      if (!seekingRef.current) {
        seekingRef.current = true
        video.currentTime = time
      }
    }

    const handleSeeked = () => {
      if (video.currentTime !== targetTimeRef.current) {
        video.currentTime = targetTimeRef.current
      } else {
        seekingRef.current = false
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return

      const currentX = e.clientX
      if (prevXRef.current === null) {
        prevXRef.current = currentX
        return
      }

      const delta = currentX - prevXRef.current
      prevXRef.current = currentX

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      const base = seekingRef.current ? targetTimeRef.current : video.currentTime
      const nextTime = Math.min(Math.max(base + offset, 0), video.duration)

      seekTo(nextTime)
    }

    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: '70% center' }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  )
}

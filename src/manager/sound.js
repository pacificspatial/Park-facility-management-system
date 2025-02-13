import {useCallback, useEffect, useRef, useState} from "react";
import {setSocketKeepAlive} from "stream-http/lib/request";


export const SoundStatus = {
    None: "none",
    Prepared: "prepared",
    Paused: "paused",
    Play: "play",
    Loading: "loading",
    Error: "error",
}

const useSoundManager = ({path, url}) => {

    const [status, setStatus] = useState(SoundStatus.None)
    const audioRef = useRef()

    useEffect(() => {
        if (!path && !url) { return }

        let _url = url ?? `${process.env.REACT_APP_MEDIA_ENDPOINT}${path}`

        audioRef.current = new Audio(_url)
        setStatus(SoundStatus.Loading)

        audioRef.current.addEventListener("play", () => {
            setStatus(SoundStatus.Play)
        })
        audioRef.current.addEventListener("ended", () => {
            setStatus(SoundStatus.Prepared)
        })
        audioRef.current.addEventListener("canplaythrough", () => {
            setStatus(SoundStatus.Prepared)
        })
        audioRef.current.addEventListener("stalled", () => {
            setStatus(SoundStatus.Error)
        })

    }, [path])

    const play = useCallback(() => {
        if (!audioRef.current || (status !== SoundStatus.Prepared && status !== SoundStatus.Paused)) { return }
        audioRef.current.play()
    }, [status])

    const pause = useCallback(() => {
        if (!audioRef.current || status !== SoundStatus.Play) { return }
        audioRef.current.pause()
        setStatus(SoundStatus.Paused)
    }, [status])

    const stop = useCallback(() => {
        if (!audioRef.current || (status !== SoundStatus.Play || status !== SoundStatus.Paused)) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setStatus(SoundStatus.Prepared)
        }
    }, [status])

    return {
        status,
        play,
        pause,
        stop,
    }

}

export default useSoundManager

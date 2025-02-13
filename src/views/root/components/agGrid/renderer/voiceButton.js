import PropTypes from "prop-types";
import _ from "lodash";
import IconButton from "@mui/material/IconButton";
import {useEffect, useRef, useState} from "react";
import {Error as ErrorIcon, PlayArrow as PlayArrowIcon, Stop as StopIcon} from "@mui/icons-material";
import {BeatLoader} from "react-spinners";
import {rendererStyles} from "./index";

export const PlayStatus = {
    Stop: "stop",
    Prepared: "prepared",
    Play: "play",
    Loading: "loading",
    Error: "error",
}

const styles = {
    ...rendererStyles
}


const VoiceButtonRenderer = ({onClick, autoPlay, value}) => {

    const [status, setStatus] = useState(PlayStatus.Loading)
    const audioRef = useRef()

    useEffect(() => {
        if (!value) { return }
//        console.log("[VoiceButton]", "loaded", value)

        audioRef.current = new Audio(`${process.env.REACT_APP_MEDIA_ENDPOINT}${value}`)

        audioRef.current.addEventListener("ended", () => {
            console.log("[Audio]", "ended", value)
            setStatus(PlayStatus.Prepared)
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        })
        audioRef.current.addEventListener("play", () => {
            console.log("[Audio]", "play", value)
            setStatus(PlayStatus.Play)
        })
        audioRef.current.addEventListener("canplay", () => {
//            console.log("[Audio]", "canplay", value)
            setStatus(PlayStatus.Prepared)
        })
        audioRef.current.addEventListener("canplaythrough", () => {
//            console.log("[Audio]", "canplaythrough", value)
            setStatus(PlayStatus.Prepared)
        })
        audioRef.current.addEventListener("pause", () => {
//            console.log("[Audio]", "pause", value)
            setStatus(PlayStatus.Prepared)
            audioRef.current.currentTime = 0
        })
        audioRef.current.addEventListener("stalled", () => {
//            console.log("[Audio]", "stalled", value)
            setStatus(PlayStatus.Error)
        })
    }, [value])


    const onPlay = () => {
        if (!onClick || _.isNil(autoPlay) || autoPlay) {
            audioRef.current.play()
        } else {
            onClick(value)
        }
    }

    return _.isEmpty(value) ? null : (
        <>
            {status === PlayStatus.Prepared && (
                <IconButton size="small" onClick={onPlay} style={styles.iconButton}>
                    <PlayArrowIcon style={styles.icon} />
                </IconButton>
            )}
            {status === PlayStatus.Play && (
                <IconButton size="small" onClick={() => audioRef.current.pause()} style={styles.iconButton}>
                    <StopIcon style={styles.icon} />
                </IconButton>
            )}
            {status === PlayStatus.Error && (
                <ErrorIcon style={styles.icon} />
            )}
            {status === PlayStatus.Loading && (
                <BeatLoader size={7} color={"#49eaea"}/>
            )}
        </>
    )

}

VoiceButtonRenderer.propTypes = {
    onClick: PropTypes.func,
    autoPlay: PropTypes.bool,
    value: PropTypes.string,
}

export default VoiceButtonRenderer

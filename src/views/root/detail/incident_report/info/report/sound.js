import React from "react"
import PropTypes from "prop-types";
//import useSoundManager, {SoundStatus} from "../../../../manager/sound";
import useSoundManager, { SoundStatus } from "../../../../../../manager/sound";
import Box from "@mui/material/Box";
import {BeatLoader} from "react-spinners";
import {Error as ErrorIcon, PlayArrow as PlayArrowIcon, Stop as StopIcon} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const IncidentReportSoundView = ({path}) => {

    const { status, play, stop } = useSoundManager({path})

    return path ? (
        <Box>
            {status === SoundStatus.Loading && <BeatLoader />}
            {status === SoundStatus.Prepared && (
                <IconButton onClick={play}>
                    <PlayArrowIcon />
                </IconButton>
            )}
            {status === SoundStatus.Play && (
                <IconButton onClick={stop}>
                    <StopIcon />
                </IconButton>
            )}
            {status === SoundStatus.Error && (
                <ErrorIcon />
            )}
        </Box>
    ) : null
}

IncidentReportSoundView.propTypes = {
    path: PropTypes.string
}

export default IncidentReportSoundView

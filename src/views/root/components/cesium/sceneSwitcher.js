import {useCallback, useEffect, useState} from "react";
import {Button, ButtonGroup} from "@mui/material";
import PropTypes from "prop-types";
import * as Cesium from "cesium"
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";


const SceneMode = {
    Mode2D: "2d",
    Mode3D: "3d",
}

const CesiumSceneSwitcher = ({style, viewer}) => {

    const [mode, setMode] = useState(SceneMode.Mode3D)

    useEffect(() => {
        if (!viewer?.scene) { return }

        switch(viewer.scene.mode) {
            case Cesium.SceneMode.SCENE2D:
                setMode(SceneMode.Mode2D)
                break
            case Cesium.SceneMode.SCENE3D:
                setMode(SceneMode.Mode3D)
                break
            default:
                break
        }
    }, [viewer])

    const onChangeViewMode = useCallback((event, value) => {
        if (!viewer?.scene) { return }
        console.log(value)
        switch(value) {
            case SceneMode.Mode3D:
                viewer.scene.mode = Cesium.SceneMode.SCENE3D
                setMode(SceneMode.Mode3D)
                break
            case SceneMode.Mode2D:
                viewer.scene.mode = Cesium.SceneMode.SCENE2D
                setMode(SceneMode.Mode2D)
                break
            default:
                break
        }

    }, [viewer])

    return (
        <ToggleButtonGroup
            size="small"
            style={style}
            value={mode}
            onChange={onChangeViewMode}
            exclusive={true}
        >
            <ToggleButton value={SceneMode.Mode3D}>3D</ToggleButton>
            <ToggleButton value={SceneMode.Mode2D}>2D</ToggleButton>
        </ToggleButtonGroup>
    )
}

CesiumSceneSwitcher.propTypes = {
    style: PropTypes.object,
    viewer: PropTypes.object
}

export default CesiumSceneSwitcher

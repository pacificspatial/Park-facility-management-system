import PropTypes from "prop-types";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {Dialog} from "@mui/material";
import Box from "@mui/material/Box";
import useCesium from "../../../../../manager/cesium";
import basemapDef from "../../../map/basemap";
import "cesium/Build/Cesium/Widgets/widgets.css"
import MapFacilityLayer from "../../../map/layers/facility";
import MapGateLayer from "../../../map/layers/gate";
import MapBuildingLayer from "../../../map/layers/building";
import MapBridgeLayer from "../../../map/layers/bridge";
import MapTreeLayer from "../../../map/layers/tree";
import MapWaterLayer from "../../../map/layers/water";
import * as Cesium from "cesium";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";
import MapBoundaryLayer from "../../../map/layers/boundary";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWQ1ODBmOC1mZTUxLTQ1YjYtOWJmYi1lYWQwNmYyYjkzMTAiLCJpZCI6Nzc3MjAsImlhdCI6MTY0MDUxODAyMH0.zWLiXFgaGXueoHP0tzeDXwp3ys7dqSDqu2l3SlB80PY'
window.CESIUM_BASE_URL = "./cesium/"

const styles = {
    base: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#eeeeee66',
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100vh',
    },
    root: {
        width: '400px',
        height: '300px',
        display: "flex",
        flexDirection: "column",
    }
}

const MasterFacilityMapView = ({data, onClose}) => {

    const open = useMemo(() => !data.lng || !data.lat, [data])
    const mapRef = useRef()
    const { viewer, layerInitialized} = useCesium({mapRef, basemapDef, layersDef: []})

    useEffect(() => {

        console.log("[FacilityMapView]", mapRef.current, viewer, data)

        if (!viewer) { return }

        // カメラの設定
        const cameraHeading = Cesium.Math.toRadians(0);
        const cameraPitch = Cesium.Math.toRadians(-60);

        // 中心座標の設定
        const center = Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, 300.0);

        // カメラの初期位置の指定
        viewer.camera.setView({
            destination: center,
            orientation: {
                heading: cameraHeading,
                pitch: cameraPitch,
                roll: 0.0
            }
        })

        addPole().then()

    }, [viewer])

    const addPole = useCallback( async () => {
        const terrainProvider = viewer.terrainProvider;
        const positions = [Cesium.Cartographic.fromDegrees(data.longitude, data.latitude)];
        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
        const height = updatedPositions[0].height

        const poleHeight = 30; // ポールの高さ（メートル）
        const sphereRadius = 2; // 球体の半径（メートル）

        // ポールの位置（地面から半分の高さ）
        const polePosition = Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, height + poleHeight / 2);

        // 球体の位置（ポールの上端）
        const spherePosition = Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, height + poleHeight);

        // ポールを追加
        const pole = viewer.entities.add({
            name: "pole",
            position: polePosition,
            cylinder: {
                length: poleHeight,
                topRadius: 0.5,
                bottomRadius: 0.1,
                material: Cesium.Color.CYAN.withAlpha(0.5),
            },
        });

        // 球体を追加
        viewer.entities.add({
            name: "sphere",
            position: spherePosition,
            ellipsoid: {
                radii: new Cesium.Cartesian3(sphereRadius, sphereRadius, sphereRadius),
                material: Cesium.Color.CYAN,
            },
        });

        viewer.zoomTo(pole)

    }, [viewer, data])

    return (
        <Box style={styles.base}>
            <Box style={styles.root}>
                <Box style={styles.header}>
                    <IconButton style={styles.closeButton} onClick={onClose}><CloseIcon style={styles.closeIcon} /></IconButton>
                </Box>
                <Box ref={mapRef} style={{width: "600px", height: "400px"}}>
                    <MapFacilityLayer viewer={viewer} />
                    <MapGateLayer viewer={viewer} />
                    <MapBuildingLayer viewer={viewer} />
                    <MapBridgeLayer viewer={viewer} />
                    <MapTreeLayer viewer={viewer} />
                    <MapBoundaryLayer viewer={viewer} />
                    <MapWaterLayer viewer={viewer} />
                </Box>
            </Box>
        </Box>
    )
}

MasterFacilityMapView.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
}

export default MasterFacilityMapView

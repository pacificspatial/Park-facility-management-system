import React, {useCallback, useEffect, useRef, useState} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import * as Cesium from "cesium";
import useCesium from "../../../../../manager/cesium";
import basemapDef from "../../../map/basemap";
import "cesium/Build/Cesium/Widgets/widgets.css"
import MapFacilityLayer from "../../../map/layers/facility";
import MapGateLayer from "../../../map/layers/gate";
import MapBuildingLayer from "../../../map/layers/building";
import MapBridgeLayer from "../../../map/layers/bridge";
import MapTreeLayer from "../../../map/layers/tree";
import MapWaterLayer from "../../../map/layers/water";
import CesiumManager from "../../../../../manager/cesium2";
import SceneSwitcher from "../../../components/cesium/sceneSwitcher";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWQ1ODBmOC1mZTUxLTQ1YjYtOWJmYi1lYWQwNmYyYjkzMTAiLCJpZCI6Nzc3MjAsImlhdCI6MTY0MDUxODAyMH0.zWLiXFgaGXueoHP0tzeDXwp3ys7dqSDqu2l3SlB80PY'
window.CESIUM_BASE_URL = "./cesium/"


const IncidentReportMapView = React.memo(({lngLat}) => {

    const mapRef = useRef()
    const { viewer, layerInitialized} = useCesium({mapRef, basemapDef, layersDef: []})
    const [viewInitialized, setViewInitialized] = useState(false)
    const { getHeight } = CesiumManager()

    useEffect(() => {
        if (!viewer) { return }

        // カメラの設定
        const cameraHeading = Cesium.Math.toRadians(0);
        const cameraPitch = Cesium.Math.toRadians(-60);

        // 中心座標の設定
        const center = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, 300.0);

        // カメラの初期位置の指定
        viewer.camera.setView({
            destination: center,
            orientation: {
                heading: cameraHeading,
                pitch: cameraPitch,
                roll: 0.0
            }
        })

        setViewInitialized(true)

        addPole()

    }, [viewer])

    const addPole = useCallback( async () => {
        const terrainProvider = viewer.terrainProvider;
        const positions = [Cesium.Cartographic.fromDegrees(lngLat.lng, lngLat.lat)];
        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
        const height = updatedPositions[0].height

        const poleHeight = 30; // ポールの高さ（メートル）
        const sphereRadius = 2; // 球体の半径（メートル）

        // ポールの位置（地面から半分の高さ）
        const polePosition = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, height + poleHeight / 2);

        // 球体の位置（ポールの上端）
        const spherePosition = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, height + poleHeight);

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

    }, [viewer, lngLat])
//
//     useEffect(() => {
//         if (!viewer || !viewInitialized) { return }
//
//         var position = Cesium.Cartesian3.fromDegrees(lngLat.lng, lngLat.lat, 0);
//
// // 30mのポールを作成
//         var pole = viewer.entities.add({
//             name: '30mポール',
//             position: position,
//             cylinder: {
//                 length: 30, // 高さ30m
//                 topRadius: 0.5, // 上部の半径（メートル単位）
//                 bottomRadius: 0.5, // 下部の半径（メートル単位）
//                 material: Cesium.Color.RED.withAlpha(0.8), // 色を設定（この場合は半透明の赤）
//             },
//             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//         });
//
//     }, [viewer, viewInitialized])

    return (
        <Box ref={mapRef} style={{position: "relative"}}>
            <MapFacilityLayer viewer={viewer} />
            <MapGateLayer viewer={viewer} />
            <MapBuildingLayer viewer={viewer} />
            <MapBridgeLayer viewer={viewer} />
            <MapTreeLayer viewer={viewer} />
            <MapWaterLayer viewer={viewer} />
            <SceneSwitcher viewer={viewer} style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "white",
                zIndex: 1,
            }} />
        </Box>
    )

})

IncidentReportMapView.propTypes = {
    lngLat: PropTypes.any.isRequired,
}

export default IncidentReportMapView

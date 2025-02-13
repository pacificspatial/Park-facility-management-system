import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import useCesium from "../../../../../manager/cesium";
import basemapDef from "../../../map/basemap";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css"
import SceneSwitcher from "../../../components/cesium/sceneSwitcher";

const MapMode = {
    MapMode2D: "2d",
    MapMode3D: "3d",
}

const ReportGroupTrackingMapView = React.memo(({data}) => {

    const mapRef = useRef()
    const polylineRef = useRef()

    const { viewer, layerInitialized} = useCesium({mapRef, basemapDef, layersDef: []})
    const [mapMode, setMapMode] = useState(MapMode.MapMode3D)

    useEffect(() => {
        if (!viewer) { return }
        console.log(data)

        let minLat, minLng, maxLat, maxLng
        data.forEach(v => {
            if (!minLat || minLat > v.lat) { minLat = v.lat }
            if (!minLng || minLng > v.lon) { minLng = v.lon }
            if (!maxLat || maxLat < v.lat) { maxLat = v.lat }
            if (!maxLng || maxLat < v.lon) { maxLng = v.lon }
        })

        console.log(minLat, minLng, maxLat, maxLng)

        // カメラの設定
        const cameraHeading = Cesium.Math.toRadians(0);
        const cameraPitch = Cesium.Math.toRadians(-60);

        // 中心座標の設定
        const rectangle = Cesium.Rectangle.fromDegrees(minLng, minLat, maxLng, maxLat)

        // カメラの初期位置の指定
        viewer.camera.setView({
            sceneMode: mapMode === MapMode.MapMode2D ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D,
            destination: rectangle,
            orientation: {
                heading: cameraHeading,
                pitch: cameraPitch,
                roll: 0.0
            }
        })

        addLine().then()

        return () => {
            if (polylineRef.current) {
            }
        }

    }, [viewer])

    useEffect(() => {
        if (!viewer) { return }

        switch(mapMode) {
            case MapMode.MapMode2D:
                viewer.scene.mode = Cesium.SceneMode.SCENE2D
                break
            case MapMode.MapMode3D:
                viewer.scene.mode = Cesium.SceneMode.SCENE3D
                break
            default:
                break
        }
    }, [viewer, mapMode]);

    const addLine = useCallback(async () => {
        if (!viewer) { return }

        const positions = data.map( (v) => Cesium.Cartesian3.fromDegrees(v.lon, v.lat, parseFloat(v.altitude)))

        polylineRef.current = viewer.entities.add({
            polyline: {
                positions,
                width: 2,
                material: Cesium.Color.BLUE,
                heightReference: Cesium.HeightReference.NONE,
            }
        })

        viewer.zoomTo(polylineRef.current)

    }, [viewer])

    return (
        <Box ref={mapRef}>
            <SceneSwitcher viewer={viewer} style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
            }} />
        </Box>
    )
})

ReportGroupTrackingMapView.propTypes = {
    data: PropTypes.array.isRequired,
}

export default ReportGroupTrackingMapView

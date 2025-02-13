import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useCesium from "../../../../manager/cesium";
import basemapDef from "../../map/basemap";
import * as Cesium from "cesium"
import PropTypes from "prop-types";
import _ from "lodash";
import MapFacilityLayer from "../../map/layers/facility";
import MapGateLayer from "../../map/layers/gate";
import MapBuildingLayer from "../../map/layers/building";
import MapBridgeLayer from "../../map/layers/bridge";
import MapTreeLayer from "../../map/layers/tree";
import MapWaterLayer from "../../map/layers/water";
import MapFacilityBillboardLayer from "../../map/layers/facility_billboard";
import MapTreeBillboardLayer from "../../map/layers/tree_billboard";
import {Checkbox, FormControl, FormControlLabel} from "@mui/material";
import APIManager from "../../../../manager/api";
import {ViewMode} from "./index";
import {ViewItem} from "../../../../data/state";
import SceneSwitcher from "../../components/cesium/sceneSwitcher";
import MasterInfoView from "./info"

const styles = {
    root: {
        flexGrow: '1',
        flexBasis: '0',
        position: 'relative',
        overflow: 'hidden'
    },
    map: {
        overflow: "hidden",
        position: "relative",
    },
    billboardCheckbox: {
        position: 'absolute',
        bottom: '3rem',
        right: '1rem',
        zIndex: '1',
        background: 'white',
        padding: '8px',
        borderRadius: '10px',
        boxShadow: '1px 1px 8px #000',
    }
}

const MasterGroupMapView = ({viewItem, viewMode, viewDirection, facility}) => {

    const mapRef = useRef()
    const boxRef = useRef()

    const [viewInitialized, setViewInitialized] = useState(false)
    const [width, setWidth] = useState()
    const [height, setHeight] = useState()
    const [viewBillboard, setViewBillboard] = useState(false)
    const [selectFacilityCode, setSelectFacilityCode] = useState()
    const [isFacilityVisible, setIsFacilityVisible] = useState(viewItem === ViewItem.Master)
    const [isTreeVisible, setIsTreeVisible] = useState(viewItem === ViewItem.Tree)
    const [openInfoView, setOpenInfoView] = useState(false)

    const onFeatureClick = (e) => {
        console.log(e)
    }

    const { viewer, layerInitialized} = useCesium({mapRef, basemapDef, layersDef: [], onFeatureClick})

    useEffect(() => {
        setSelectFacilityCode(facility?.facility_code)
        if (viewer && facility?.facility_code) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(facility.longitude, facility.latitude, 200),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-60),
                    roll: 0.0
                },
                mapProjection: new Cesium.WebMercatorProjection(),
            })
        }
    }, [viewer, facility])

    useEffect(() => {
        if (!viewer) { return }

        const cameraHeading = Cesium.Math.toRadians(0)
        const cameraPitch = Cesium.Math.toRadians(-60)

        // 中心座標の設定
        const center = Cesium.Cartesian3.fromDegrees(138.747420840369, 37.427523359073746, 500.0);

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

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
        handler.setInputAction(leftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        window.addEventListener("resize", () => {
            updateViewBounds()
        })

    }, [viewer])

    useEffect(() => {
        updateViewBounds()
    }, [viewInitialized, viewMode, viewDirection])

    const updateViewBounds = useCallback(_.debounce(() => {
        if (!viewInitialized || !boxRef.current) { return }
        console.log("[Map]", "resize", boxRef.current.clientWidth, boxRef.current.clientHeight)
        setWidth(boxRef.current.clientWidth)
        setHeight(boxRef.current.clientHeight)
    }, 100), [viewInitialized])


    const leftClickHandler = useCallback((e) => {
        if (!viewer) { return }

        const features = viewer.scene.drillPick(e.position)
        let feature = null
        let isClickKanban = false

        console.log(features, selectFacilityCode)

        for(let f of features) {
            let p = {}

            if (typeof f.getPropertyIds === "function") {
                for (let propertyName of f.getPropertyIds()) {
                    p[propertyName] = f.getProperty(propertyName)
                }
            } else if (f.collection instanceof Cesium.BillboardCollection || f.collection instanceof Cesium.LabelCollection) {
                isClickKanban = true
            }

            if ((selectFacilityCode && isClickKanban) || p.facility_code) {
                feature = p
                break
            }
        }
        console.log("[Clicked]", "facility", feature, isClickKanban, selectFacilityCode)
        if (isClickKanban) {
            setOpenInfoView(true)
        } else {
            setOpenInfoView(false)
            setSelectFacilityCode(feature?.facility_code)
        }
    }, [viewer, selectFacilityCode])

    useEffect(() => {
        console.log("[UpdateFacility]", selectFacilityCode, facility, openInfoView)
    }, [facility, selectFacilityCode, openInfoView])

    return (
        <>
            <Box style={styles.root} ref={boxRef}>
                <Box ref={mapRef} style={{width, height}}>
                    <MapFacilityLayer visible={isFacilityVisible} viewer={viewer} />
                    <MapGateLayer viewer={viewer} />
                    <MapBuildingLayer viewer={viewer} />
                    <MapBridgeLayer viewer={viewer} />
                    <MapTreeLayer visible={isTreeVisible} viewer={viewer} />
                    <MapWaterLayer viewer={viewer} />
                    <MapFacilityBillboardLayer visible={true} viewer={viewer} facilityCode={selectFacilityCode} showAll={viewBillboard} />
                    <MapTreeBillboardLayer visible={true} viewer={viewer} facilityCode={selectFacilityCode} showAll={viewBillboard} />
                </Box>
                <Box style={styles.billboardCheckbox}>
                    <FormControlLabel control={<Checkbox checked={viewBillboard} onClick={() => setViewBillboard(prev => !prev)} />} label="全ての施設看板を表示" />
                </Box>
                <SceneSwitcher viewer={viewer} style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                }} />
            </Box>
            <MasterInfoView facilityCode={selectFacilityCode} open={openInfoView} onClose={() => setOpenInfoView(false)} />
        </>
    )
}

MasterGroupMapView.propTypes = {
    viewMode: PropTypes.array,
    viewItem: PropTypes.string,
    viewDirection: PropTypes.string,
    facility: PropTypes.object,
}

export default MasterGroupMapView

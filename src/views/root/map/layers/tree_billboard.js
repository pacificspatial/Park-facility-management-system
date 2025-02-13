import PropTypes from "prop-types"
import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import * as Cesium from "cesium"
import APIManager from "../../../../manager/api"
import {MainDataContext} from "../../../../App";
import {ViewItem} from "../../../../data/state";

const MapTreeBillboardLayer = ({viewer, visible, showAll, facilityCode}) => {

    const { state } = useContext(MainDataContext)
    const [entities, setEntities] = useState([])

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428790)
            .then(async res => {
                let ds = await Cesium.CzmlDataSource.load(res)
                let ent = await viewer.dataSources.add(ds)
                setEntities(ent.entities.values)
            })
    }, [viewer]);

    useEffect(() => {
        updateVisible()
    }, [entities, visible, facilityCode, showAll])

    // useEffect(() => {
    //
    //     if (state.viewItem !== ViewItem.Tree) {
    //         for(let entity of entities) {
    //             entity.show = false
    //         }
    //     } else if (!state.treeSelectedData) {
    //         for(let entity of entities) {
    //             entity.show = state.showMapPoi
    //         }
    //     } else if(!state.treeSelectedData.colId || state.treeSelectedData.colId === "facility_code") {
    //         for(let entity of entities) {
    //             entity.show = state.treeSelectedData.facility_code === entity.id
    //         }
    //     } else {
    //         APIManager.get("list/tree_codes", {
    //             selected: {
    //                 colId: state.treeSelectedData?.colId,
    //                 colValue: state.treeSelectedData?.colValue,
    //             },
    //             filterModel: state.treeFilterModel,
    //         }).then(rows => {
    //             let ids = rows.map(v => v.facility_code)
    //             for(let entity of entities) {
    //                 entity.show = ids.includes(entity.id)
    //             }
    //         })
    //     }
    //
    // }, [viewer, entities, state.viewItem, state.showMapPoi, state.treeSelectedData, state.treeFilterModel])

    const updateVisible = useCallback(() => {
//        console.log("[Update Faiclity Billboard]", entities, visible)
        let v = false
        if ((!visible || !facilityCode) && !showAll) {
            entities?.forEach(entity => entity.show = false)
        } else {
            entities?.forEach(entity => {
//                console.log(facilityCode, entity.properties?.facility_code?.getValue())
                entity.show = showAll || facilityCode === entity.properties?.facility_code?.getValue()
            })
        }


        //
        //
        // if (!entities) { return }
        //
        //
        // if (!visible) {
        //     for (let entity of entities) {
        //         entity.show = false
        //     }
        // }
        //
        // for(let entity of entities) {
        //     entity.show = true
        // }
    }, [entities, visible, showAll, facilityCode])

    return null
}

MapTreeBillboardLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
    showAll: PropTypes.bool,
    facilityCode: PropTypes.string,
}

export default MapTreeBillboardLayer

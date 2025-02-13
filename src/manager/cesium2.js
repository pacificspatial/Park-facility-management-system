import * as Cesium from "cesium"

const CesiumManager = () => {


    const getHeight = async (viewer, lng, lat) => {
        const terrainProvider = viewer.terrainProvider;
        const positions = [Cesium.Cartographic.fromDegrees(lng, lat)];
        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
        return updatedPositions[0].height;
    }

    return {
        getHeight
    }

}

export default CesiumManager

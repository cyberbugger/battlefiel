import { FleetDirection, FleetConfig } from "../typings"
import { Fleet } from "../models/Fleet"

const fleetConfig: FleetConfig[] = [{
    direction: FleetDirection.HORIZONTAL,
    sizes: [1, 2, 3, 4]
},
{
    direction: FleetDirection.VERTICAL,
    sizes: [1, 2, 3, 4]
}
]

export const makeFleets = (): Fleet[] => {
    const fleets: Fleet[] = []
    
    fleetConfig.forEach(config => {
        config.sizes.forEach(size => fleets.push(new Fleet(config.direction, size)))
    })

    return fleets
}

export const canPlaceFleetAtPosition = (fleets: Fleet[], targetFleet: Fleet, targetXPos: number, targetYPos: number, gridWidth: number, gridHeight: number): boolean => {
    if (targetXPos >= gridWidth || targetYPos >= gridHeight) {
        return false
    }

    const fleetBlocks = fleets
        .map(f => getFleetBlocks(f.xPosition, f.yPosition, f.size, f.direction))
        .filter(f => f.length > 0)
        .flat()
        .map(coords => [coords].concat(getSurroundingCoords(coords[0], coords[1], gridWidth, gridHeight)))
        .flat()

    const targetCoords = getFleetBlocks(targetXPos, targetYPos, targetFleet.size, targetFleet.direction)

    let hasInvalidTargetCoords = false
    targetCoords.forEach(([targetx, targety]) => {
        if (targetx >= gridWidth || targety >= gridHeight) {
            hasInvalidTargetCoords = true
        }
    })

    if (hasInvalidTargetCoords) {
        return false
    }

    let hasConflictingFleetBlock = false
    for (let i = 0; i < fleetBlocks.length; i++) {
        const [xPos, yPos] = fleetBlocks[i]

        targetCoords.forEach(([targetx, targety]) => {
            if (xPos === targetx && yPos === targety) {
                hasConflictingFleetBlock = true
            }
        })
    }

    if (hasConflictingFleetBlock) {
        return false
    }

    return true

}

export const getSurroundingCoords = (xPos: number, yPos: number, width: number, height: number): number[][] => {
    const coords: number[][] = [
        [xPos, yPos + 1],
        [xPos, yPos - 1],
        [xPos + 1, yPos],
        [xPos - 1, yPos],
        [xPos + 1, yPos + 1],
        [xPos - 1, yPos - 1],
        [xPos + 1, yPos - 1],
        [xPos - 1, yPos + 1],
    ]

    return coords.filter(([x, y]) => x >= 0 && y >= 0 && x < width && y < height)
}

export const getMatchingFleets = (fleets: Fleet[], xPos: number, yPos : number) =>
    fleets.filter(f => f.xPosition === xPos && f.yPosition === yPos)

export const getFleetBlocks = (xPos: number, yPos: number, size: number, direction: FleetDirection) => {
    const mainBlock = [xPos, yPos]
    const allBlocks = [mainBlock]

    if (xPos < 0 && yPos < 0) {
        return []
    }
    
    if (direction === FleetDirection.HORIZONTAL) {
        let i = 0
        while (i < size - 1) {
            allBlocks.push([xPos, yPos+(++i)])
        }
    } else if (direction === FleetDirection.VERTICAL) {
        let i = 0
        while (i < size - 1) {
            allBlocks.push([xPos+(++i), yPos])
        }
    }

    return allBlocks
}
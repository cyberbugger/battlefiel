import { FleetDirection } from '../typings';
import { POSITION_NOT_SET } from '../constants';

export class Fleet {
    xPosition: number
    yPosition: number
    direction: FleetDirection
    size: number
    placed: boolean

    constructor(direction: FleetDirection, size: number) {
        this.xPosition = POSITION_NOT_SET
        this.yPosition = POSITION_NOT_SET
        this.direction = direction
        this.size = size
        this.placed = false
    }

    setPosition(xPosition: number, yPosition: number) {
        this.xPosition = xPosition
        this.yPosition = yPosition
        this.placed = true
    }

    getFleetBlocks = () => {
        const mainBlock = [this.xPosition, this.yPosition]
        const allBlocks = [mainBlock]
        
        if (this.direction === FleetDirection.HORIZONTAL) {
            let i = 0
            while (i < this.size - 1) {
                i++
                allBlocks.push([this.xPosition, this.yPosition+i])
            }
        } else if (this.direction === FleetDirection.VERTICAL) {
            let i = 0
            while (i < this.size - 1) {
                i++
                allBlocks.push([this.xPosition+i, this.yPosition])
            }
        }
    
        return allBlocks
    }
}

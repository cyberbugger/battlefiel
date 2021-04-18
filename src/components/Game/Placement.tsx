import { GameProps } from "./Game"
import React, { useState } from "react"
import { CellState, GameMode, FleetDirection } from "../../typings"
import { getMatchingFleets, canPlaceFleetAtPosition } from "../../controllers/fleetHelpers"
import { Button } from "antd"
import cx from 'classnames';
import { Fleet } from "../../models/Fleet"

const styles = require("./Game.module.css")

const renderFleet = (fleet: Fleet, index: number, setDraggedFleet: Function) => {
    let height = 30
    let width = 30

    if (fleet.direction === FleetDirection.HORIZONTAL) {
        width *= fleet.size
    } else if (fleet.direction === FleetDirection.VERTICAL) {
        height *= fleet.size
    }

    return (
        <>
            {index % 4 === 0 && <br />}
            <div key={index} className={styles.fleetBlock} style={{height, width}} draggable={true} onDragStart={() => setDraggedFleet(index)} />
        </>
    )
}

export const Placement = (props: GameProps) => {
    const entity = props.entities[props.turn]
    const grid = entity.batteground.grid
    const [draggedFleet, setDraggedFleet] = useState(-1)

    const handleDrag = (columnId: number, rowId: number) => {
        const matchingFleet = getMatchingFleets(entity.fleets, columnId, rowId)
        if (matchingFleet && matchingFleet.length) {
            return
        }

        const targetFleet = entity.fleets[draggedFleet]
        const canPlaceFleet = canPlaceFleetAtPosition(
            entity.fleets,
            targetFleet,
            columnId,
            rowId,
            entity.batteground.getLength(),
            entity.batteground.getHeight()
        )

        if (!canPlaceFleet) {
            return
        }

        targetFleet.setPosition(columnId, rowId)
        const fleetBlocks = targetFleet.getFleetBlocks()
        
        fleetBlocks.forEach(([fleetx, fleety]) => {
            entity.batteground.setCellState(fleetx, fleety, CellState.FLEET)
        })
        
        props.onEntitiesChange(props.entities.map((e, eIndex) => {
            e.fleets = e.fleets.filter((_, index) => props.turn !== eIndex || index !== draggedFleet)
            return {...e}
        }))
    }

    const playersLeftToSetFleet = props.turn < props.entities.length - 1

    return (
        <>
            <p>Setting grid for <strong>{entity.player.name}</strong></p>

            {grid.map((column, columnId) => (
                <div key={columnId} className={styles.gridRow}>
                    {column.map((row, rowId) => (
                        <div key={columnId + rowId} className={cx(styles.node, {
                            [styles.ship]: row === CellState.FLEET,
                        })} onDragOver={e => e.preventDefault()} onDrop={_ => handleDrag(columnId, rowId)} />
                    ))}
                </div>
            ))}

            <p className={styles.fleetTitle}>Fleets</p>
            <div className={styles.fleetBlockContainer}>
                {entity.fleets.map((fleet, index) => renderFleet(fleet, index, setDraggedFleet))}
            </div>

            

            {playersLeftToSetFleet ? (
                <Button type="primary" disabled={entity.fleets.length > 0} onClick={() => props.onTurnChange(props.turn + 1)}>Move to next player</Button>
            ) : (
                <Button type="primary" disabled={entity.fleets.length > 0} onClick={() => {
                    props.onModeChange(GameMode.LIVE)
                    props.onTurnChange(0)
                }}>Start Game</Button>
            )}
        </>
    )
}
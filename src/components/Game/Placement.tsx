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

    return !fleet.placed ? (
        <div key={index} className={styles.fleetBlock} style={{height, width}} draggable={true} onDragStart={() => setDraggedFleet(index)} />
    ) : null
}

export const Placement = (props: GameProps) => {
    const entity = props.entities[props.turn]
    const grid = entity.batteground.grid
    const [draggedFleet, setDraggedFleet] = useState(-1)

    const handleDrag = (columnId: number, rowId: number) => {
        const fleetAtGivenCoords = getMatchingFleets(entity.fleets, columnId, rowId)
        if (fleetAtGivenCoords && fleetAtGivenCoords.length) {
            return
        }

        const fleetDropped = entity.fleets[draggedFleet]
        const canPlaceFleet = canPlaceFleetAtPosition(
            entity.fleets,
            fleetDropped,
            columnId,
            rowId,
            entity.batteground.getLength(),
            entity.batteground.getHeight()
        )

        if (!canPlaceFleet) {
            return
        }

        fleetDropped.setPosition(columnId, rowId)
        
        fleetDropped.getFleetBlocks().forEach(([fleetx, fleety]) =>
            entity.batteground.setCellState(fleetx, fleety, CellState.FLEET))
        
        props.onEntitiesChange(props.entities.map(e => ({...e})))
    }

    const haveAllPlayersSetFleets = props.turn >= props.entities.length - 1

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

            {!haveAllPlayersSetFleets ? (
                <Button type="primary" disabled={!entity.fleets.every(f => f.placed)} onClick={() => props.onTurnChange(1 - props.turn)}>Move to next player</Button>
            ) : (
                <Button type="primary" disabled={!entity.fleets.every(f => f.placed)} onClick={() => {
                    props.onModeChange(GameMode.LIVE)
                    props.onTurnChange(0)
                }}>Start Game</Button>
            )}
        </>
    )
}
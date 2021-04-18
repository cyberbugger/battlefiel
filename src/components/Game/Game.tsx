import React from 'react'
import { Layout } from 'antd';
import { GameEntity } from "../../models/Game"
import { GameMode } from '../../typings';
import { Home } from './Home';
import { GameOver } from './GameOver';
import { Placement } from './Placement';
import { Live } from './Live';

const styles = require("./Game.module.css")

export type GameProps = {
    mode: GameMode;
    entities: GameEntity[]
    turn: number
    onModeChange: (value: GameMode) => void
    onEntitiesChange: (value: GameEntity[]) => void
    onTurnChange: (value: number) => void
}

const renderContent = (props: GameProps) => {
    switch (props.mode) {
        case GameMode.HOME:
            return <Home {...props} />
        case GameMode.PLACEMENT:
            return <Placement {...props} />
        case GameMode.LIVE:
            return <Live {...props} />
        case GameMode.OVER:
            return <GameOver {...props} />
    }

    return false
}

export const GameComponent = (props: GameProps) => (
    <Layout className={styles.gamePage}>
        <Layout.Content>
            {renderContent(props)}
        </Layout.Content>
    </Layout>
)
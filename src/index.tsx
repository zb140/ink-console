import { createElement, useState, useEffect } from 'react';
import { useInput, Text, Color } from 'ink';

import LogCatcher, { ILogCatcher } from './LogCatcher';

import Props from './Props';
import renderString from './renderString';
import State from './State';

import * as actions from './actions';

const CONTRACT_KEY = 'h';
const EXPAND_KEY = 'l';
const UP_KEY = 'k';
const DOWN_KEY = 'j';
const PAGE_UP_KEY = 'K';
const PAGE_DOWN_KEY = 'J';
const PIN_KEY = 'G';

export { LogCatcher, Props };

const defaultState: State = {
    log: [],
    pinned: true,
    lastEntryToDisplayIndex: 0,
    offset: 0,
    depth: 2,
};

type Resetter = undefined | (() => void);

const LogOutput: React.FC<Props> =
    (props: Props) => {
        const [ state, setState ] = useState(defaultState);
        const [ logCatcher, setLogCatcher ] = useState<ILogCatcher | undefined>(undefined);
        const [ resetter, setResetter ] = useState<Resetter>(undefined);

        useInput(
            (input, key) => {
                // TODO: tried adding aliases for up/down arrows and PgUp/PgDn keys but
                // couldn't get it working for some reason
                switch (input) {
                    case UP_KEY:
                        setState(s => actions.up(s, props));
                        break;
                    case DOWN_KEY:
                        setState(s => actions.down(s));
                        break;
                    case PAGE_UP_KEY:
                        setState(s => actions.pageUp(s, props));
                        break;
                    case PAGE_DOWN_KEY:
                        setState(s => actions.pageDown(s, props));
                        break;
                    case PIN_KEY:
                        setState(s => actions.pin(s));
                        break;
                    case EXPAND_KEY:
                        setState(s => actions.expand(s, props));
                        break;
                    case CONTRACT_KEY:
                        setState(s => actions.shrink(s, props));
                        break;
                }
            }
        );

        useEffect(
            () => {
                const newLogCatcher = props.logCatcher || logCatcher || new LogCatcher();

                let reset = resetter;

                if (newLogCatcher !== logCatcher) {
                    if (reset) {
                        reset();
                    }

                    reset = newLogCatcher.onUpdate(
                        () => {
                            setState((old) => ({ ...old, log: newLogCatcher.getLog() }));
                        }
                    );

                    setLogCatcher(newLogCatcher);
                    setResetter(() => reset);
                }

                return () => {
                    if (reset) {
                        reset();
                    }

                    if (newLogCatcher) {
                        newLogCatcher.dispose();
                    }
                }
            },
            [ props.logCatcher ]
        );

        return (
            <div>
                <div>
                    <Text bold>Log Output</Text>
                </div>
                <br />
                <div>{renderString(state, props)}</div>
                <br />
                <div>
                    <Text>
                        (Move up: <Color blue>{UP_KEY}</Color>, Move down:{' '}
                        <Color blue>{DOWN_KEY}</Color>, Page up:{' '}
                        <Color blue>{PAGE_UP_KEY}</Color>, Page down:{' '}
                        <Color blue>{PAGE_DOWN_KEY}</Color>, Pin to end of log:{' '}
                        <Color blue>{PIN_KEY}</Color>, Expand objects:{' '}
                        <Color blue>{EXPAND_KEY}</Color>, Shrink objects:{' '}
                        <Color blue>{CONTRACT_KEY}</Color>)
                    </Text>
                </div>
            </div>
        );
    };

export default LogOutput;

import { useEffect, useState, useMemo } from 'react';
import { wrap, releaseProxy, Remote } from 'comlink';
import { DiceProbabilites, Roller } from '../roller';

export function useSimulateRolls(
    worker: RollerWorkerApi,
    diceExpression: string
): {
    isCalculating: boolean;
    results: undefined | DiceProbabilites;
} {
    // We'll want to expose a wrapping object so we know when a calculation is in progress
    const [data, setData] = useState({
        isCalculating: false,
        results: undefined as DiceProbabilites | undefined
    });

    useEffect(() => {
        // We're starting the calculation here
        setData({ isCalculating: true, results: undefined });

        worker
            .calculateProbabilites(diceExpression)
            .then((results) => setData({ isCalculating: false, results }));
    }, [setData, diceExpression]);

    return data;
}

export function useRollDice(
    worker: RollerWorkerApi,
    diceExpression: string
): {
    isCalculating: boolean;
    results: undefined | number;
} {
    // We'll want to expose a wrapping object so we know when a calculation is in progress
    const [data, setData] = useState({
        isCalculating: false,
        results: undefined as number | undefined
    });

    useEffect(() => {
        // We're starting the calculation here
        setData({ isCalculating: true, results: undefined });

        worker
            .rollDice(diceExpression)
            .then((results) => setData({ isCalculating: false, results }));
    }, [setData, diceExpression]);

    return data;
}

export class RollerWorkerApi {
    private _worker: Worker;
    private _workerApi: Remote<Roller>;
    private _isDisposed: boolean;

    constructor() {
        // Here we create our worker and wrap it with comlink so we can interact with it
        this._worker = new Worker(new URL('../roll-worker', import.meta.url), {
            name: 'roll-worker',
            type: 'module'
        });
        this._workerApi = wrap<import('../roll-worker').SimulationWorker>(
            this._worker
        );
        this._isDisposed = false;
    }

    cleanup() {
        if (this._isDisposed) {
            return;
        }

        this._isDisposed = true;
        this._workerApi[releaseProxy]();
        this._worker.terminate();
    }

    rollDice(diceExpression: string) {
        return this._workerApi.rollDice(diceExpression);
    }

    calculateProbabilites(diceExpression: string) {
        return this._workerApi.calculateProbabilites(diceExpression);
    }
}

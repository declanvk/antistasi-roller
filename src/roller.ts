import { DiceRoll } from 'rpg-dice-roller';
import { RollResults } from 'rpg-dice-roller/types/results';

export interface DiceRollResult {
    output: string;
    total: number;
    minTotal: number;
    maxTotal: number;
    notation: string;
    rolls: RollResults[];
    type: string;
}

export class Roller {
    private _probabilitesCache: Map<string, DiceProbabilites>;
    private _diceCache: Map<string, DiceRoll>;
    private _numIterations: number;

    constructor() {
        this._probabilitesCache = new Map();
        this._diceCache = new Map();
        this._numIterations = 10000;
    }

    rollDice(diceExpression: string): DiceRollResult {
        const diceRoll = this.getDice(diceExpression);
        diceRoll.roll();

        return diceRoll.toJSON();
    }

    calculateProbabilites(diceExpression: string): DiceProbabilites {
        if (this._probabilitesCache.has(diceExpression)) {
            return this._probabilitesCache.get(diceExpression)!;
        }

        const result = this.performSimulation(diceExpression);
        this._probabilitesCache.set(diceExpression, result);
        return result;
    }

    private performSimulation(diceExpression: string): DiceProbabilites {
        const diceRoll = this.getDice(diceExpression);
        const uniqueValuesToCount = new Map<number, number>();
        for (let idx = 0; idx < this._numIterations; idx++) {
            diceRoll.roll();

            const currentCount = uniqueValuesToCount.get(diceRoll.total);
            if (currentCount !== undefined) {
                uniqueValuesToCount.set(diceRoll.total, currentCount + 1);
            } else {
                uniqueValuesToCount.set(diceRoll.total, 1);
            }
        }

        const values = Array.from(uniqueValuesToCount.keys()).sort(
            (a, b) => a - b
        );
        const counts = values.map((value) => {
            return uniqueValuesToCount.get(value)!;
        });

        return {
            values,
            counts,
            numRolls: this._numIterations
        };
    }

    private getDice(diceExpression: string): DiceRoll {
        const dice = this._diceCache.get(diceExpression);
        if (dice === undefined) {
            this._diceCache.set(diceExpression, new DiceRoll(diceExpression));
        }

        return this._diceCache.get(diceExpression)!;
    }
}

export interface DiceProbabilites {
    readonly values: number[];
    readonly counts: number[];
    readonly numRolls: number;
}

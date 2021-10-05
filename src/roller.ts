import { DiceRoll } from 'rpg-dice-roller';
import { RollResults } from 'rpg-dice-roller/types/results';
import { isListOf } from './models';

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
        if (isProbabilityExpression(diceExpression)) {
            const weights = parseProbabilityExpression(diceExpression);
            const total = rollProbabilityExpression(weights);

            return {
                total,
                maxTotal: weights.length,
                minTotal: 1,
                rolls: [],
                type: 'direct',
                notation: diceExpression,
                output: `[${total}]`
            };
        }

        const diceRoll = this.getDice(diceExpression);
        diceRoll.roll();

        return diceRoll.toJSON();
    }

    calculateProbabilites(diceExpression: string): DiceProbabilites {
        if (this._probabilitesCache.has(diceExpression)) {
            return this._probabilitesCache.get(diceExpression)!;
        }

        if (isProbabilityExpression(diceExpression)) {
            const weights = parseProbabilityExpression(diceExpression);
            const values = range(1, weights.length);
            const total = weights.reduce((sum, elem) => sum + elem);

            return {
                values,
                counts: weights,
                numRolls: total
            };
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

const PROBABILITY_EXPR_PREFIX = 'probability!';

function isProbabilityExpression(expression: string): boolean {
    return expression.startsWith(PROBABILITY_EXPR_PREFIX);
}

function parseProbabilityExpression(expression: string): number[] {
    if (!isProbabilityExpression(expression)) {
        throw new Error(
            `Unable to parse direct probability expression from [${expression}]!`
        );
    }

    const probabilities = JSON.parse(
        expression.substring(PROBABILITY_EXPR_PREFIX.length)
    ) as unknown;

    if (
        isListOf(
            probabilities,
            ((elem) => typeof elem === 'number') as (
                elem: unknown
            ) => elem is number
        )
    ) {
        return probabilities;
    } else {
        throw new Error(
            `Unable to parse direct probability expression from [${expression}]!`
        );
    }
}

function rollProbabilityExpression(weights: number[]): number {
    const cummulativeWeights: number[] = [];

    for (let index = 0; index < weights.length; index++) {
        const prevCummulativeWeight = cummulativeWeights[index - 1] || 0;
        cummulativeWeights.push(weights[index] + prevCummulativeWeight);
    }

    const random =
        Math.random() * cummulativeWeights[cummulativeWeights.length - 1];

    for (let index = 0; index < cummulativeWeights.length; index++) {
        if (cummulativeWeights[index] > random) {
            return index + 1;
        }
    }

    return cummulativeWeights.length;
}

function range(start: number, length: number): number[] {
    const array = new Array(length);
    let currentValue = start;

    for (let index = 0; index < array.length; index++) {
        array[index] = currentValue;
        currentValue += 1;
    }

    return array;
}

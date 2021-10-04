import * as React from 'react';
import { ItemCategory, ItemSubcategory, Objective } from '../models';
import { DiceRollResult } from '../roller';
import { RollerWorkerApi } from './App.hooks';

function* repeat<T>(gen: (idx: number) => T, repetitions: number) {
    for (let idx = 0; idx < repetitions; idx++) {
        yield gen(idx);
    }
}

export function useCompleteObjective(
    worker: RollerWorkerApi,
    objective: Objective,
    itemIdMap: Map<string, ItemCategory>,
    quantityGenerator: string
): {
    itemIdx: number;
    item: ItemCategory;
    reward: GrantRewardResult;
}[] {
    const flattenedRewards = objective.rewards.flatMap((reward) =>
        Array.from(
            repeat((idx) => {
                const item = itemIdMap.get(reward.id)!;
                return {
                    itemIdx: idx,
                    item: item
                };
            }, reward.quantity)
        )
    );

    // We'll want to expose a wrapping object so we know when a calculation is in progress
    const [data, setData] = React.useState(
        [] as {
            itemIdx: number;
            item: ItemCategory;
            reward: GrantRewardResult;
        }[]
    );

    React.useEffect(() => {
        // We're starting the calculation here
        setData([]);

        for (const individualReward of flattenedRewards) {
            calculateSingleReward(
                worker,
                individualReward.item,
                quantityGenerator
            ).then((reward) => {
                setData((prev) => {
                    return [...prev, { ...individualReward, reward }];
                });
            });
        }
    }, [objective, itemIdMap, quantityGenerator]);

    return data;
}

export interface GrantRewardResult {
    categoryRoll: DiceRollResult;
    subcategory: ItemSubcategory;
    subcategoryRoll: DiceRollResult;
    quantityRoll: DiceRollResult;
}

function calculateSingleReward(
    worker: RollerWorkerApi,
    rewardItem: ItemCategory,
    quantityGenerator: string
): Promise<GrantRewardResult> {
    return worker
        .rollDice(rewardItem.generator)
        .then((categoryRoll) => {
            const subcategory =
                rewardItem.subcategories[categoryRoll.total - 1];

            return worker
                .rollDice(subcategory.generator)
                .then((subcategoryRoll) => {
                    return { categoryRoll, subcategory, subcategoryRoll };
                });
        })
        .then((prev) => {
            return worker.rollDice(quantityGenerator).then((quantityRoll) => {
                return { ...prev, quantityRoll };
            });
        });
}

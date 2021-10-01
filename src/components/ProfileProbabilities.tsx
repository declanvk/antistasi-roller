import * as React from 'react';
import { isItemCategory, ItemCategory, ItemSubcategory } from '../models';
import { RollerWorkerApi, useSimulateRolls } from './App.hooks';

interface ProfileProbabilitiesProps {
    items: ItemCategory[];
    getRollWorker: () => RollerWorkerApi;
}

class ProfileProbabilities extends React.Component<ProfileProbabilitiesProps> {
    constructor(props: ProfileProbabilitiesProps) {
        super(props);
    }

    render() {
        const allGenerators = Array.from(
            new Set(this.props.items.flatMap(gatherGenerators))
        );

        const generatorList = allGenerators.map((generator) => {
            return (
                <Generator
                    key={generator}
                    diceExpression={generator}
                    getRollWorker={this.props.getRollWorker}
                />
            );
        });

        return <div className="border space-y-4">{...generatorList}</div>;
    }
}

function gatherGenerators(item: ItemCategory | ItemSubcategory): string[] {
    if (isItemCategory(item)) {
        return [
            item.generator,
            ...item.subcategories.flatMap((sub) => gatherGenerators(sub))
        ];
    } else {
        return [item.generator];
    }
}

const Generator: React.FC<{
    diceExpression: string;
    getRollWorker: () => RollerWorkerApi;
}> = ({ diceExpression, getRollWorker }) => {
    const probabilities = useSimulateRolls(getRollWorker(), diceExpression);
    if (probabilities.isCalculating || probabilities.results === undefined) {
        return <div>{diceExpression}: Calculating...</div>;
    }

    const zippedValueProbability = probabilities.results!.values.flatMap(
        (value, idx) => {
            return [
                <span key={`value-${idx}`}>{value}</span>,
                <span key={`prob-${idx}`}>
                    {(
                        probabilities.results!.probabilites[idx] * 100
                    ).toPrecision(2)}
                    %
                </span>
            ];
        }
    );

    return (
        <div className="block">
            <div>{diceExpression}</div>

            <div className="inline-grid grid-rows-2 grid-flow-col gap-3">
                {...zippedValueProbability}
            </div>
        </div>
    );
};

export default ProfileProbabilities;

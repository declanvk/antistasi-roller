import * as React from 'react';
import { ItemCategory, Objective, Profile } from '../models';

interface ProfileRewardProps {
    quantityGenerator: string;
    items: ItemCategory[];
    objectives: Objective[];
}

class ProfileReward extends React.Component<ProfileRewardProps> {
    render() {
        const buttons = this.props.objectives.map((obj) => {
            return (
                <button className="border px-4" key={obj.id}>
                    {obj.name}
                </button>
            );
        });
        const itemIdMap = new Map(
            this.props.items.map((item) => [item.id, item])
        );

        return (
            <RewardsTable
                objectives={this.props.objectives}
                itemIdMap={itemIdMap}
            />
        );
    }
}

const RewardsTable: React.FC<{
    objectives: Objective[];
    itemIdMap: Map<string, ItemCategory>;
}> = ({ objectives, itemIdMap }) => {
    const uniqueItemIds = Array.from(
        new Set(
            objectives.flatMap((obj) => obj.rewards.map((reward) => reward.id))
        )
    );

    const itemHeaders = uniqueItemIds.map((itemId) => {
        return (
            <th className="border border-green-600 ...">
                {itemIdMap.get(itemId)?.name}
            </th>
        );
    });

    const objectiveRows = objectives.map((obj) => {
        const rewardQuantities = uniqueItemIds.map((itemId) => {
            const rewardQuantity =
                obj.rewards.find((reward) => reward.id === itemId)?.quantity ??
                0;
            return (
                <td className="border border-green-600 ...">
                    {rewardQuantity}
                </td>
            );
        });
        return (
            <tr>
                <td className="border border-green-600 ...">{obj.name}</td>
                {...rewardQuantities}
            </tr>
        );
    });

    return (
        <table className="border-collapse">
            <thead>
                <tr>
                    <th /> {/* Spacer element */}
                    {...itemHeaders}
                </tr>
            </thead>
            <tbody>{...objectiveRows}</tbody>
        </table>
    );
};

export default ProfileReward;

import * as React from 'react';
import { ItemCategory, Objective } from '../models';
import { RollerWorkerContext } from './App';
import { useCompleteObjective } from './ProfileReward.hooks';

interface ProfileRewardProps {
    quantityGenerator: string;
    items: ItemCategory[];
    objectives: Objective[];
}

const ProfileReward: React.FC<ProfileRewardProps> = ({
    quantityGenerator,
    items,
    objectives
}) => {
    const itemIdMap = new Map(items.map((item) => [item.id, item]));

    const [completedObjective, setCompletedObjective] = React.useState(
        undefined as Objective | undefined
    );

    return (
        <div className="border">
            <RewardsTable
                objectives={objectives}
                itemIdMap={itemIdMap}
                setCompletedObjective={setCompletedObjective}
            />

            {completedObjective === undefined ? null : (
                <CompletedObjective
                    quantityGenerator={quantityGenerator}
                    objective={completedObjective}
                    itemIdMap={itemIdMap}
                />
            )}
        </div>
    );
};

const CompletedObjective: React.FC<{
    objective: Objective;
    itemIdMap: Map<string, ItemCategory>;
    quantityGenerator: string;
}> = ({ objective, itemIdMap, quantityGenerator }) => {
    const rollWorker = React.useContext(RollerWorkerContext);

    const data = useCompleteObjective(
        rollWorker,
        objective,
        itemIdMap,
        quantityGenerator
    );

    const listItems = data.map((reward) => {
        return (
            <li key={`${reward.item.name}-${reward.itemIdx + 1}`}>
                <p>
                    {reward.item.name}
                    {'=>'}
                    {reward.reward.categoryRoll?.total}
                    {'=>'}
                    {reward.reward.subcategory?.name}
                    {'=>'}
                    {reward.reward.subcategoryRoll?.total}
                    {'=>'}
                    {reward.reward.quantityRoll?.total}
                </p>
            </li>
        );
    });

    return (
        <div>
            Rewards for {objective.name}:<ul>{...listItems}</ul>
        </div>
    );
};

const RewardsTable: React.FC<{
    objectives: Objective[];
    itemIdMap: Map<string, ItemCategory>;
    setCompletedObjective: React.Dispatch<
        React.SetStateAction<Objective | undefined>
    >;
}> = ({ objectives, itemIdMap, setCompletedObjective }) => {
    const uniqueItemIds = Array.from(
        new Set(
            objectives.flatMap((obj) => obj.rewards.map((reward) => reward.id))
        )
    );

    const itemHeaders = uniqueItemIds.map((itemId) => {
        return (
            <th key={itemId} className="border border-green-600 ...">
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
                <td
                    key={`${obj.id}-${itemId}`}
                    className="border border-green-600"
                >
                    {rewardQuantity}
                </td>
            );
        });
        return (
            <tr key={obj.id}>
                <td className="border border-green-600">
                    <button
                        onClick={() => {
                            setCompletedObjective(obj);
                        }}
                        className="w-full h-full bg-grey-100"
                        key={obj.id}
                    >
                        {obj.name}
                    </button>
                </td>
                {...rewardQuantities}
            </tr>
        );
    });

    return (
        <table className="border-collapse">
            <thead>
                <tr>
                    <th />
                    {...itemHeaders}
                </tr>
            </thead>
            <tbody>{...objectiveRows}</tbody>
        </table>
    );
};

export default ProfileReward;

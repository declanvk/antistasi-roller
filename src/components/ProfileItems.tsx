import { syncBuiltinESMExports } from 'module';
import * as React from 'react';
import { ItemCategory, ItemSubcategory } from '../models';
import { RollerWorkerApi } from './App.hooks';

interface ProfileItemsProps {
    items: ItemCategory[];
}

class ProfileItems extends React.Component<ProfileItemsProps> {
    render() {
        return (
            <div className="border">
                {...this.props.items.map((item) => (
                    <ItemCategory key={item.id} item={item} />
                ))}
            </div>
        );
    }
}

const ItemCategory: React.FC<{ item: ItemCategory }> = ({ item }) => {
    return (
        <div>
            <span>
                {item.name} - {item.generator}
            </span>
            <div className="pl-4">
                {...item.subcategories.map((sub) => (
                    <ItemSubcategory key={sub.id} subcategory={sub} />
                ))}
            </div>
        </div>
    );
};

const ItemSubcategory: React.FC<{ subcategory: ItemSubcategory }> = ({
    subcategory
}) => {
    return (
        <div>
            {subcategory.name} - {subcategory.generator}
        </div>
    );
};

export default ProfileItems;

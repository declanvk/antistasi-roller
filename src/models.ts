export interface Profile {
    name: string;
    description: string;
    quantityGenerator: string;

    objectives: Objective[];
    items: ItemCategory[];
}

export function isProfile(data: unknown): data is Profile {
    if (data === undefined) {
        return false;
    }

    const profile = data as Profile;

    return (
        typeof profile.name === 'string' &&
        typeof profile.description === 'string' &&
        typeof profile.quantityGenerator === 'string' &&
        isListOf(profile.objectives, isObjective) &&
        isListOf(profile.items, isItemCategory)
    );
}

export interface Objective {
    id: string;
    name: string;
    rewards: ItemReference[];
}

export function isObjective(data: unknown): data is Objective {
    if (data === undefined) {
        return false;
    }

    const obj = data as Objective;
    return (
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        isListOf(obj.rewards, isItemReference)
    );
}

export interface ItemReference {
    id: string;
    quantity: number;
}

export function isItemReference(data: unknown): data is ItemReference {
    if (data === undefined) {
        return false;
    }

    const item = data as ItemReference;
    return typeof item.id === 'string' && typeof item.quantity === 'number';
}

export interface ItemCategory {
    id: string;
    name: string;
    generator: string;
    subcategories: ItemSubcategory[];
}

export function isItemCategory(data: unknown): data is ItemCategory {
    if (data === undefined) {
        return false;
    }

    const item = data as ItemCategory;
    return (
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        isListOf(item.subcategories, isItemSubcategory)
    );
}

export interface ItemSubcategory {
    id: string;
    name: string;
    generator: string;
}

export function isItemSubcategory(data: unknown): data is ItemSubcategory {
    if (data == undefined) {
        return false;
    }

    const item = data as ItemSubcategory;
    return (
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.generator === 'string'
    );
}

function isListOf<T>(
    data: unknown,
    guard: (elem: unknown) => elem is T
): data is T[] {
    if (!Array.isArray(data)) {
        return false;
    }

    return data.every(guard);
}

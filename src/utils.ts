/**
 * 
 * @param originalProperty - renames original property name 
 * 
 * @example 'offsetLeft' will now be converted to '_original_offsetLeft_' 
 */
export function getRenamedProperty(originalProperty: string) {
    return `_original_${originalProperty}_`;
}

export function renamePropertyOnElement(entity: any, originalProperty: string) {
    const renamedProperty = getRenamedProperty(originalProperty);
    entity[renamedProperty] = entity[originalProperty];
    return renamedProperty;
}
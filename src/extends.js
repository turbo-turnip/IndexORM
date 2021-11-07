// Check if obj has same properties and types as target object
// Note: optionals is used for properties that are optional and their types
export const _extends = (target, obj, optionals) => {
    const targetKeys = Object.keys(target);
    const objKeys = Object.keys(obj);
    const optionalKeys = Object.keys(optionals);

    // Check for invalid or non-existent keys in obj
    const invalidKeys = objKeys.filter(key => (!targetKeys.includes(key) && !optionalKeys.includes(key)));
    const nonExistentKeys = targetKeys.filter(key => !objKeys.includes(key));
    if (invalidKeys.length > 0 || nonExistentKeys.length > 0) 
        return { invalidKeys: [...invalidKeys, ...nonExistentKeys], invalidTypes: [], extends: false };

    // Check for invalid types in obj
    const invalidTypes = objKeys.filter(key => {
        const optional = optionalKeys.includes(key);
        const targetKey = optional ? optionals[key] : target[key];

        // Check if the key is the right type or instance
        return (typeof targetKey !== 'string') ? (typeof obj[key] !== targetKey || !(obj[key] instanceof targetKey)) : (typeof obj[key] !== targetKey);
    });

    return { invalidKeys: [], invalidTypes, extends: !invalidTypes.length };
}
import { _Entity } from './entity.js';

let requireCalled = 0;

export const _entities = {
    require(entityList) {
        requireCalled++;

        const _this = this;

        // Check if `entities.require` was called multiple times
        if (requireCalled > 1)
            throw Error('`entities.require` can only be called once. If you want to add entities individually, use `entities.add`.');

        // Check if `entityList` is an array
        if (!(entityList instanceof Array))
            throw Error('Paramater passed into `entities.require` must be an array of entities.');

        // Check if each entity in `entityList` extends the `Entity` class
        entityList.forEach(entity => {
            const e = new entity();

            if (!(e instanceof _Entity))
                throw Error('All items in array passed into `entities.requier` must extend the `Entity` class.');

            // Add entity
            _this[e.constructor.name] = e;
        });
    }
};
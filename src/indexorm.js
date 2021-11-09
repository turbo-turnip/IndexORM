import { _connection } from './connection.js';
import * as _types from './types.js';
import { _Entity } from './entity.js';
import { _entities } from './entities.js';

const connection = _connection;
const types = _types;
const Entity = _Entity;
const entities = _entities;
const tables = {};

export {
    connection,
    types,
    Entity,
    entities,
    tables
};
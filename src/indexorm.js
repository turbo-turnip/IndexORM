import { _connection } from './connection.js';
import * as _types from './types.js';
import { _Entity } from './entity.js';
import { _entities } from './entities.js';
import { not, like, lt, gt, gtOrEq, ltOrEq, descend, ascend } from './rowmanipulation.js';

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
    tables,
    like,
    not,
    lt,
    gt,
    gtOrEq,
    ltOrEq,
    ascend,
    descend
};
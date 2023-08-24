import { SequelizeError } from './errors/SequelizeError.error';
import { ScopesOptions } from 'sequelize-typescript';

/**
 * Can add here cache in redis with ttl 30 sec
 */
export async function find<M>(
  repository,
  where,
  include = null,
  options = {},
  scope: ScopesOptions = {},
): Promise<M> {
  let result;
  try {
    let model = repository;

    if (Object.keys(scope).length) {
      model = repository.scope(scope);
    }

    result = await model.findOne({
      ...options,
      where,
      ...(include && { include }),
    });
  } catch (error) {
    throw new SequelizeError(error);
  }

  return result;
}

export async function findAll(
  repository,
  where,
  include = null,
): Promise<object> {
  let result;
  try {
    result = await repository.findAll({
      where,
      ...(include && { include }),
    });
  } catch (error) {
    throw new SequelizeError(error);
  }

  return result;
}

import { SequelizeError } from './errors/SequelizeError.error';
import { ScopesOptions } from 'sequelize-typescript';

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

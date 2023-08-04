import { SequelizeError } from './errors/SequelizeError.error';

export async function find<M>(repository, where, include = null): Promise<M> {
  let result;
  try {
    result = await repository.findOne({ where, ...(include && { include }) });
  } catch (error) {
    throw new SequelizeError(error);
  }

  return result;
}

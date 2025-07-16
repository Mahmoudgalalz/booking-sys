import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ name: 'IsUniqueCombinationConstraint', async: true })
@Injectable()
export class IsUniqueCombinationConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async validate(_: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, columns, currentId, skipCurrentUser } =
      args?.constraints[0];
    let query = this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName);

    columns.forEach((column: string) => {
      const value = (args?.object as any)[column];

      if (typeof value === 'string') {
        query = query.andWhere(`${tableName}.${column} ILIKE :${column}`, {
          [column]: `%${value}%`,
        });
      } else {
        query = query.andWhere(`${tableName}.${column} = :${column}`, {
          [column]: value,
        });
      }
    });

    if (skipCurrentUser && currentId) {
      query = query.andWhere(`${tableName}.id != :currentId`, {
        currentId: (args?.object as any)[currentId],
      });
    }

    const count = await query.getCount();
    return count === 0;
  }

  defaultMessage(args?: ValidationArguments): string {
    const fields = args?.constraints[0].columns.join(', ');
    return `${fields} combination already exists`;
  }
}

export interface IsUniqueCombinationOptions {
  tableName: string;
  columns: string[];
  currentId?: string;
  skipCurrentUser?: boolean;
}

export function isUniqueCombination(
  options: IsUniqueCombinationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueCombinationConstraint,
    });
  };
}

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column, currentId, skipCurrentUser } =
      args?.constraints[0];

    if (value === null || value === undefined || value === '') {
      return true;
    }

    let query = this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where(`${tableName}.${column} = :value`, { value });
    if (skipCurrentUser && currentId) {
      query = query.andWhere(`${tableName}.id != :currentId`, {
        currentId: args?.object[currentId],
      });
    }
    const dataExist = await query.getCount();
    return dataExist === 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string | undefined = validationArguments?.property;
    return `${field} already exists`;
  }
}

export type IsUniqueInterface = {
  tableName: string;
  column: string;
  currentId?: string;
  skipCurrentUser?: boolean;
};

export function isUnique(
  options: IsUniqueInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}

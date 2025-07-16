import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ name: 'MultipleExistsInTableConstraint', async: true })
@Injectable()
export class MultipleExistsInTableConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    const {
      tableName,
      column,
      withDeleted = false,
    }: MultipleExistsInTableOptions = args.constraints[0];

    const ids: any[] = Array.isArray(value) ? value : [value];

    if (ids.length === 0) {
      return true;
    }

    const query = this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where(`${tableName}.${column} = ANY(:ids)`, { ids });

    if (withDeleted) {
      query.withDeleted();
    }

    const count = await query.getCount();

    return count === ids.length;
  }

  defaultMessage(args: ValidationArguments): string {
    const { tableName, column }: MultipleExistsInTableOptions =
      args.constraints[0];
    return `Some of the provided IDs do not exist in the ${tableName} table's ${column} column.`;
  }
}

export interface MultipleExistsInTableOptions {
  tableName: string;
  column: string;
  withDeleted?: boolean;
}

export function MultipleExistsInTable(
  options: MultipleExistsInTableOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MultipleExistsInTable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: MultipleExistsInTableConstraint,
    });
  };
}

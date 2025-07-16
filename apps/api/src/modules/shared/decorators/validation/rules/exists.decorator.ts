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

@ValidatorConstraint({ name: 'IsExistingConstraint', async: true })
@Injectable()
export class IsExistingConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    const ids: any[] = Array.isArray(value) ? value : [value];

    // Convert all ids to numbers and check for NaN
    const numericIds = ids.map((id) => Number(id));
    if (numericIds.some((id) => isNaN(id))) {
      return false; // Invalid number detected
    }

    const { tableName, column }: IsExistingIdsInterface = args?.constraints[0];

    try {
      const foundEntities = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .withDeleted()
        .where(`${tableName}.${column} IN (:...ids)`, { ids: numericIds })
        .getMany();

      return foundEntities.length === numericIds.length;
    } catch (error) {
      // Optionally log the error or handle it as needed
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} contains invalid or non-existing values.`;
  }
}

export type IsExistingIdsInterface = {
  tableName: string;
  column: string;
};

export function isExists(
  options: IsExistingIdsInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsExistingConstraint,
    });
  };
}

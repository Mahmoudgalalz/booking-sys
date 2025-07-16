import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isEmail,
} from 'class-validator';

export function ConditionalIsEmail(
  property: string,
  values: any[],
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'conditionalIsEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, values],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, relatedValues] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValues.includes(relatedValue)) {
            return isEmail(value);
          }
          return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(_args: ValidationArguments) {
          return `Email must be a valid email address`;
        },
      },
    });
  };
}

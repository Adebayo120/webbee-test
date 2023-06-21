import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'GreaterThanOrEqualTo' })
export class GreaterThanOrEqualToRule implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;

    const relatedValue = (args.object as any)[relatedPropertyName] as number;

    return value >= relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `$property has to be greater than or equal to ${args.constraints[0]}`;
  }
}

export function GreaterThanOrEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'GreaterThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: GreaterThanOrEqualToRule,
    });
  };
}

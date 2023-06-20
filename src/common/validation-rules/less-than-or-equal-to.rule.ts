import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'LessThanOrEqualTo' })
export class LessThanOrEqualToRule implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    const relatedValue = (args.object as any)[relatedPropertyName];

    return (
      typeof value === 'number' &&
      typeof relatedValue === 'number' &&
      value <= relatedValue
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `$property has to be less than or equal to ${args.constraints[0]}`;
  }
}

export function LessThanOrEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'LessThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LessThanOrEqualToRule,
    });
  };
}

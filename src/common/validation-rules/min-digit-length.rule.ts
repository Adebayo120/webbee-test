import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MinDigitLength' })
export class MinDigitLengthRule implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [minLength] = args.constraints;

    return value.toString().length >= minLength;
  }

  defaultMessage(args: ValidationArguments) {
    return `$property must not be lesser than ${args.constraints[0]} digit(s)`;
  }
}

export function MinDigitLength(
  property: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MinDigitLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MinDigitLengthRule,
    });
  };
}

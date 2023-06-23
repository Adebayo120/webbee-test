import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsIsoDateString' })
export class IsIsoDateStringRule implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return this.isIsoDate(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `$property is not a valid ISO date string`;
  }

  isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === str;
  }
}

export function IsIsoDateString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsIsoDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIsoDateStringRule,
    });
  };
}

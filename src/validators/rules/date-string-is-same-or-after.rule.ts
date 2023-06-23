import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'DateStringIsSameOrAfter' })
export class DateStringIsSameOrAfterRule
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;

    const relatedValue = (args.object as any)[relatedPropertyName];

    return moment(value).isSameOrAfter(relatedValue);
  }

  defaultMessage(args: ValidationArguments) {
    return `$property has to be same or after ${args.constraints[0]}`;
  }
}

export function DateStringIsSameOrAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DateStringIsSameOrAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: DateStringIsSameOrAfterRule,
    });
  };
}

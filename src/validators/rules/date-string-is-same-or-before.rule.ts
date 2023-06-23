import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'DateStringIsSameOrBefore' })
export class DateStringIsSameOrBeforeRule
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;

    const relatedValue = (args.object as any)[relatedPropertyName];

    return moment(value).isSameOrBefore(relatedValue);
  }

  defaultMessage(args: ValidationArguments) {
    return `$property has to be same or before ${args.constraints[0]}`;
  }
}

export function DateStringIsSameOrBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DateStringIsSameOrBefore',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: DateStringIsSameOrBeforeRule,
    });
  };
}

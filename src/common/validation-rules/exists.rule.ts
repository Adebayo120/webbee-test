import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import dataSource from 'database/data-source';

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    const column =
      args.constraints[1] !== undefined ? args.constraints[1] : args.property;

    !dataSource.isInitialized ? await dataSource.initialize() : null;

    const result = await dataSource
      .getRepository(args.constraints[0])
      .findOneBy({ [column]: id });

    return result ? true : false;
  }

  defaultMessage() {
    return `Invalid $property`;
  }
}

export function Exists(
  entity: new () => any,
  column?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, column],
      validator: ExistsRule,
    });
  };
}

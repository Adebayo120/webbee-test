import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class ExistsRule implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    const column =
      args.constraints[1] !== undefined ? args.constraints[1] : args.property;

    const result = await this.dataSource
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

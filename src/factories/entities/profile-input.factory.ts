import { Factory } from '../factory.abstract';
import { ProfileInput } from './../../appointment/dtos/profile.input';
import { faker } from '@faker-js/faker';

export class ProfileInputFactory extends Factory<ProfileInput> {
  define(): ProfileInput {
    const profileInput = new ProfileInput();
    profileInput.firstName = faker.person.firstName();
    profileInput.lastName = faker.person.lastName();
    profileInput.email = faker.internet.email();

    return profileInput;
  }
}

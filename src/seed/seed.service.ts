import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';
import { User } from 'src/users/entities/user.entity';
import { Product, ProductImage } from 'src/products/entities';

import { initialData } from './data/dummy-data';


@Injectable()
export class SeedService {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,

    @InjectRepository( ProductImage )
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly encryptionService: BcryptAdapter
  ) {}


  async runSeed() {
    await this.deleteTables();

    const superUser = await this.insertUsers();
    await this.insertProducts(superUser);

    return 'Seed executed';
  }


  private async deleteTables() {
    await this.productRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.userRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }


  private async insertUsers() {
    const users: User[] = initialData.users.map( ({ password, ...userRest }) => {
      return this.userRepository.create({
        ...userRest,
        password: this.encryptionService.hashSync(password)
      });
    });

    await this.userRepository.save(users);

    return users[0];
  }


  private async insertProducts( user: User ) {
    
    const products = initialData.products.map( ({ images = [], ...productRest }) => {
      return this.productRepository.create({
        ...productRest,
        images: images.map( url => this.productImageRepository.create({ url }) ),
        user
      });
    });

    await this.productRepository.save( products );
  }

}

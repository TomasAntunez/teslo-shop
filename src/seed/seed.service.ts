import { Injectable } from '@nestjs/common';

import { ProductsService } from 'src/products/products.service';

import { initialData } from './data/dummy-data';


@Injectable()
export class SeedService {

  constructor( private readonly productsService: ProductsService ) {}

  async runSeed() {
    await this.insertProducts();
    return 'Seed executed';
  }

  private async insertProducts() {
    await this.productsService.deleteAllProducts();

    const productsToInsert = initialData.products.map( product => {
      return this.productsService.create(product);
    });

    await Promise.all(productsToInsert);
  }

}

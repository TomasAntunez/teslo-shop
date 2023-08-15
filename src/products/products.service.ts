import {
  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) {}


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productRest } = createProductDto;

      const product = this.productRepository.create({
        ...productRest,
        images: images.map( imageUrl => this.productImageRepository.create({ url: imageUrl }) )
      });
      
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true }
    });

    return products.map( ({ images, ...productRest }) => ({
      ...productRest,
      images: images.map( image => image.url )
    }));
  }


  async findOnePlain( searchTerm: string ) {
    const { images = [], ...productRest } = await this.findOne( searchTerm );
    return {
      ...productRest,
      images: images.map( image => image.url )
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...productRest } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...productRest });

    if (!product) throw new NotFoundException(`Product with id '${id}' not found`);

    // Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } } );

        product.images = images.map( imageUrl => (
          this.productImageRepository.create({ url: imageUrl })
        ));
      }

      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }
  

  async remove(id: string) {
    const { affected } = await this.productRepository.delete({ id });
    if ( affected === 0 ) throw new NotFoundException(`Product with id '${id}' not found`);
  }


  async deleteAllProducts() {
    try {
      return await this.productRepository.createQueryBuilder('prod')
        .delete()
        .where({})
        .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  private async findOne(termSearch: string) {

    let product: Product;

    if ( isUUID(termSearch) ) {
      product = await this.productRepository.findOneBy({ id: termSearch });
    } else {
      product = await this.productRepository.createQueryBuilder('prod')
        .where('LOWER(title) =:title', { title: termSearch.toLowerCase() })
        .orWhere('slug =:slug', { slug: termSearch.toLowerCase() })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne()
    }

    if (!product) throw new NotFoundException(`Product with term '${termSearch}' not found`);

    return product;
  }


  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException(error.detail);
    }
    this.logger.error({ error, from: 'logger' });
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}

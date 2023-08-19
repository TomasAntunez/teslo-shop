import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class FilesService {

  constructor( private readonly configService: ConfigService ) {}


  getProductImage( imageName: string ) {
    const path = join(__dirname, '../../static/products-images', imageName);

    if ( !existsSync(path) ) {
      throw new NotFoundException(`Product image not found with name ${ imageName }`);
    }

    return path;
  }


  saveProductImage( file: Express.Multer.File ) {
    if (!file) throw new BadRequestException('Make sure that the file is an image');
    
    return `${ this.configService.getOrThrow('HOST_API') }/files/product/${ file.filename }`;
  }

}

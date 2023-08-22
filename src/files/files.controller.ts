import { Response } from 'express';
import {
  Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';


@ApiTags('Files')
@Controller('files')
export class FilesController {

  constructor( private readonly filesService: FilesService ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getProductImage(imageName);
    res.sendFile(path);
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter,
    limits: { fileSize: 1000000 },
    storage: diskStorage({
      destination: './static/products-images',
      filename: fileNamer
    })
  }))
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {
    const secureUrl = this.filesService.saveProductImage(file);
    return { secureUrl };
  }

}

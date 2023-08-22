import { Injectable } from "@nestjs/common";
import { compareSync, hashSync } from "bcrypt";

import { EncryptionAdapter } from "../interfaces/encryption-adapter.interface";


@Injectable()
export class BcryptAdapter implements EncryptionAdapter {
  
  hashSync( dataToHash: string, salt: number = 10 ): string {
    return hashSync( dataToHash, salt );
  }

  compareSync(data: string, encrypted: string): boolean {
    return compareSync( data, encrypted );
  }

}

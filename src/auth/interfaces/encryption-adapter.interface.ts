
export interface EncryptionAdapter {
  hashSync( dataToHash: string, salt: number ): string;
  compareSync( data: string, encrypted: string ): boolean;
}

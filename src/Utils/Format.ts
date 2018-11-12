export class Format {
  public static numberUInt32ToHex(value: number): string {
    let result = ((value>>24) & 0xFF).toString(16) + (value & 0xFFFFFF).toString(16); // tslint:disable-line
    while (result.length < 8) {
      result = '0' + result;
    }
    return result.toUpperCase();
  }
}
import * as bcrypt from 'bcrypt';


export class BcryptHelper {
  // Salt rounds for bcrypt hashing
  private static saltRounds = 10;

  /**
   * Hashes a plain text string using bcrypt.
   * @param plainText - The plain text to hash
   * @returns - The hashed string
   */
  
  static async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  /**
   * Compares a plain text string with a hashed string to see if they match.
   * @param plainText - The plain text to compare
   * @param hashedText - The hashed string to compare against
   * @returns - True if the strings match, otherwise false
   */
  static async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
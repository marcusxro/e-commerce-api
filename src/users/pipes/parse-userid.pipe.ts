import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseUseridPipe implements PipeTransform {
  transform(value: string) {
    console.log('Received value:', value); // Debugging log

    // Trim any leading/trailing spaces
    const trimmedValue = value.trim();
    console.log('Trimmed value:', trimmedValue);  // Debug log to see the trimmed value

    // Adjust regex to strictly match the pattern
    const regex = /^user_[a-zA-Z0-9]+$/;  // Allow any number of alphanumeric characters after `user_`


    // Debug log to check if regex test fails or succeeds
    const isValid = regex.test(trimmedValue);
    console.log('Is valid userid format:', isValid);

    if (!isValid) {
      throw new BadRequestException('Invalid userid format. Expected format: user_<32 alphanumeric characters>');
    }

    return trimmedValue;
  }
}

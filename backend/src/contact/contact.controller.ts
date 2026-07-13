import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IsString, IsEmail, IsOptional } from 'class-validator';

class ContactEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  inquiryType: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  message: string;
}

class SaveConfigDto {
  @IsEmail()
  gmailUser: string;

  @IsString()
  gmailPass: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send')
  async sendEmail(@Body() dto: ContactEmailDto) {
    try {
      return await this.contactService.sendContactEmail(dto);
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal server error while sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('config')
  getConfig() {
    return this.contactService.getSMTPConfig();
  }

  @Post('config')
  async saveConfig(@Body() dto: SaveConfigDto) {
    try {
      return await this.contactService.saveSMTPConfig(dto.gmailUser, dto.gmailPass);
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal server error while saving config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    console.log('Ensuring default demo user Face ID registrations exist in MongoDB...');
    const demoEmails = [
      'admin@qualitydesk.io',
      'pm@qualitydesk.io',
      'lead@qualitydesk.io',
      'dev@qualitydesk.io',
      'qa@qualitydesk.io',
      'client@qualitydesk.io',
      'guest@qualitydesk.io'
    ];
    for (const email of demoEmails) {
      try {
        const user = await this.userModel.findOne({ email }).exec();
        if (user && (!user.faceTemplate || user.faceTemplate.trim() === '')) {
          user.faceTemplate = 'seeded_biometric_face_coordinates_approved';
          user.isFaceIdRegistered = true;
          await user.save();
          console.log(`Pre-registered database biometric profile for ${email}`);
        }
      } catch (err) {
        console.error(`Failed to pre-register biometric profile for ${email}:`, err);
      }
    }
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { name, email, password, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new this.userModel({
      name,
      email,
      passwordHash,
      role,
      isVerified: true,
      is2FAEnabled: false,
    });
    const savedUser = await newUser.save();

    // Generate JWT token
    const tokenPayload = { sub: savedUser._id, email: savedUser.email, role: savedUser.role };
    const accessToken = this.jwtService.sign(tokenPayload);

    return {
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
        is2FAEnabled: savedUser.is2FAEnabled,
        createdAt: savedUser.createdAt,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Find the user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password if not using biometric face login
    if (!loginDto.isFaceLogin) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      // Enforce check: user must have a registered face ID template in MongoDB
      if (!user.faceTemplate || user.faceTemplate.trim() === '') {
        throw new UnauthorizedException('No biometric Face ID profile registered for this account');
      }
      user.faceLoginCount = (user.faceLoginCount || 0) + 1;
      await user.save();
    }

    // Generate JWT token
    const tokenPayload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(tokenPayload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        is2FAEnabled: user.is2FAEnabled,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      // Return success to prevent email enumeration attacks, but log internally
      return { success: true, message: 'If the email exists, a verification code has been sent.' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Subject: '[QualityDesk] Password Reset Code',
          Message: `You requested a password reset. Your 6-digit verification code is: ${otp}. This code is valid for 15 minutes.`,
        }),
      });
    } catch (err) {
      console.error('Failed to send forgot password email via FormSubmit:', err);
    }

    return { success: true, message: 'If the email exists, a verification code has been sent.' };
  }

  async resetPassword(dto: { email: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const { email, otp, newPassword } = dto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return { success: true, message: 'Password has been reset successfully.' };
  }

  async updatePassword(userId: string, dto: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new UnauthorizedException('Incorrect current password');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(dto.newPassword, salt);
    await user.save();

    return { success: true, message: 'Password updated successfully.' };
  }

  async registerFace(email: string, faceTemplate: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.faceTemplate = faceTemplate;
    user.isFaceIdRegistered = true;
    await user.save();
    return { success: true, message: 'Biometric face profile registered successfully.' };
  }

  async getFace(email: string): Promise<{ hasFace: boolean; faceTemplate?: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return { hasFace: false };
    }
    return {
      hasFace: !!user.faceTemplate,
      faceTemplate: user.faceTemplate,
    };
  }
}

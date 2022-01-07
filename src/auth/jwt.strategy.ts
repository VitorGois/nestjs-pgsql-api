import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './auth.interface/auth.jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOne(id, {
      select: ['id', 'name', 'email', 'status', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('User unauthorized');
    }

    return user;
  }
}

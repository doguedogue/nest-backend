import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {

  }

  async create(createAuthDto: CreateUserDto): Promise<User> {

    try {
      // Encrypt password
      const { password, ...userData } = createAuthDto;

      const newUser= new this.userModel({
        password: bcryptjs.hashSync( password, 10),
        ...userData
      });

      // Save the user
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();
      return user;

    } catch(error) {

      if(error.code === 11000){
        throw new BadRequestException(` ${createAuthDto.email} already exist!` );
      }else {
        throw new InternalServerErrorException('Something terrible happens');
      }

    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login(loginDto: LoginDto) {
    const { email , password} = loginDto;

    const user:any = await this.userModel.findOne({email});

    if(!user){
      return new UnauthorizedException('Not valid credentials - Email');
    }

    console.log({user});
    if(!bcryptjs.compareSync(password, user.password)) {
      return new UnauthorizedException('Not valid credentials - Password');
    }

    // TODO Generate JWT

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: 'ABC23.fad23234.asdfasf'
    };
  }
}

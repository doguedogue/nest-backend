import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import * as bcryptjs from 'bcryptjs';

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

      // TODO Generate JWT

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
}

import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {

  }

  async create(createAuthDto: CreateUserDto): Promise<User> {

    try {
      const newUser= new this.userModel(createAuthDto);

      // TODO 1. Encrypt password

      // TODO 2. Save the user

      // TODO 3. Generate JWT

      return await newUser.save();

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

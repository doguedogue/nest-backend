import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import * as bcryptjs from 'bcryptjs';
import { RegisterUserDto, UpdateAuthDto, CreateUserDto, LoginDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
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
    return this.userModel.find();
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

    // console.log({user});
    if(!bcryptjs.compareSync(password, user.password)) {
      return new UnauthorizedException('Not valid credentials - Password');
    }

    const { password:_, ...rest } = user.toJSON();

    // Generate JWT
    return {
      user: rest,
      token: this.getJwtToken({id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.create(registerUserDto);

    return {
      user: user,
      token: this.getJwtToken({id: user._id }),
    };
  }
}

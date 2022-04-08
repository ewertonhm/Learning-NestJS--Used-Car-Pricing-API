import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';


@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password);
    }

    @Get('/users')
    listUsers(){
        return this.userService.find();
    }

    @Get('/users/:id')
    listUser(@Param() id: number) {
        return this.userService.findOne(id);
    }
}

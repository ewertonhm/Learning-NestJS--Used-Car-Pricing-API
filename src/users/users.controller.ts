import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';


@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password);
    }

    @UseInterceptors(SerializeInterceptor)
    @Get('/list-users')
    findAllUsers(){
        return this.userService.list();
    }

    @UseInterceptors(SerializeInterceptor)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user =  await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found!');
        }
        return user;
    }

    @UseInterceptors(SerializeInterceptor)
    @Get()
    findUsersByEmail(@Query('email') email: string) {
        return this.userService.findByEmail(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

}

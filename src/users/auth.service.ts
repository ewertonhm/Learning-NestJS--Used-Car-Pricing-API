import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { create } from "domain";

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // see if email is in use
        const users = await this.usersService.findByEmail(email);
        if (users.length){
            throw new BadRequestException('Email in use!');
        }

        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        
        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the has result and the salt togetuer
        const result = salt + '.' + hash.toString('hex');

        // create and save user
        const user = await this.usersService.create(email, result);

        // return user
        return user;

    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.findByEmail(email);
        if (!user){
            throw new NotFoundException('User not fond!');
        }

        const[salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer; 

        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException('Incorret password!');
        }

        return user;
    }
}
import jwt from 'jsonwebtoken';
import IUser from '../types/user/user.type';

export async function signToken(user: IUser) {
    const token = jwt.sign({ _id: user._id?.toString() }, `${process.env.ACCESS_TOKEN_PRIVATE_KEY}`, {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    });
    return token;
}
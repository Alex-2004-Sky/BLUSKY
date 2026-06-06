import { Strategy } from 'passport-jwt';
export declare const JWT_SECRET = "secret";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<any>;
}
export {};

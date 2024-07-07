"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Organisation_1 = __importDefault(require("../models/Organisation"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(422).json({
            errors: [{ field: 'input', message: 'Missing required fields' }],
        });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });
        const organisation = yield Organisation_1.default.create({
            name: `${firstName}'s Organisation`,
            owner_id: user.userId,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Registration unsuccessful', statusCode: 400 });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
    }
    try {
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
    }
});
exports.login = login;

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
exports.addUserToOrganisation = exports.createOrganisation = exports.getOrganisation = exports.getOrganisations = void 0;
const Organisation_1 = __importDefault(require("../models/Organisation"));
const User_1 = __importDefault(require("../models/User"));
const getOrganisations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ status: 'Unauthorized', message: 'User ID is missing', statusCode: 401 });
    }
    try {
        const organisations = yield Organisation_1.default.findAll({ where: { owner_id: userId } });
        res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved',
            data: { organisations },
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Failed to retrieve organisations', statusCode: 400 });
    }
});
exports.getOrganisations = getOrganisations;
const getOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgId } = req.params;
    try {
        const organisation = yield Organisation_1.default.findOne({ where: { orgId } });
        if (!organisation) {
            return res.status(404).json({ status: 'Not found', message: 'Organisation not found', statusCode: 404 });
        }
        res.status(200).json({
            status: 'success',
            message: 'Organisation record found',
            data: organisation,
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Failed to retrieve organisation', statusCode: 400 });
    }
});
exports.getOrganisation = getOrganisation;
const createOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ status: 'Unauthorized', message: 'User ID is missing', statusCode: 401 });
    }
    if (!name) {
        return res.status(400).json({ status: 'Bad request', message: 'Name is required', statusCode: 400 });
    }
    try {
        const organisation = yield Organisation_1.default.create({
            name,
            description,
            owner_id: userId,
        });
        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: organisation,
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Failed to create organisation', statusCode: 400 });
    }
});
exports.createOrganisation = createOrganisation;
const addUserToOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgId } = req.params;
    const { userId } = req.body;
    try {
        const organisation = yield Organisation_1.default.findOne({ where: { orgId } });
        const user = yield User_1.default.findOne({ where: { userId } });
        if (!organisation || !user) {
            return res.status(404).json({ status: 'Not found', message: 'Organisation or User not found', statusCode: 404 });
        }
        // Add logic to associate user with organisation here
        res.status(200).json({ status: 'success', message: 'User added to organisation successfully' });
    }
    catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Failed to add user to organisation', statusCode: 400 });
    }
});
exports.addUserToOrganisation = addUserToOrganisation;

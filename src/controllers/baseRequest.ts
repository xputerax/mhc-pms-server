import express from 'express';
import { JwtPayload } from '../models/auth';

export interface AuthenticatedRequest extends express.Request {
    user: JwtPayload,
}
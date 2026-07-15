import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};

export const checkPermission = (resource: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Basic stub for permissions. In a real app, this should check the user's role/permissions.
    // Assuming req.user contains role or permissions.
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    // Implement permission checking logic here if needed.
    // For now, allow all since we don't have the full role-service logic.
    next();
  };
};

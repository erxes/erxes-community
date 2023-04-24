import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

const { JWT_TOKEN_SECRET = '' } = process.env;

const getAuthUserId = (req: Request) => {
  // const token = res.cookies["auth-token"];
  const token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IkdkblQ2aDlFUXRta25HWE1ZIiwiZW1haWwiOiJlcGljYm9sZEBnbWFpbC5jb20iLCJkZXRhaWxzIjp7ImZ1bGxOYW1lIjoiYm9sZCBuYXJhbnR1eWEiLCJmaXJzdE5hbWUiOiJib2xkIiwibGFzdE5hbWUiOiJuYXJhbnR1eWEifSwiaXNPd25lciI6dHJ1ZSwiZ3JvdXBJZHMiOlsiOUt1ZnJaY0ZLcnBlZmtHTE0iXSwiYnJhbmRJZHMiOltdLCJjb2RlIjoiMDAwIiwiZGVwYXJ0bWVudElkcyI6W119LCJpYXQiOjE2ODIwMzkwODAsImV4cCI6MTY4MjEyNTQ4MH0.j3FIxRtUfqyheMYPW0gqggRVnFCcB47VddwwDeKOpIU';

  const { user }: any = jwt.verify(token, JWT_TOKEN_SECRET);

  return user._id;
};

export default getAuthUserId;

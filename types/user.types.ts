import { UserInterface } from '../src/entities/types/User';
import { StudentsDataInterface } from '../src/entities/types/studentsData';
import { StudnetsRating } from '../src/entities/types/studentsRating';
import { TokenResponse } from './token.types';

// REGISTER
export type UserRegiserData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserRegiserResponse = {
  messege: string;
}

// LOGIN
export type UserLogin = {
  email: string;
  password: string;
}

export type UserLoginResponse = TokenResponse;

// VIEW - STUDENTS LIST
type OmitPropertyOfUser = 'password' | 'token' | 'registerToken' | 'role' | 'bonusProjectUrls';

export type StudentsList = Omit<
  UserInterface & StudnetsRating,
  OmitPropertyOfUser
>
  & Pick<StudentsDataInterface,
    'targetWorkCity' |
    'firstName' |
    'lastName' |
    'expectedTypeWork' |
    'expectedContractType' |
    'expectedSalary' |
    'canTakeApprenticeship' |
    'monthsOfCommercialExp'
  >;

export type StudentsListResponse = Readonly<StudentsList[]>;

// VIEW - STUDENET CV
export type StudentsCVResponse = Readonly<Omit<UserInterface & StudnetsRating & StudentsDataInterface, OmitPropertyOfUser>>

type StudntsToTalkList = StudentsList & Pick<StudentsDataInterface, 'githubUsername' | 'firstName' | 'lastName'>

// VIEW STUDETS TO TALK
export type StudntsToTalkListResposne = StudntsToTalkList[];
import { NextFunction, Request, Response } from "express";
import { Roles } from "../../src/entities/types/Roles";
import { ValidationError } from "../../utils/errorsHandler";
import { myDataSource } from "../../config/database.configuration";
import { StudentsDataInterface } from "../../src/entities/types/studentsData";
import { UserPayloadData } from "../../utils/createTokens";
import { StudentsData } from "../../src/entities/studentsData/studentsData.entity";
import { validate } from "class-validator";
import { createErrorMessage } from "../../utils/createErrorMessage";
import { staticText } from "../../language/en.pl";
import { User } from "../../src/entities/User/User.entity";

type RequestAndPayloadUser = Request & UserPayloadData;

const validationErrorOptions = {
  validationError: {
    target: false
  }
}

export const updateStudentData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = req.user as RequestAndPayloadUser;
    const dataFE = req.body as StudentsDataInterface;

    if (role !== Roles.STUDENT) throw new ValidationError(staticText.validation.AccessDenied, 401);

    const user = await myDataSource
      .getRepository(User)
      .findOneOrFail({ where: { id }, relations: ['studentsData'] });

    if (!user) throw new ValidationError(staticText.validation.InvalidData, 401);
    
    const foundStudentData = await myDataSource.getRepository(StudentsData).findOneBy({ id: user.studentsData.id })
    
    if (!foundStudentData) throw new ValidationError(staticText.validation.InvalidData, 401);

    let item: keyof StudentsDataInterface;

    for (item in dataFE) {
      if (foundStudentData.hasOwnProperty(item) && item !== 'id') {
        (foundStudentData[item] as any) = dataFE[item];
        if (item === 'expectedTypeWork') (foundStudentData[item] as any) = Number(dataFE[item]);
        if (item === 'expectedContractType') (foundStudentData[item] as any) = Number(dataFE[item]);
        if (item === 'canTakeApprenticeship') (foundStudentData[item] as any) = Number(dataFE[item]);
        if (item === 'status') (foundStudentData[item] as any) = Number(dataFE[item]);
      }
    }

    const errors = await validate(foundStudentData, validationErrorOptions);

    if (errors.length) {
      const message = createErrorMessage(errors);

      throw new ValidationError(message, 401);
    }

    const result = await myDataSource
      .createQueryBuilder()
      .update(StudentsData)
      .set({ ...foundStudentData })
      .where('id = :id', { id: foundStudentData.id })
      .execute();

    if (!result) throw new ValidationError(staticText.errors.InternalServerError, 500);

    res.json({ message: 'Done.' });
  } catch (err) {
    next(err);
  }
}

import {
  ERROR_GRADE_REVIEW_NOT_FOUND,
  ERROR_INPUT_DATA_NOT_FOUND,
  ERROR_INVALID_INPUT_DATA,
} from "../constants";
import { GradeReview, GradeReviewComment, ClassMember, Grade } from "../models";

export const getGradeReviewList = async (req, res) => {
  const { classId } = req.params;

  const classMember = await ClassMember.findOne({
    where: {
      classId,
      memberId: req.user.id,
    },
  });

  if (classMember.role === "student") {
    const gradeReviewList = await GradeReview.findAll({
      where: {
        classId,
        studentUserId: req.user.id,
      },
      include: {
        model: GradeReviewComment,
        as: "gradeReviewComments",
        required: false,
      },
    });
    return res.json(gradeReviewList);
  }

  const gradeReviewList = await GradeReview.findAll({
    where: {
      classId,
    },
    include: {
      model: GradeReviewComment,
      as: "gradeReviewComments",
      required: false,
    },
  });
  return res.json(gradeReviewList);
};

export const addGradeReview = async (req, res) => {
  const { classId } = req.params;
  const studentUserId = req.user.id;
  const { studentExplanation, currentGrade, expectedGrade, assignmentId } =
    req.body;

  if (!studentExplanation || !currentGrade || !expectedGrade || !assignmentId) {
    res.status(400);
    throw new Error(ERROR_INVALID_INPUT_DATA);
  }

  const createdGradeReview = await GradeReview.create({
    classId,
    studentUserId,
    studentExplanation,
    currentGrade,
    expectedGrade,
    assignmentId,
    status: "pending",
    finalGrade: null,
  });

  return res.json(createdGradeReview);
};

export const getGradeReview = async (req, res) => {
  const { gradeReviewId } = req.params;
  const gradeReview = await GradeReview.findByPk(gradeReviewId, {
    include: {
      model: GradeReviewComment,
      as: "gradeReviewComments",
      required: false,
    },
  });
  if (!gradeReview) {
    res.status(404);
    throw new Error(ERROR_GRADE_REVIEW_NOT_FOUND);
  }
  return res.json(gradeReview);
};

export const updateGradeReview = async (req, res) => {
  const { gradeReviewId } = req.params;
  const { finalGrade } = req.body;

  const gradeReview = await GradeReview.findByPk(gradeReviewId, {
    include: {
      model: User,
      as: "studentUser",
      required: true,
    },
  });
  if (!gradeReview) {
    res.status(404);
    throw new Error(ERROR_GRADE_REVIEW_NOT_FOUND);
  }

  if (finalGrade !== gradeReview.finalGrade) {
    const grade = await Grade.findOne({
      where: {
        assignmentId: gradeReview.assignmentId,
        userId: gradeReview.studentUser.id,
      },
    });
    await grade.update({
      gradeValue: finalGrade,
    });
  }
  await gradeReview.update(req.body);

  return res.json(gradeReview);
};

export const addGradeReviewComment = async (req, res) => {
  const { gradeReviewId } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error(ERROR_INPUT_DATA_NOT_FOUND);
  }

  const createdGradeReviewComment = await GradeReviewComment.create({
    gradeReviewId,
    content,
    userId: req.user.id,
  });

  return res.json(createdGradeReviewComment);
};
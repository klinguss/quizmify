import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity";
//npm i string-similarity + npm i --save-dev @types/string-similarity
export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { questionId, userAnswer } = checkAnswerSchema.parse(body)
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            return NextResponse.json(
                {
                    error: "Question not found",
                },
                {
                    status: 404,
                }
            );
        }
        await prisma.question.update({
            where: { id: questionId },
            data: {
                userAnswer
            }
        })
        if (question.questionType === 'mcq') {
            const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
            await prisma.question.update({
                where: { id: questionId },
                data: {
                    isCorrect,
                }
            });
            return NextResponse.json({
                isCorrect,
            }, { status: 200 });
        } else if (question.questionType === 'open_ended') {
            let percentageSlimilar = compareTwoStrings(userAnswer.toLowerCase().trim(), question.answer.toLowerCase().trim());
            percentageSlimilar = Math.round(percentageSlimilar * 100);
            await prisma.question.update({
                where: { id: questionId },
                data: {
                    percentageCorrect: percentageSlimilar
                },
            });
            return NextResponse.json(
                {
                    percentageSlimilar,
                }, { status: 200 }
            );
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.issues,
                },
                {
                    status: 400,
                }
            );
        }
    }
}
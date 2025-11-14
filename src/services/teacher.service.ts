import type { PrismaClient } from '@prisma/client'
import type { Teacher } from '../types/teacher'

type CreateTeacherInput = Omit<Teacher, 'id' | 'registrationDate' | 'updateDate'>

export interface TeacherService {
  getAll: () => Promise<any[]>;
  getById: (id: number) => Promise<any | null>;
  create: (data: CreateTeacherInput) => Promise<any>;
  update: (id: number, data: Partial<CreateTeacherInput>) => Promise<any | null>;
  delete: (id: number) => Promise<boolean>;
}

export function createTeacherService(prisma: PrismaClient): TeacherService {
  return {
    async getAll() {
      return prisma.teacher.findMany()
    },

    async getById(id: number) {
      return prisma.teacher.findUnique({
        where: { id },
      })
    },

    async create(data: CreateTeacherInput) {
      return prisma.teacher.create({ data })
    },

    async update(id: number, data: Partial<CreateTeacherInput>) {
      try {
        const updatedTeacher = await prisma.teacher.update({
          where: { id },
          data,
        })
        return updatedTeacher
      } catch (error) {
        return null
      }
    },

    async delete(id: number) {
      try {
        await prisma.teacher.delete({
          where: { id },
        })
        return true
      } catch (error) {
        return false
      }
    },
  }
}
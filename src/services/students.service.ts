import type { PrismaClient } from '@prisma/client'
import type { Student } from '../types/student.js'

type CreateStudentInput = Omit<Student, 'id'>

export interface StudentService {
  getAll: () => Promise<any[]>;
  getById: (id: number) => Promise<any | null>;
  create: (data: CreateStudentInput) => Promise<any>;
  update: (id: number, data: Partial<CreateStudentInput>) => Promise<any | null>;
  delete: (id: number) => Promise<boolean>;
}

export function createStudentService(prisma: PrismaClient): StudentService {
  return {
    async getAll() {
      return prisma.student.findMany()
    },

    async getById(id: number) {
      return prisma.student.findUnique({
        where: { id },
      })
    },

    async create(data: CreateStudentInput) {
      return prisma.student.create({ data })
    },

    async update(id: number, data: Partial<CreateStudentInput>) {
      try {
        const updatedStudent = await prisma.student.update({
          where: { id },
          data,
        })
        return updatedStudent
      } catch (error) {
        return null
      }
    },

    async delete(id: number) {
      try {
        await prisma.student.delete({
          where: { id },
        })
        return true
      } catch (error) {
        return false
      }
    },
  }
}
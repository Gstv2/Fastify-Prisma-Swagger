import type { FastifyInstance } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { createStudentController } from '../controllers/students.controller.js'
import { createStudentService } from '../services/students.service.js'
import type { Student } from '../types/student.js'

// --- Schemas JSON para Swagger ---
const baseProps = {
  name: { type: 'string', description: 'Nome completo do aluno' },
  email: { type: 'string', format: 'email', description: 'Email do aluno (único)' },
  course: { type: 'string', description: 'Curso do aluno' },
  enrollmentYear: { type: 'number', description: 'Ano de matrícula', minimum: 1990, maximum: 2100 }
}

const studentBaseSchemaFixed = {
  type: 'object',
  properties: baseProps,
  required: ['name', 'email', 'course', 'enrollmentYear'],
  additionalProperties: false
}

const studentResponseSchemaFixed = {
  type: 'object',
  properties: {
    id: { type: 'number', description: 'ID único gerado pelo sistema' },
    ...baseProps
  },
  required: ['id', ...studentBaseSchemaFixed.required],
  additionalProperties: false
}

const studentsArraySchemaFixed = {
  type: 'array',
  items: studentResponseSchemaFixed
}

const errorResponseSchemaFixed = {
  type: 'object',
  properties: {
    error: { type: 'string', description: 'Mensagem de erro' }
  },
  required: ['error']
}

const idParamSchemaFixed = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID do aluno. Deve ser um número inteiro.' }
  },
  required: ['id']
}


export async function studentRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  // 1. Cria o Service e o Controller com a instância do Prisma injetada
  const studentService = createStudentService(options.prisma)
  const studentController = createStudentController(studentService)

  const commonTags = ['Students']

  // Rota: GET /students (Listar todos)
  app.get('/students', {
    schema: {
      description: 'Retorna a lista de todos os alunos cadastrados.',
      tags: commonTags,
      summary: 'Lista todos os alunos',
      response: {
        200: studentsArraySchemaFixed
      }
    }
  }, studentController.list)

  // Rota: GET /students/:id (Obter por ID)
  app.get<{ Params: { id: string } }>('/students/:id', {
    schema: {
      description: 'Retorna um aluno específico pelo seu ID.',
      tags: commonTags,
      summary: 'Obter aluno por ID',
      params: idParamSchemaFixed,
      response: {
        200: studentResponseSchemaFixed,
        404: errorResponseSchemaFixed
      }
    }
  }, studentController.get)

  // Rota: POST /students (Criar novo)
  app.post<{ Body: Omit<Student, 'id'> }>('/students', {
    schema: {
      description: 'Cria um novo aluno no sistema.',
      tags: commonTags,
      summary: 'Criar novo aluno',
      body: studentBaseSchemaFixed,
      response: {
        201: studentResponseSchemaFixed,
        409: {
            ...errorResponseSchemaFixed,
            description: 'Conflito (E-mail já cadastrado)'
        }
      }
    }
  }, studentController.create)

  // Rota: PUT /students/:id (Atualizar)
  app.put<{ Params: { id: string }, Body: Partial<Omit<Student, 'id'>> }>('/students/:id', {
    schema: {
      description: 'Atualiza os dados de um aluno existente. O body aceita dados parciais.',
      tags: commonTags,
      summary: 'Atualizar aluno por ID',
      params: idParamSchemaFixed,
      body: {
        ...studentBaseSchemaFixed,
        required: [] as string[]
      },
      response: {
        200: studentResponseSchemaFixed,
        404: errorResponseSchemaFixed
      }
    }
  }, studentController.update)

  // Rota: DELETE /students/:id (Remover)
  app.delete<{ Params: { id: string } }>('/students/:id', {
    schema: {
      description: 'Remove um aluno específico do sistema pelo seu ID.',
      tags: commonTags,
      summary: 'Remover aluno por ID',
      params: idParamSchemaFixed,
      response: {
        204: {
          type: 'null',
          description: 'Sucesso, sem conteúdo de retorno'
        },
        404: errorResponseSchemaFixed
      }
    }
  }, studentController.remove)
}
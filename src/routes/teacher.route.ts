import type { FastifyInstance } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { createTeacherController } from '../controllers/teacher.controller.js'
import { createTeacherService } from '../services/teacher.service.js'
import type { Teacher } from '../types/teacher.js'

// --- Schemas JSON para Swagger ---
const teacherBaseSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Nome completo do professor' },
    email: { type: 'string', format: 'email', description: 'E-mail institucional (único)' },
    course: { type: 'string', description: 'Curso vinculado' },
  },
  required: ['name', 'email', 'course'],
  additionalProperties: false
}

const teacherResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', description: 'ID único gerado pelo sistema' },
    name: { type: 'string', description: 'Nome completo do professor' },
    email: { type: 'string', format: 'email', description: 'E-mail institucional (único)' },
    course: { type: 'string', description: 'Curso vinculado' },
    registrationDate: { type: 'string', format: 'date-time', description: 'Data de cadastro' },
    updateDate: { type: 'string', format: 'date-time', description: 'Data da última atualização (automática)' },
  },
  required: ['id', 'name', 'email', 'course', 'registrationDate', 'updateDate'],
  additionalProperties: false
}

const teachersArraySchema = {
  type: 'array',
  items: teacherResponseSchema
}

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', description: 'Mensagem de erro' }
  },
  required: ['error']
}

const idParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'ID do professor. Deve ser um número inteiro.' }
  },
  required: ['id']
}

export async function teacherRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  // 1. Cria o Service e o Controller com a instância do Prisma injetada
  const teacherService = createTeacherService(options.prisma)
  const teacherController = createTeacherController(teacherService)

  const commonTags = ['Teachers']

  // Rota: GET /teachers (Listar todos)
  app.get('/teachers', {
    schema: {
      description: 'Retorna a lista de todos os professores cadastrados.',
      tags: commonTags,
      summary: 'Lista todos os professores',
      response: {
        200: teachersArraySchema
      }
    }
  }, teacherController.list)

  // Rota: GET /teachers/:id (Obter por ID)
  app.get<{ Params: { id: string } }>('/teachers/:id', {
    schema: {
      description: 'Retorna um professor específico pelo seu ID.',
      tags: commonTags,
      summary: 'Obter professor por ID',
      params: idParamSchema,
      response: {
        200: teacherResponseSchema,
        404: errorResponseSchema
      }
    }
  }, teacherController.get)

  // Rota: POST /teachers (Criar novo)
  app.post<{ Body: Omit<Teacher, 'id' | 'registrationDate' | 'updateDate'> }>('/teachers', {
    schema: {
      description: 'Cria um novo professor no sistema. As datas de registro e atualização são definidas automaticamente.',
      tags: commonTags,
      summary: 'Criar novo professor',
      body: teacherBaseSchema,
      response: {
        201: teacherResponseSchema,
        409: {
            ...errorResponseSchema,
            description: 'Conflito (E-mail já cadastrado)'
        }
      }
    }
  }, teacherController.create)

  // Rota: PUT /teachers/:id (Atualizar)
  app.put<{ Params: { id: string }, Body: Partial<Omit<Teacher, 'id' | 'registrationDate' | 'updateDate'>> }>('/teachers/:id', {
    schema: {
      description: 'Atualiza os dados de um professor existente. O body aceita dados parciais. A data de atualização (updateDate) é atualizada automaticamente.',
      tags: commonTags,
      summary: 'Atualizar professor por ID',
      params: idParamSchema,
      body: {
        ...teacherBaseSchema,
        required: [] as string[]
      },
      response: {
        200: teacherResponseSchema,
        404: errorResponseSchema
      }
    }
  }, teacherController.update)

  // Rota: DELETE /teachers/:id (Remover)
  app.delete<{ Params: { id: string } }>('/teachers/:id', {
    schema: {
      description: 'Remove um professor específico do sistema pelo seu ID.',
      tags: commonTags,
      summary: 'Remover professor por ID',
      params: idParamSchema,
      response: {
        204: {
          type: 'null',
          description: 'Sucesso, sem conteúdo de retorno'
        },
        404: errorResponseSchema
      }
    }
  }, teacherController.remove)
}
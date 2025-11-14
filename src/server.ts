import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { studentRoutes } from './routes/students.routes.js'
import { teacherRoutes } from './routes/teacher.route.js'

// 1. Inicializa o Cliente Prisma (Singleton) no ponto de entrada
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const app = Fastify({ logger: true })

// 2. Registra o hook para desconectar o Prisma ao fechar o servidor
app.addHook('onClose', async () => {
  app.log.info('Fechando conexão com o banco de dados...')
  await prisma.$disconnect()
})

// Configuração e registro do Swagger
app.register(swagger, {
  openapi: {
    info: {
      title: 'API de Gerenciamento de Alunos e Professores (Prisma)',
      description: 'Documentação da API CRUD de alunos e professores com Fastify, TypeScript e persistência via Prisma/SQLite.',
      version: '1.0.0'
    }
  }
})

// Configuração e registro do Swagger UI
app.register(swaggerUi, {
  routePrefix: '/documentation'
})

// 3. Registro das rotas, injetando o cliente Prisma
app.register(studentRoutes, { prisma })
app.register(teacherRoutes, { prisma })

app.listen({ port: 3333 })
  .then(address => {
    console.log(`🚀 Servidor rodando em: ${address}`)
    console.log(`📝 Documentação Swagger em: ${address}/documentation`)
  })
  .catch(err => {
    app.log.error(err)
    process.exit(1)
  })
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { TeacherService } from '../services/teacher.service'
import type { Teacher } from '../types/teacher.js'

type CreateTeacherBody = Omit<Teacher, 'id' | 'registrationDate' | 'updateDate'>
type UpdateTeacherBody = Partial<CreateTeacherBody>

export function createTeacherController(teacherService: TeacherService) {
    return {
        async list(_req: FastifyRequest, reply: FastifyReply) {
            return reply.send(await teacherService.getAll())
        },

        async get(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const teacher = await teacherService.getById(Number(id))
            if (!teacher) return reply.status(404).send({ error: 'Professor não encontrado' })
            return reply.send(teacher)
        },

        async create(req: FastifyRequest, reply: FastifyReply) {
            const data = req.body as CreateTeacherBody
            
            try {
                const newTeacher = await teacherService.create(data)
                return reply.status(201).send(newTeacher)
            } catch (error) {
                if (error.code === 'P2002') {
                    return reply.status(409).send({ error: 'E-mail já cadastrado.' })
                }
                console.error(error)
                return reply.status(500).send({ error: 'Erro interno ao criar professor.' })
            }
        },

        async update(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const data = req.body as UpdateTeacherBody
            
            const updated = await teacherService.update(Number(id), data)
            if (!updated) return reply.status(404).send({ error: 'Professor não encontrado' })
            return reply.send(updated)
        },

        async remove(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const deleted = await teacherService.delete(Number(id))
            if (!deleted) return reply.status(404).send({ error: 'Professor não encontrado' }) 
            return reply.status(204).send()
        }
    }
}
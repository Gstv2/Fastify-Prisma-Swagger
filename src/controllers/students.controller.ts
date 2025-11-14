import type { FastifyReply, FastifyRequest } from 'fastify'
import type { StudentService } from '../services/students.service.js'
import type { Student } from '../types/student.js' 

type CreateStudentBody = Omit<Student, 'id'>
type UpdateStudentBody = Partial<CreateStudentBody>

export function createStudentController(studentService: StudentService) {
    return {
        async list(_req: FastifyRequest, reply: FastifyReply) {
            return reply.send(await studentService.getAll())
        },

        async get(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const student = await studentService.getById(Number(id))
            if (!student) return reply.status(404).send({ error: 'Aluno não encontrado' })
            return reply.send(student)
        },

        async create(req: FastifyRequest, reply: FastifyReply) {
            const data = req.body as CreateStudentBody
            try {
                const newStudent = await studentService.create(data)
                return reply.status(201).send(newStudent)
            } catch (error) {
                if (error.code === 'P2002') {
                    return reply.status(409).send({ error: 'E-mail já cadastrado.' })
                }
                console.error(error)
                return reply.status(500).send({ error: 'Erro interno ao criar aluno.' })
            }
        },

        async update(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const data = req.body as UpdateStudentBody
            const updated = await studentService.update(Number(id), data)
            if (!updated) return reply.status(404).send({ error: 'Aluno não encontrado' })
            return reply.send(updated)
        },

        async remove(req: FastifyRequest, reply: FastifyReply) {
            const { id } = req.params as { id: string }
            const deleted = await studentService.delete(Number(id))
            if (!deleted) return reply.status(404).send({ error: 'Aluno não encontrado' }) 
            return reply.status(204).send()
        }
    }
}
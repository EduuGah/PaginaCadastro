import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

app.post('/users', async (req, res) => {

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)
})

app.put('/users/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)
})

app.delete('/users/:id', async (req, res) => {

    const user = await prisma.user.findUnique({
        where: { id: req.params.id }
    });

    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(204).json({ message: `Usuário ${user.name} deletado com sucesso!` });
    console.log(`Usuário ${user.name} deletado com sucesso!`);

})

app.get('/users', async (req, res) => {

    if(req.query.name) {
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: req.query.name
                }
            }
        })

        res.status(200).json(users)
        return
    }else{
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    }

})

app.get('/', (req, res) => {
    res.send('Página principal!')
})

app.listen(3000, () => {
    console.log('Servidor está na porta 3000')
})




// edugah, iqBU8MIqCGnATEuc
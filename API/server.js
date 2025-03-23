import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// Criar usuário
app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(201).json(user);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "E-mail já cadastrado!" });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Atualizar usuário
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(200).json(user);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Deletar usuário
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        await prisma.user.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ message: `Usuário ${user.name} deletado com sucesso!` });
        console.log(`Usuário ${user.name} deletado com sucesso!`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// Buscar usuários
app.get('/users', async (req, res) => {
    try {
        let users;
        if (req.query.name) {
            users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: req.query.name
                    }
                }
            });
        } else {
            users = await prisma.user.findMany();
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.send('Página principal!');
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000 🚀');
});

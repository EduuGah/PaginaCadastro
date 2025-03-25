import './style.css'
import { useEffect, useState, useRef } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'

function Login() {
    const [users, setUsers] = useState([])

    const inputName = useRef()
    const inputEmail = useRef()

    async function getUsers() {
        try {
            const usersFromApi = await api.get('/users')
            setUsers(usersFromApi.data)
        } catch (error) {
            console.error("Erro ao carregar os usuários:", error)
            alert('Erro ao carregar os usuários')
        }
    }

    useEffect(() => {
        getUsers() 
    }, [])

    async function logar() {
        const name = inputName.current.value.trim()
        const email = inputEmail.current.value.trim()

        if (name === '' || email === '') {
            alert('Preencha todos os campos')
            return
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('Email inválido')
            return
        }

        const emailExists = users.some(user => user.email === email)
        const nameExists = users.some(user => user.name === name)

        if (!emailExists || !nameExists) {
            alert('Usuário não cadastrado')
            return
        }

        inputName.current.value = ""
        inputEmail.current.value = ""

        alert('Usuário logado com sucesso')
    }

    return (
        <div className='container'>
            <div className='Cadastro'>
                <button><Link to='/' className='linkCadastro'>Cadastro</Link></button>
            </div>
            <form>
                <h1>Login de Usuários</h1>
                <input name='Nome' type='text' placeholder='Nome' autoComplete="off" ref={inputName} />
                <input name='Email' type='email' placeholder='Email' autoComplete="off" ref={inputEmail} />
                <button type='button' onClick={() => logar()}>LOGIN</button>
            </form>
        </div>
    )
}

export default Login

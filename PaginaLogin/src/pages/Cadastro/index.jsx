import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/DELETAR.png'
import Edit from '../../assets/EDITAR.png'
import api from '../../services/api'
import { Link } from 'react-router-dom'

function Cadastro() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) // Estado para armazenar o usuário em edição
  const [editedName, setEditedName] = useState("")
  const [editedAge, setEditedAge] = useState("")
  const [editedEmail, setEditedEmail] = useState("")

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/users')
    setUsers(usersFromApi.data)
  }

  async function createUsers() {
    const name = inputName.current.value.trim()
    const age = inputAge.current.value.trim()
    const email = inputEmail.current.value.trim()

    if (name === '' || age === '' || email === '') {
      alert('Preencha todos os campos')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Email inválido')
      return
    }

    const emailExists = users.some(user => user.email === email)
    if (emailExists) {
      alert('E-mail já cadastrado')
      return
    }

    try {
      await api.post('/users', { name, age: age, email })
      getUsers()

      inputName.current.value = ""
      inputAge.current.value = ""
      inputEmail.current.value = ""
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      alert('Erro ao cadastrar usuário')
    }
  }

  async function deleteUsers(id) {
    await api.delete(`/users/${id}`)
    getUsers()
  }

  function startEditing(user) {
    setEditingUser(user)
    setEditedName(user.name)
    setEditedAge(user.age)
    setEditedEmail(user.email)
  }

  async function saveEdit() {
    if (!editedName || !editedAge || !editedEmail) {
      alert('Preencha todos os campos')
      return
    }

    try {
      await api.put(`/users/${editingUser.id}`, {
        name: editedName,
        age: editedAge,
        email: editedEmail
      })
      getUsers()
      setEditingUser(null) 
    } catch (error) {
      console.error("Erro ao editar usuário:", error)
      alert('Erro ao editar usuário')
    }
  }

  useEffect(() => {
    getUsers()
  }, [])


  return (
    <div className='container'>
      <div className='Login'>
        <button><Link to='/Login' className='linkLogin'>Login</Link></button>
      </div>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input name='Nome' type='text' placeholder='Nome' ref={inputName} autoComplete="off"/>
        <input name='Idade' type='number' placeholder='Idade' ref={inputAge} autoComplete="off"/>
        <input name='Email' type='email' placeholder='Email' ref={inputEmail} autoComplete="off"/>
        <button type='button' onClick={() => createUsers()}>CADASTRAR</button>
      </form>

      {editingUser && (
        <div className="edit-form">
          <h2>Editando Usuário</h2>
          <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
          <input type="number" value={editedAge} onChange={(e) => setEditedAge(e.target.value)} />
          <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
          <button onClick={saveEdit}>Salvar</button>
          <button onClick={() => setEditingUser(null)}>Cancelar</button>
        </div>
      )}

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <div className="buttons">
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trash} />
            </button>
            <button onClick={() => startEditing(user)}>
              <img src={Edit} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cadastro

import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/DELETAR.png'
import api from '../../services/api'

function Home() {
const [users, setUsers] = useState([])

const inputName = useRef()
const inputAge = useRef()
const inputEmail = useRef()

  async function getUsers(){
    const usersFromApi = await api.get('/users')
    
    setUsers(usersFromApi.data)
  }
  async function createUsers(){
    await api.post('/users', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    getUsers()
  }
  async function deleteUsers(id){
    await api.delete(`/users/${id}`)

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }
  , [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input name='Nome' type='text' placeholder='Nome' ref={inputName}/>
        <input name='Idade' type='number' placeholder='Idade' ref={inputAge}/>
        <input name='Email' type='email' placeholder='Email' ref={inputEmail}/>
        <button type='button' onClick={createUsers}>CADASTRAR</button>
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>

          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home

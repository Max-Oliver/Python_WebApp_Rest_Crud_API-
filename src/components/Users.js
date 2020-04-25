import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BACKEND = process.env.REACT_APP_BACKEND;

export const Users = () => {
  // User status value.
  // Le react hook nos permite cambiarle el estado a estas variables por medio de setX metodo
  // Lo inicializamos vacio para despues en el correr de la ejecucion tomen sus respectivos valores.
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [editing, setEditing] = useState(false);

  const [_id, setId] = useState(false);

  const [users, setUsers] = useState([]);

  // Creo un handler de un evento.
  const handleSubmit = (event) => {
    // Logueo lo que hay en el evento que cambiara el estado del componente
    event.preventDefault();

    // Instancio el Metodo para crear un usuario al capturar el evento.
    createUser();
  };

  // Methodo de creacion de usuario
  const createUser = async () => {
    if (!editing) {
      const response = await axios.post(`${API_BACKEND}/users`, {
        name: name,
        email: email,
        password: password,
      });
      console.log('Response created on createUserMehtod', response);
    } else {
      const response = await axios.put(`${API_BACKEND}/users/${_id}`, {
        name: name,
        email: email,
        password: password,
      });
      console.log('Response updated user ', response);
      setEditing(false);
      setId('');
    }

    // Cargamos la lista de usuarios denuevo
    await getUsers();

    setName('');
    setEmail('');
    setPassword('');
  };

  // Methodo de creacion de usuario
  // Solo para recordar que tengo un endpoint de guardado o Update PUT en el Backend
  //const response = await axios.put(`${API_BACKEND}/users/${id}`, {});
  const updateUser = async (id) => {
    const response = await axios.get(`${API_BACKEND}/users/${id}`, {});
    console.log('user response by id -> ', response.data);
    // Aclaramos que queremos editar cambiandole el estado de esta variable para validarl en el formulario
    setEditing(true);
    // Se guarda el ID del usuario a actualizar para poder validar que tipo de operacion se esta ejecutando put or post
    setId(id);

    // Podria realizar el update seteandole denuevo los valores a los Inputs y que se guarde como nuevo usuario
    setName(response.data.name);
    setEmail(response.data.email);
    setPassword(response.data.password);
  };

  // Metodo para eleminar usuarios de la base de datos pasando parametro ID
  //const getUser = async (id) => {
  //  const response = await axios.get(`${API_BACKEND}/users/${id}`, {});
  //  return response;
  //};

  // Metodo para obtener todos los usuarios de la base de datos
  const getUsers = async () => {
    const list_users = await axios.get(`${API_BACKEND}/users`, {});
    // la lista viene enpaquetada en un objecto data
    console.log('List of users_data: ', list_users.data);
    setUsers(list_users.data);
  };

  // Metodo para eleminar usuarios de la base de datos pasando parametro ID
  const deleteUser = async (id) => {
    const userResponse = window.confirm('Seguro quiere eliminar este usuario?');
    if (userResponse === true) {
      const response = await axios.delete(`${API_BACKEND}/users/${id}`, {});
      console.log('User deleted successfully: ', response);

      // Cargamos la lista de usuarios denuevo
      await getUsers();
    }
  };

  useEffect(() => {
    // Objtengo el listado de usuarios.
    getUsers();
  }, []);

  return (
    <div className='row '>
      <div className='col-md-4'>
        <form onSubmit={handleSubmit} className='card card-body'>
          <div className='form-group'>
            <input
              type='text'
              onChange={(event) => setName(event.target.value)}
              value={name}
              className='form-control'
              placeholder='name'
              autoFocus
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              className='form-control'
              placeholder='email'
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className='form-control'
              placeholder='password'
            />
          </div>
          <button className='btn btn-primary btn-block pt-0.5 mt-3'>
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
      <div className='col-md-6'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className='btn btn-secondary btn-sm btn-block'
                    onClick={() => updateUser(user._id)}>
                    Edit
                  </button>
                  <button
                    className='btn btn-danger btn-sm btn-block'
                    onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

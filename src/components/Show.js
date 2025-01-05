import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//import { async } from '@firebase/util'
const MySwal = withReactContent(Swal)

const Show = () => {
  //1 - configuramos los hooks
  const [reservaciones, setReservaciones] = useState( [] )

  //2 - referenciamos a la DB firestore
  const reservacionesCollection = collection(db, "reservaciones")

  //3 - Funcion para mostrar TODOS los docs
  const getReservaciones = async ()   => {
   const data = await getDocs(reservacionesCollection)
   //console.log(data.docs)
   setReservaciones(
       data.docs.map( (doc) => ( {...doc.data(),id:doc.id}))
   )
   //console.log(reservaciones)
  }

  //4 - Funcion para eliminar un doc
  const deleteReservaciones = async (id) => {
   const reservacionesDoc = doc(db, "reservaciones", id)
   await deleteDoc(reservacionesDoc)
   getReservaciones()
  }

  //5 - Funcion de confirmacion para Sweet Alert 2
  const confirmDelete = (id) => {
    MySwal.fire({
      title: '¿Eliminar la reservación?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) { 
        //llamamos a la funcion para eliminar   
        deleteReservaciones(id)               
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })    
  }

  //6 - usamos useEffect
  useEffect( () => {
    getReservaciones()
    // eslint-disable-next-line
  }, [] )

  //7 - devolvemos vista de nuestro componente
  return (
    <>
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <div className="d-grid gap-2">
            <Link to="/create" className='btn btn-secondary mt-2 mb-2'>Create</Link>    
          </div>
          <table className='table table-dark table-hover'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Fecha</th>
                <th>Número de personas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              { reservaciones.map( (reservaciones) => (
                <tr key={reservaciones.id}>
                  <td>{reservaciones.nombre}</td>
                  <td>{reservaciones.correo}</td>
                  <td>{reservaciones.telefono}</td>
                  <td>{reservaciones.fecha}</td>
                  <td>{reservaciones.personas}</td>
                  <td>
                    <Link to={`/edit/${reservaciones.id}`} className="btn btn-light"><i className="fa-solid fa-pencil"></i></Link>
                    <button onClick={ () => { confirmDelete(reservaciones.id) } } className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>                
              )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}

export default Show

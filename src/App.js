import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

function App() {
    const [employees, setEmployees] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const [update, setUpdate] = useState(false);
    const {register, handleSubmit} = useForm();

    useEffect(()=> {
        //Fetch the employees list from MongoDB
        axios.get('http://localhost:8080/api/GET')
        .then(res => {
            // Handle success response
            setEmployees(prevState => (res.data.data))
            console.log(res.data.data);
            console.log(requestCount)
          })
          .catch(error => {
            // Handle error
            console.log(`Load employees list ${error}`);
          })
    }, [requestCount])

    //Add new employees to the DB, using Hook Form to catch
    //the form input values
    const addEmployee =(data, e) => {
        e.preventDefault();
        if(data){
            axios.post('http://localhost:8080/api/POST', data)
            .then((res => {
                alert(`${data.name} was added to the employees list.`)
                setRequestCount(requestCount+1);
            }))
            .catch(err => {
                console.log(`Unable to add new employee ${err}`)
            })
        }
        e.target.reset();
    }

    //Edit and update the employee row
    const editEmployee = (e) => {
        let editableEmployee = document.querySelector(`[e_id="${e.currentTarget.value}"]`)
        let editableFields = editableEmployee.querySelectorAll('[type]')
        for( let i =0; i < editableFields.length; i++) {
            if(update){
                axios.post("http://localhost:8080/api/UPDATE/", {
                    id: e.currentTarget.value,
                    name: editableEmployee.querySelector(`[type="name"]`).innerHTML,
                    salary: editableEmployee.querySelector(`[type="salary"]`).innerHTML,
                    age: editableEmployee.querySelector(`[type="age"]`).innerHTML
                }).then(res =>{
                    setRequestCount(requestCount+1);
                })
                    .catch(err => err);
                editableFields[i].contentEditable= false;
                e.currentTarget.innerText="Edit";
                e.currentTarget.classList.remove('AdministrationPanel__done');
                setUpdate(false);
            }   else {
                editableFields[i].contentEditable= true;
                editableFields[0].focus();
                e.currentTarget.innerText="Done";
                e.currentTarget.classList.add('AdministrationPanel__done');
                setUpdate(true);
            }
        }
    }

    //Delete an employee from DB
    const deleteEmployee = (e) => {
        axios.delete("http://localhost:8080/api/DELETE/", {
                data:{
                    id: e.currentTarget.value
                }
        })
        .then(res =>{
            setRequestCount(requestCount+1);
        })
            .catch(err => err);;
    }

    return (
        <div className="AdministrationPanel">
            <div className="AdministrationPanel__container">
                <h2 className="AdministrationPanel__title"> Employees administration panel</h2>
                <form className="AdministrationPanel__form" onSubmit={handleSubmit(addEmployee)}>
                    <input ref={register({required: true, min: 5, max: 20, pattern: /[A-Za-z]/g})} type={'text'} name={'name'} placeholder={'Employee name'} onChange={null}/>
                    <input ref={register({required: true})} type={'number'} name={'salary'} placeholder={'Employee salary '} onChange={null}/>
                    <input ref={register({required: true})} type={'number'} name={'age'} placeholder={'Employee age '} onChange={null}/>
                    <label>
                        <input type={'submit'} name={'submit'} value="+ ADD" />
                    </label>
                </form>
                <table className="AdministrationPanel__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Salary</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees.map((employee,index)=>{
                                return (
                                    <tr key={employee._id} e_id={employee._id}>
                                        <td>{index+1}</td>
                                        <td type={'name'} >{employee.name}</td>
                                        <td type={'salary'} >{employee.salary}</td>
                                        <td type={'age'} >{employee.age}</td>
                                        <td>
                                            <button className="AdministrationPanel__edit" onClick={editEmployee} value={employee._id}>Edit</button>
                                            <button className="AdministrationPanel__delete" onClick={deleteEmployee} value={employee._id}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default App

'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { useMutation, useQuery,  useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Employee {
  id: number
  name: string
  age: string
  position: string
  department: string
}
interface FormData {
  name: string
  age: string
  position: string
  department: string
}
export default function Home() {
  const [newEmployee, setNewEmployee] = useState<FormData>({
    name: '',
    age: '',
    position: '',
    department: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const queryClient = useQueryClient() 


  // function to fetch data from backend and pass to use query to fetch data
  const fetchEmployee = async () => {
    try {
      let employee = await axios.get("http://localhost:8000/employee")
      let data = await employee.data
      return data
    } catch (error) {
      console.log("Fetch Error", error)
    }
     
  }

  const { data } = useQuery<Employee[]>({
    queryKey: ["employee"],
    queryFn: fetchEmployee
  })
 //

 // function to add new Employee
 const addEmployee = useMutation({
   mutationFn: (employee:FormData) => {
      return axios.post("http://localhost:8000/employee", employee)
   },
   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      setNewEmployee({ name: '', age: '', position: '', department: '' })
   },
   onError: (error) => {
    console.error("Error creating employee:", error);  // Log error details
  }
 })

 // function for submitting form
 const createEmployeeSubmit = (e:FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if(editingId){
    updateEmployeeRecord.mutate({...newEmployee, id: editingId})
  }else {
    addEmployee.mutate(newEmployee)
  }
  
}


// Delete employee record
  const deleteEmployeeRecord = useMutation({
    mutationFn: (employee:Employee) => {
          return axios.delete(`http://localhost:8000/employee/${employee.id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] },)
   },
   onError: (error) => {
    console.error("Failed to delete:", error);  // Log error details
  }
  })

  // save the updated data
  const updateEmployeeRecord = useMutation({
    mutationFn: (employee:Employee) => {
      return axios.put(`http://localhost:8000/employee/${employee.id}`, employee)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      setEditingId(null)
      setNewEmployee({
        name: '',
        age: '',
        position: '',
        department: ''
      })
   },
   onError: (error) => {
    console.error("Error to update employee:", error);  // Log error details
  }
  })

 // this function is for editing data
  const startEditing = (employee: Employee) => {
    setEditingId(employee.id)
    setNewEmployee({
      name: employee.name,
      age: employee.age,
      position: employee.position,
      department: employee.department
    })
  }
  // this function is to cancel my edit data
  const cancelEditing = () => {
    setEditingId(null)
    setNewEmployee({ name: '', age: '', position: '', department: '' })
  }

  // 
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target
     setNewEmployee(prev => ({
      ...prev,
      [name]: value
     }))
  }



 
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-center text-black">Employment Records</h1>
    
    <form onSubmit={createEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={newEmployee.name}
          onChange={handleInputChange}
          placeholder="Enter name"
          required
        />
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          name="age"
          value={newEmployee.age}
          onChange={handleInputChange}
          placeholder="Enter age"
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={newEmployee.position}
          onChange={handleInputChange}
          placeholder="Enter position"
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          value={newEmployee.department}
           onChange={handleInputChange}
          placeholder="Enter department"
          required
        />
      </div>
      {editingId === null ? (
        <Button type="submit" className="md:col-span-2">Add Employee</Button>
      ) : (
        <div className="md:col-span-2 flex justify-end space-x-2">
          <Button type="button" onClick={cancelEditing} variant="outline">Cancel</Button>
          <Button type="submit" >Save Changes</Button>
        </div>
      )}
    </form>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(employee => (
          <TableRow className='text-black' key={employee.id}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.age}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startEditing(employee)}
                  aria-label="Edit employee"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={()=>deleteEmployeeRecord.mutate(employee)}
                  aria-label="Delete employee"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  );
}

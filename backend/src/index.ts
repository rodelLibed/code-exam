import { PrismaClient } from "@prisma/client"
import express, { Request, Response} from "express"
import cors from "cors"


const prisma = new PrismaClient()
const port = 8000
const app = express();
app.use(express.json());
app.use(cors())


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });


    app.post('/employee', async (req: Request, res: Response) => {
        
        const { name, age, position, department } = req.body;
       
        try {
          const newEmployee = await prisma.employee.create({
          data: {
            name,
            age,
            position,
            department
          }
          });
          res.status(201).json(newEmployee);
        } catch (error) {
          res.status(400).json({ error: 'User creation failed', details: error });
       
        }
      });
      
      // GET method to fetch all users
      app.get('/employee', async (req: Request, res: Response) => {
        try {
          const employees = await prisma.employee.findMany();
          res.status(200).json(employees);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch users', details: error });
        }
      });

      // Update method update employee by id
      app.put('/employee/:id', async (req: Request, res: Response) => {
             let { id } = req.params
             let { name, age, position, department } = req.body

           try {
              const updatedEmployee = await prisma.employee.update({
                where: {
                  id: id
                },
                data: {
                  name: name,
                  age: age,
                  position: position,
                  department: department
                }
              }) 
              res.status(200).json({ message: "Successfully Updated", updatedEmployee})
           } catch (error) {
              res.status(500).json({ message: "Failed to Update", error})
           }
      })

      // Delete method Employee
      app.delete("/employee/:id", async (req: Request, res: Response) => {
         let { id } = req.params
         try {
           const deleteEmployee = await prisma.employee.delete({
            where: {
              id: id
            }
           })
           res.status(200).json({ message: "Deleted Successfully", deleteEmployee})
         } catch (error) {
          res.status(500).json({ message: "Failed to delete", error})
         }
      })
      
   







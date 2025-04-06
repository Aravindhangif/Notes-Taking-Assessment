 //Express
 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const cors = require('cors');
 app.use(express.json());
 app.use(cors());

 mongoose.connect('mongodb+srv://Notes:8BfxbO8VaDA89wO8@notes.mpktkww.mongodb.net/?retryWrites=true&w=majority&appName=Notes')
 .then(()=>{
    console.log("DB connnected");
 })
 .catch((err)=>{
    console.log(err)
 })

 const todoSchema = new mongoose.Schema({
    title: String,
    description: String,  
 })

  const todoModel= mongoose.model('Todo', todoSchema);

app.post('/todo',async (req,res)=>{

    try{
    const {title,description} = req.body;
    const newTodo = new todoModel({title,description})
    await newTodo.save();   
    res.status(201).json(newTodo);
    } catch(error){
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
})

 app.get('/todo',async (req,res)=>{
try{
    const todos = await todoModel.find();
    res.json(todos);
}catch(error){
    console.log(error)
    res.status(500).json({error: 'Something went wrong'})
}
 })
  
    app.put('/todo/:id', async (req,res)=>{
        try{
            const {title,description} = req.body;
            const id = req.params.id;
            const updateTodo = await todoModel.findByIdAndUpdate(
                id,
                {title, description},
                {new: true}
            )
            if(!updateTodo){
                res.status(404).json({error: 'Todo not found'})
            }
            res.json(updateTodo)
        }catch(error){
            console.log(error)
            res.status(500).json({error: 'Something went wrong'})
        }
    })

    app.delete('/todo/:id', async (req,res)=>{
        try{
            const id= req.params.id
            const deleteTodo = await todoModel.findByIdAndDelete(id);
            res.json(deleteTodo)
        }catch(error){
            console.log(error)
            res.status(204).json({message: 'Todo not found'})
        }
    })

 const port = 8000

 app.listen(port, () =>{
    console.log(`Server is running on ${port}`);
 })
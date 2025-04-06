import { useEffect,useState } from "react";

export default function Todo(){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, seteditId] = useState(-1);

    const [editTitle,seteditTitle] = useState("");
    const [editDescription,seteditDescription] = useState("")

    const apiUrl = "http://localhost:8000";

    const handleSubmit =() =>{
        setError("");
        if(title.trim()!='' && description.trim()!=''){
            fetch(apiUrl+"/todo",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title,description})
            }).then((res)=> {
                if(res.ok){
                    setTodos([...todos,{title,description}]);
                    setMessage("Item added successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },2000)
                }else{
                    setError("Unable to create Todo item");
                }
            }).catch(()=>{
                setError("Unable to create Todo item");
            })
        }
    }

    useEffect(()=>{
        getItems();
    },[])

    const getItems=()=>{
        fetch(apiUrl+"/todo")
        .then((res)=>res.json()).then((res)=>{
            setTodos(res);
        })
    }

    const handleEdit = (item) =>{
        seteditId(item._id);
        seteditTitle(item.title);
        seteditDescription(item.description);
    }

    const handleUpdate = () =>{
        setError("");
        if(editTitle.trim()!="" && editDescription.trim()!=""){
            fetch(apiUrl+"/todo/"+editId,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title: editTitle,description: editDescription}),
            }).then((res)=> {
                if(res.ok){
                    const updatedTodos = todos.map((item)=>{
                        if(item._id==editId){
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setMessage("Item updated successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    seteditId(-1);
                }else{
                    setError("Unable to create Todo item");
                }
            }).catch(()=>{
                setError("Unable to create Todo item");
            })
        }
    }

    const handleEditCancel = () =>{
        seteditId(-1);
    }

    const handleDelete = (id) =>{
        if(window.confirm("Are you sure to delete this item?")){
            fetch(apiUrl+"/todo/"+id,{
                method:"DELETE"
            })
            .then(()=>{
                const updatedTodos = todos.filter((item)=> item._id !== id);
                setTodos(updatedTodos);
                
            })
    }
    }
    return <>
    <div className="row p-3 bg-success text-light">
        <h1>Notes-Taking app with MERN stack</h1>
    </div>
    <div className="row mt-3">
    <h3>Add Notes</h3>
    {message && <p className="text-success">{message}</p>}
    <div className="form-group d-flex gap-2">
    <input placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title} className="form-control" type="text" />
    <input placeholder="Description" onChange={(e)=> setDescription(e.target.value)} value={description} className="form-control" type="text" />
    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
    </div>
    {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Notes </h3>
        <ul className="list-group gap-3">
            {
                todos.map((item)=>
                    <li className="list-group-item bg-info d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                    {editId== -1  || editId!== item._id ? <>
                    <span className="fw-bold">{item.title}</span>
                    <span className="">{item.description}</span>
                    </>:<>
                        <div>
                            <div className="form-group d-flex gap-2">
                            <input placeholder="Title" onChange={(e)=> seteditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                            <input placeholder="Description" onChange={(e)=> seteditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                            </div>
                        </div>
                    </>}
                
                </div>
                <div className="d-flex gap-2">
                {editId==-1 || editId!== item._id ? <button className="btn btn-warning" onClick={()=> handleEdit(item)}>Edit</button>:<button onClick={handleUpdate}>Update</button>}
                {editId== -1 ? <button className="btn btn-danger" onClick={()=> handleDelete(item._id)}>Delete</button> :
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}

                </div>  
            </li>
                )
    }
            
            

        </ul>
    </div>
    </>
    }
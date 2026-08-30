import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const AdminLogin = () => {
    const navigate = useNavigate();
    const [data, setData]= useState({
        email:'',
        password:''
    })
    const handleChange= (e)=>{
        setData(()=>({...data,[e.target.name]:e.target.value}))
    }
    //submit function
    const handleSubmit = async(e)=>{
        try{
            e.preventDefault();
            const res= await axios.post('http://localhost:5000/api/admin/login', data);
            if(res.data.msg=="Success"){
                // console.log(res);
                localStorage.setItem("name", res.data.name)
                 localStorage.setItem("role", res.data.role)
                  localStorage.setItem("token", res.data.token)
                   localStorage.setItem("adminId", res.data.adminId)

                alert("successfully logged in")
                
            }else{
                console.log("sorry");
                alert(res);
                
            }
        }catch(er){
            console.log(er);
            
        }
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            Enter email:
            <input type="text" name='email' onChange={handleChange}/>
            {/* <br /> */}
            <input type="password" name='password' onChange={handleChange} />
            <input type="submit" />
        </form>
    </div>
  )
}
export default AdminLogin
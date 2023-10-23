import React ,{useState,useEffect}from 'react';
import logo from './Saint-Gobain_SEFPRO_logo_2023.png';
import './login.css';
import user from './user.png';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [userid,setUserid] = useState('');
    const [password,setPassword]=useState('');

    const navigateToDashboard = () => {
      //  navigate 
      navigate('/dashboard');
    };

    const navigateToviewerDashboard =() => {
      navigate('/viewerDashboard');
    };



  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = user;
  }, []);
    return(
    <>
   
    <div className="container">
    <div className='loginBox' >
        <h1>LOGIN</h1>
      
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
    
    
        <div className="demo"style={{width:'80%',height:'80%',justifyContent:'center',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div className="user-container">
                <img src={user} alt="user" style={{ width: '100px', height: '100px' }} />
                {isLoading && <div className="spinner" />}
              </div>
             
        <div className="Labels">
        <label> SG_ID</label>
        </div>
        <div className="Inputs">
        <input  className="In"type="text" placeholder="SGID" />
        </div>
       <div className="Labels">
       <label>Password</label>
       </div>
       <div className="Inputs">
       <input type="text" className="In" placeholder="Password"/>
       </div>
       <div className="Buttons">
       <button className='myButton'  onClick={navigateToDashboard}>SSO</button><br/>
       </div>
       <div className="Buttons" style={{marginTop:'20px'}}>
       <button className='myButton' onClick={navigateToviewerDashboard} >LOGIN</button>
       </div>   
        </div>
       
        
        
    </div>
    <div className="logo"  >
    <img src={logo} alt="Logo" style={{width:'150px',height:'50px',marginLeft:'3%'}}/>
    </div> 
    </div>
    </div>
   
</>
            
       
    );
}

export default Login;
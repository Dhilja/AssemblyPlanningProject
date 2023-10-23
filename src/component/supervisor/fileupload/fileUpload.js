import React,{ useState , useEffect} from 'react';
import logo from 'F:/assembly-planning/src/Saint-Gobain_SEFPRO_logo_2023.png';
import './fileUpload.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Fileupload() {
 
  const [oaNumber, setOaNumber] = useState('');
  const [drawingNumber, setDrawingNumber] = useState('');
  const [drawingNumberOptions, setDrawingNumberOptions] = useState([]);
  const [file, setFile] = useState(null);
  

  const navigate = useNavigate();

  const navigateToFileupload = () => {
    //  navigate 
    navigate('/fileUpload');
  };

  const navigateToPlanning = () => {
    navigate('/Planning');
  }

  const navigateToSlicing =() => {
    navigate('/slicing');
  }

  const navigateToBook = () => {
    navigate('/bookPage')
  }
  const navigateToArea=() =>{
    navigate('/Area')
  }

  const navigateToLogin =()=>{
    navigate('/')
  }


  const handleOaNumberChange = (e) => {
    setOaNumber(e.target.value);
    setDrawingNumber(''); // Clear the selected drawing number
    setDrawingNumberOptions([]); // Clear the options
  };

  const handleDrawingNumberChange = (e) => {
    const selectedDrawingNumber = e.target.value;
    setDrawingNumber(selectedDrawingNumber);
  };
  
  useEffect(() => {
    if (oaNumber) {
      fetch(`http://localhost:5000/api/product/${oaNumber}`)
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
          setDrawingNumberOptions(data); // Update the drawingNumberOptions state
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [oaNumber]);
  

  useEffect(() => {
    if (drawingNumber) {
      setDrawingNumberOptions(prevOptions => [...prevOptions, drawingNumber]);
    }
  }, [drawingNumber]);

  const navigateToDashboard=() =>{
    navigate('/dashboard')
  }

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file[0]); // Append the first selected file

    axios
      .post(`http://localhost:5000/api/upload/${drawingNumber}`, formData)
      .then(() => {
        console.log('Data sent to server:');
        alert('Uploaded');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
  };
  
  
  

    return (
      
      <div className="Container">
        <div className="Header" style={{ display: 'flex' }}>
          <div className="pages">
            <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
          </div>
          <div className="pages">
            <p className='headerText' onClick={navigateToDashboard} >Home</p>
          </div>
          <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter}  style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            <div className ="Nav"onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar"onClick={navigateToArea}>View</div>
          </div>
          </div>
          <div className="pages">
            <p className='headerText'>Track Progress</p>
          </div>
          <div className="pages">
            <p className='headerText'>Users</p>
          </div>
          <div className="pages">
            <p className='headerText'>Customers</p>
          </div>
         
          <div className="logout" style={{ marginLeft: '15%' }} onClick={navigateToLogin}>
            Logout
          </div>
        </div>
        <div className='Plan' style={{marginTop:'3%'}}>
        <h1 style={{ textAlign: 'center' }}>FILE UPLOAD</h1>
       
      </div>
     

<div>
 
<div  className="topinputs" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' ,color:'white'}}>
<label>OA Number</label>
          <input
            type="text"
            placeholder="Enter OA Number"
            style={{ marginLeft: "2%" }}
            value={oaNumber}
            onChange={handleOaNumberChange}
          />
       <label style={{ marginLeft: '2%' }}>Drawing Number</label>
       <select value={drawingNumber} id="drawingNumber" onChange={handleDrawingNumberChange}>
  <option value="">Select Drawing Number</option>
  {drawingNumberOptions.map((option, index) => (
    <option key={index} value={option.drawing_number}>
      {option.drawing_number}
    </option>
  ))}
</select>
        </div>
      </div>
      <div style={{textAlign:'center',marginTop:'18vh'}}>
      <div style={{ marginTop: '20px', color: 'white' }}>
        
        <input type="file" id="file"onChange={(e) => setFile(e.target.files)} />
      </div>
      
      <div className="footer" style={{marginTop:'15%'}}>
      <button  onClick={handleSubmit}>Submit</button> 
      </div>
      
      </div>

     
     
     

    </div>
  );
}

export default Fileupload;




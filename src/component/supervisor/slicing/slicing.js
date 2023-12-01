import React ,{useState,useEffect} from 'react';
import logo from 'F:/assembly-planning/src/Saint-Gobain_SEFPRO_logo_2023.png';
import './slicing.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




function Slicing() {
  const [oaNumber, setOaNumber] = useState('');
  const [drawingNumber, setDrawingNumber] = useState('');
  const [drawingNumberOptions, setDrawingNumberOptions] = useState([]);
  const [sliceName ,setSlicename] = useState('');
  const [length ,setLength] = useState('');
  const [breadth ,setBreadth] = useState('');
  const[height,setHeight] = useState('');
    const [startDate ,setStartdate] = useState('');
  const [endDate ,setEnddate] = useState('');
  const [blocks ,setBlocks] = useState('');
  const [isAlert,setIsAlertOpen]=useState(false);
  const [slicedPartsData, setSlicedPartsData] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const getAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/authenticate'); // Update the URL to your server's endpoint
      setAccessToken(response.data.access_token);
      setTimeout(() => {
        
      }, 10000);
    } catch (error) {
      console.error('Error obtaining access token:', error);
    }
  };

     

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/slicedparts/${drawingNumber}`)
      .then(response => response.json())
      .then(data => {
        console.log('Sliced Parts Data:', data);
        setSlicedPartsData(data);
      })
      .catch(error => {
        console.error('Error fetching sliced parts data:', error);
      });
  }, [drawingNumber]);



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

  const navigateToDashboard=() =>{
    navigate('/dashboard')
  }
  const navigateToArea=() =>{
    navigate('/Area')
  }

  const navigateToLogin =()=> {
    navigate('/')
  }

  const navigateToUsers =() => {
    navigate('/Users')
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

  const handleSubmit =() =>{
    
    setLength('');
    setBreadth('');
    setSlicename('');
    setHeight('');
    setBlocks('');
    setEnddate('');
    setStartdate('');
    axios
    .post('http://localhost:5000/api/slicedparts', { sliceName,length,breadth,height,startDate,endDate,blocks,drawingNumber})
    .then((response) => {
      console.log('Server response:',response.data); 
      setIsAlertOpen(true);
      const newSlice = {
        slice_name: sliceName,
        length: length,
        breadth: breadth,
        height: height,
        start_date: startDate,
        end_date: endDate,
        // Add other properties as needed
      };
  
      setSlicedPartsData([...slicedPartsData, newSlice]);
  
    })
    .catch((error) => {
      console.error(error);
      alert(error); // Handle any error that occurred during the request
    });
  }

  
  
  const handleCloseAlert = () => {
    setIsAlertOpen(false);
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
            <p className='headerText' onClick={navigateToDashboard}>Home</p>
          </div>
          {/* <div className="page">
            <p className="new" style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            
            
        </div>
        <div className ="nav" style={{display:''}}>
            <div  className="navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="navbar"onClick={navigateToBook}>Book</div>
          </div> */}
           <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter}  style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            <div className ="Nav"onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar" onClick={navigateToArea}>View</div>
            
          </div>
          </div>

          <div className="pages">
            <p className='headerText'>Track Progress</p>
          </div>
          <div className="pages">
            <p className='headerText' onClick={navigateToUsers}>Users</p>
          </div>
          <div className="pages">
            <p className='headerText'>Customers</p>
          </div>
         
          <div className="logout" style={{ marginLeft: '15%' }} onClick={navigateToLogin}>    
            Logout
          </div>
        </div>
       
      

<div>
 
<div className="topinputs" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' ,color:'white'}}>
<label>OA Number</label>
          <input
            type="text"
            placeholder="Enter OA Number"
            style={{ marginLeft: "2%" }}
            value={oaNumber}
            onChange={handleOaNumberChange}
          />
       <label style={{ marginLeft: '10%' }}>Drawing Number</label>
       <select value={drawingNumber} id="drawingNumber" onChange={handleDrawingNumberChange} style={{ marginLeft: '2%' }}>
  <option value="">Select Drawing Number</option>
  {drawingNumberOptions.map((option, index) => (
    <option key={index} value={option.drawing_number}>
      {option.drawing_number}
    </option>
  ))}
</select>
        </div>
      </div>
     
        <div style={{display:'flex',marginTop:'40px'}}>
        <div style={{width:'70%',height:'70vh',backgroundColor:'white',padding:'20px'}}>
      {/*<ForgeViewer urn="your_3d_model_urn" accessToken={accessToken}  />*/}
      <h4>3D model viewing</h4>
      </div>
      
          
            <div className='slicedets' style={{width:'20%',height:'63vh',marginLeft:'4%',padding:'3%',backgroundColor:'#EADBC8'}}>
              <h4 style={{color:'#0F2C59'}}>Enter the details of each slice...</h4>
              <input type="text" placeholder="Slice name" value={sliceName} onChange= {e=>setSlicename(e.target.value)}  /> <br/>
              <input type="text" placeholder="Length" value={length} onChange= {e=>setLength(e.target.value)}  /><br/>
              <input type="text" placeholder="Breadth" value={breadth} onChange= {e=>setBreadth(e.target.value)}  /> <br/>
              <input type="text" placeholder="Height" value={height} onChange= {e=>setHeight(e.target.value)}  /><br/>
              <label>Start Date </label>
              <input type="date"  placeholder="Start Date"value={startDate} onChange={(e) => {
    const selectedDate = new Date(e.target.value);
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Extract the date part
    setStartdate(formattedDate);
  }}  /><br/>
              <label >End Date </label>
              <input type="date" placeholder="End Date"value={endDate} onChange={(e) => {
    const selectedDate = new Date(e.target.value);
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Extract the date part
    setEnddate(formattedDate);
  }} /><br/>
              <input type="text" placeholder="No of Blocks" value={blocks} onChange= {e=>setBlocks(e.target.value)}  /><br/><br/>
              <button onClick={handleSubmit}>Submit</button>
            </div>
               
     
        </div>

        <div style={{ width: '100%', backgroundColor: '#EADBC8', marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
  <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
    {slicedPartsData.map((slice, index) => (
      <div
        key={index}
        style={{
          border: '3px solid black',
          backgroundColor: '#3F1D38',
          padding: '8px',
          width: '200px',
          height: '150px',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'white',
          margin: '8px',
        }}
      >
        <p>{slice.slice_name}<br />Length: {slice.length}<br />Breadth: {slice.breadth}<br />Height: {slice.height}<br />Start Date: {slice.start_date}<br />End Date: {slice.end_date}</p>
      </div>
    ))}
  </div>
</div>


      
        {isAlert && (
           <div className="custom-modal">
           <div className="modal-content">
           <h3>Slice added successfully</h3>
           <button onClick={handleCloseAlert}>OK</button> 
            </div>
            </div>
      )}
       
      </div>
      
      

            
               
 );
}
          
export default Slicing;
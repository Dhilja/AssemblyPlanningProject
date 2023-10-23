import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import logo from 'F:/assembly-planning/src/Saint-Gobain_SEFPRO_logo_2023.png';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const socket = io('http://localhost:5000');

function TableData() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [updateRow, setUpdateRow] = useState(null);
  const [editedRow, setEditedRow] = useState({
    area_number: '',
    plant_number: '',
    length: '',
    breadth: '',
    pad_length: '',
    pad_breadth: '',
    // ... other properties
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAlert,setIsAlertOpen]=useState(false);

  
  useEffect(() => {
   

    axios
      .get('http://localhost:5000/api/data')
      .then(response => {
        setData(response.data);
        console.log('Response from server:', response.data);
      })
      .catch(error => {
        console.log(error);
      });

      const updateTableDataWithNewPad = (newData) => {
        setData((prevData) => [...prevData, newData]);
      };
      socket.on('newPadAdded', updateTableDataWithNewPad);
  
      return () => {
        socket.off('newPadAdded', updateTableDataWithNewPad);
      };
      
  }, []);

  




  const filteredData = data.filter(item => {
    const searchString = searchText.trim().toLowerCase();
    return (
      item.area_number.toLowerCase().includes(searchString) ||
      item.plant_number.toString().includes(searchString));/* ||
    item.total_area.toString().includes(searchString) ||
      item.available_area.toString().includes(searchString) ||
      item.occupied_area.toString().includes(searchString)
    )*/
  });

  const handleUpdate = (row) => {
    setUpdateRow(row);
  }

  const handleconfirmUpdate = () => {
    if (updateRow) {
      // Toggle the status based on the current status
      const newStatus = updateRow.status === 'active' ? 'inactive' : 'active';
  
      // Perform the PUT request to update the status
      fetch(`http://localhost:5000/api/updateStatus/${updateRow.area_number}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }), // Send the new status
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Update the status in the UI
            updateRow.status = newStatus; // Assuming updateRow is a state variable
            console.log('Status updated successfully in the database');
            alert('updated successfully');
            setUpdateRow(null);
          } else {
            console.error('Error updating status in the database');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  
  
 
  
  const handleEdit = (item) => {
    // Fetch the data for the selected row from the server
    axios
      .get(`http://localhost:5000/api/data/${item.area_number}`)
      .then((response) => {
        console.log("Response data:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Use the first item in the array
          const editedRowData = response.data[0];
          
          // Log the value of 'length'
          console.log("editedRowData:", editedRowData);
          
          setEditedRow({
            ...editedRow,
            area_number: editedRowData.area_number,
            plant_number: editedRowData.plant_number,
            length: editedRowData.length,
            breadth: editedRowData.breadth,
            pad_length: editedRowData.pad_length,
            pad_breadth: editedRowData.pad_breadth,
            rows : editedRowData.rows,
            columns : editedRowData.columns,
            // ... other properties
          });
          console.log("Edited row value :",editedRow);
          setIsEditModalOpen(true);
        } else {
          console.error("Response data is empty or not in the expected format.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  // Use the useEffect hook to log editedRow when it changes
 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prevEditedRow) => ({
      ...prevEditedRow,
      [name]: value,
    }));
  };
  
  const handleEditSubmit = (event) => {
    event.preventDefault();
    console.log('Updated row:', editedRow);
    
    // Implement update functionality here
    axios
      .put(`http://localhost:5000/api/data/${editedRow.area_number}`, editedRow)
      .then((response) => {
        console.log('Server response:', response.data);
        setIsEditModalOpen(false);
        setIsAlertOpen(true);
       
        // Reset the editedRow state
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    
   
  };
  


  return (
    <div>
    <div className="searchTab" >
        <input type="text" placeholder={'Search Assembly Area...' } className="search" value={searchText} onChange={e=> setSearchText(e.target.value)} />
       </div>
      
    <table style={{marginTop:"3%"}}>
      <thead>
        <tr>
          <th>Assembly Area number</th>
          <th>Plant number</th>
          <th>Total Area</th>
          <th>Available Area</th>
          <th>Occupied Area</th>
          <th>Percentage of Use</th>
          <th>Options</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        
        {filteredData.map(item => (
          <tr key={item.area_number}>
            <td>{item.area_number}</td>
            <td>{item.plant_number}</td>
            <td>{item.total_area}</td>
            <td>{item.available_area}</td>
            <td>{item.occupied_area}</td>

            <td>
              <div className="progress">
                <div className="progress-bar" style={{width :`${(item.occupied_area/item.total_area)*100}%`}}>
                <div className="progress-overlay">
              <div className="progress-text">{`${Math.round((item.occupied_area / item.total_area) * 100)}%`}</div>
            </div>
             </div>
                
              </div>
            </td>
            <td>
                <FontAwesomeIcon icon={faPencilAlt} className="edit" style={{ color: "gray",marginLeft:"5%" }} onClick={()=>handleEdit(item)} />
                
              </td>
              <td onClick={() => handleUpdate(item)}>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {updateRow && (
        <div className="custom-modal">
          <div className="modal-content">
            <h2>Change  Status</h2>
            <p>Are you sure you want to change the status of the user?</p>
            <button onClick={() => setUpdateRow(null)} >Cancel</button>
            <button id="deletebtn"onClick={handleconfirmUpdate}style={{marginLeft:"50%"}}>Update</button>
          </div>
        </div>
      )}

      
{isEditModalOpen && (
  <div className="custom-modal">
    <div className="modal-content" style={{marginTop:'20%'}}>
      <h2 style={{textAlign:'center'}}>Edit Assembly Pad</h2>
      <div style={{textAlign:'center'}} >
        <input type="text" id="areaNumberInput" placeholder="Assembly Area Number"style={{width:'80%'}}
               value={editedRow.area_number}
               onChange={handleInputChange}/>
        <br/>
        <input type="text" placeholder="Plant Number"  id="plantNumberInput" style={{width:'80%'}}
               value={editedRow.plant_number}
               onChange={handleInputChange}/><br/>
        <input type="text" id="lengthInput" placeholder="Length"  style={{width:'35%'}}
               
               onChange={handleInputChange}/> 
        <input type="text" id="breadthInput" placeholder="Breadth" style={{width:'35%',marginLeft:'5%'}}
               
               onChange={handleInputChange}/><br/>
        <input type="text" id="padlengthInput" placeholder="pad Length"  style={{width:'35%'}}
               
               onChange={handleInputChange}/> 
        <input type="text" id="padbreadthInput" placeholder="pad Breadth" style={{width:'35%',marginLeft:'5%'}}
              
               onChange={handleInputChange} /><br/>
        <input type="text" id="rows" placeholder="rows"  style={{width:'35%'}}
               
               onChange={handleInputChange}/> 
        <input type="text" id="columns" placeholder="columns" style={{width:'35%',marginLeft:'5%' }}
              
               onChange={handleInputChange}/><br/>

        <button onClick={handleEditSubmit}>Edit</button>
        <button onClick={handleModalClose} style={{marginLeft:'50%'}}>Cancel</button>
      </div>
    </div>
  </div>
)}


      {isAlert && (
           <div className="custom-modal">
           <div className="modal-content" style={{padding:'3%'}}>
           <h3>Successfully Edited</h3>
           <button onClick={() => setIsAlertOpen(false)}>OK</button>

            </div>
            </div>
      )}
     
    </div>
  );
}



function DashBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isAlert,setIsAlertOpen]=useState(false);// State to control the visibility of the modal

  const navigate = useNavigate();

  const navigateToLogin = () => {
    //  navigate 
    navigate('/');
  };

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
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleCancel=()=>{
    handleCloseModal();
  };

  const handleisAlert = () => {
    handleCloseModal();
    const areaNumber = document.getElementById('areaNumberInput').value;
    const plantNumber = document.getElementById('plantNumberInput').value;
    const length = document.getElementById('lengthInput').value;
    const breadth = document.getElementById('breadthInput').value;
    const padLength = document.getElementById('padlengthInput').value;
    const padBreadth = document.getElementById('padbreadthInput').value;
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;

    axios
    .post('http://localhost:5000/api/data', { areaNumber, plantNumber, length, breadth,padLength,padBreadth,rows,columns})
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
      setIsAlertOpen(true);
       // Show the success alert
    })
    .catch((error) => {
      console.error(error); // Handle any error that occurred during the request
    });

    
    
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };
  const handleSubmit = () => {
    // Handle form submission here
   
    handleCloseAlert();
    
  };

  const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
  };


  return (
    <>
    <div className="Container">
      <div className="Header" style={{ display: 'flex' }}>
      <div className="pages">
          <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
        </div>
        <div className="pages">
          <p className='home' style={{ color: 'hsl(180.3deg 100% 39.02%)' }} onClick={navigateToDashboard}>Home</p>
        </div>
        <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter}  >New Plan </p>
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
          <p className='headerText'>Users</p>
        </div>
        <div className="pages">
          <p className='headerText'>Customers</p>
        </div>
        
        <div className="logout" style={{ marginLeft: '15%' }}  onClick={navigateToLogin}>
          Logout
        </div>
      </div>
     
      
       <div className="newpad" style={{ display: 'flex', justifyContent: 'flex-end',marginTop:"2%"}} >
        <button  onClick={handleOpenModal} >New Assembly Area</button>
       </div>
    

      {isModalOpen && (
        <div className="custom-modal">
          <div className="modal-content" style={{marginTop:'20%'}}>
            <h2 style={{textAlign:'center'}}>Add a new Assembly Pad</h2>
            <div style={{textAlign:'center'}} >
              <input type="text" id="areaNumberInput"placeholder="Assembly Area Number"style={{width:'80%'}} />
              <br/>
              <input type="text" placeholder="Plant Number"  id="plantNumberInput" style={{width:'80%'}}/><br/>
              <input type="text" id="lengthInput" placeholder="Length"  style={{width:'35%'}}/> 
              <input type="text" id="breadthInput" placeholder="Breadth" style={{width:'35%',marginLeft:'5%'}} /><br/>
              <input type="text" id="padlengthInput" placeholder="pad Length"  style={{width:'35%'}}/> 
              <input type="text" id="padbreadthInput" placeholder="pad Breadth" style={{width:'35%',marginLeft:'5%'}} /><br/>
              <input type="text" id="rows" placeholder="rows"  style={{width:'35%'}}/> 
              <input type="text" id="columns" placeholder="columns" style={{width:'35%',marginLeft:'5%'}} /><br/>

              
              <button onClick={handleisAlert}>Create</button>
              <button onClick={handleCancel} style={{marginLeft:'50%'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isAlert && (
           <div className="custom-modal">
           <div className="modal-content">
           <h3>Successfully added assembly area</h3>
           <button onClick={handleSubmit}>OK</button> 
            </div>
            </div>
      )}
     
      
      <div className="assemblyPadTable" style={{marginTop:'2%'}}>
  <div className="table-container">
    <TableData />
  </div>
</div>

    </div>
    </>
  );
}

export default DashBoard;

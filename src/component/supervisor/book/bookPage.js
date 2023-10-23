import React ,{useState,useEffect,useRef} from 'react';
import logo from 'F:/assembly-planning/src/Saint-Gobain_SEFPRO_logo_2023.png';
import './bookPage.css';
import { useNavigate } from 'react-router-dom';
import { faTimes,faTrash  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Book(){

    
    const [oaNumber, setOaNumber] = useState('');
  const [drawingNumber, setDrawingNumber] = useState('');
  const [drawingNumberOptions, setDrawingNumberOptions] = useState([]);
  const [slicedPartsData, setSlicedPartsData] = useState([]);
  const [selectedSliceLength, setSelectedSliceLength] = useState('');
const [selectedSliceBreadth, setSelectedSliceBreadth] = useState('');
const [additionalLength, setAdditionalLength] = useState('');
const [additionalBreadth, setAdditionalBreadth] = useState('');
const [walkAroundDistance, setWalkAroundDistance] = useState('');
const [footprintArea, setFootprintArea] = useState('');
const [occupiedArea, setOccupiedArea] = useState('');
const [plants,setPlants] = useState([]);
const [areas, setAreas] =useState([]);
const [selectedAreaNumber, setSelectedAreaNumber] = useState(null);
const [selectedAreaData, setSelectedAreaData] = useState(null);
const [isAreaContentVisible, setIsAreaContentVisible] = useState(false);
const [selectedSliceid, setSelectedSliceid] = useState('');
const [tileData, setTiledata] = useState([]);
const [isTemporaryTileVisible, setIsTemporaryTileVisible] = useState(false);

const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });
const [isDragging, setIsDragging] = useState(false);

const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
const padsDivRef = useRef(null);
const tileDivRef = useRef(null);
const [tilePos,setTilepos] = useState([]);
const [bg,setBg] =useState('');
const [startDate ,setStartdate] = useState('');
const [endDate ,setEnddate] = useState('');
const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [tileToDelete, setTileToDelete] = useState(null);


const handleAreaClose = () => {
  setIsAreaContentVisible(false);
};
const showDeleteModal = (tile) => {
  setTileToDelete(tile);
  setIsDeleteModalVisible(true);
};

// Function to hide the delete modal
const hideDeleteModal = () => {
  setIsDeleteModalVisible(false);
};
const deleteTile = () => {
  // Make an API call to delete the tile
  // You can use the information in 'tileToDelete' to identify the tile you want to delete.
  const tileIdToDelete = tileToDelete.id;
  console.log(tileToDelete.id)

  fetch(`http://localhost:5000/api/tile/${tileIdToDelete}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        // The tile was deleted successfully
        return response.json();
      } else {
        // Handle errors (e.g., show an error message)
        throw new Error('Failed to delete tile');
      }
    })
    .then(() => {
      // After successful deletion, you can update the UI to remove the tile
      // For example, you can filter the 'tilePos' array to exclude the deleted tile
      fetchTilePositions(selectedSliceid);
      setIsDeleteModalVisible(false); // Hide the delete modal
    })
    .catch((error) => {
      console.error(error);
      // Handle the error (e.g., show an error message to the user)
    });
};

  

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
  const navigateToLogin=() =>{
   
    navigate('/')
  }
  const navigateToArea=() =>{
   
    navigate('/Area')
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

  const handleSliceDivClick = (slice) => {
    setSelectedSliceLength(slice.length);
    setSelectedSliceBreadth(slice.breadth);
    setSelectedSliceid(slice.id);
  };
  

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

  const handleSubmit = () => {
    // Make API call to insert data into the database
    fetch(`http://localhost:5000/api/slicedparts/${selectedSliceid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        additionalLength,
        additionalBreadth,
        walkAroundDistance,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Set the response data to states
        setFootprintArea(data.footprint_area);
        setOccupiedArea(data.occupied_area);
  
        console.log('Updated Data:', data);
      })
      .catch(error => {
        console.error('Error inserting or fetching data:', error);
      });
  };

  useEffect(() => {
    console.log("Fetching plants data...");
    fetch(`http://localhost:5000/api/plants`)
    .then(response => response.json())
    .then(data => {
        console.log('Plants Data:', data);
        setPlants(data);
    })
    .catch(error => {
        console.error('Error fetching sliced parts data:', error);
    });
}, []);


useEffect(() => {
  console.log("Fetching plants data...");
  fetch(`http://localhost:5000/api/areas`)
  .then(response => response.json())
  .then(data => {
      console.log('Plants Data:', data);
      setAreas(data);
  })
  .catch(error => {
      console.error('Error fetching sliced parts data:', error);
  });
}, []);

const handleAreaClick = (areaNumber) => {
  
  setSelectedAreaNumber(areaNumber);

  fetch(`http://localhost:5000/api/area/${areaNumber}`)
    .then(response => response.json())
    .then(data => {
      console.log('Area Data:', data);
      // Save the fetched data to state for rendering
      setSelectedAreaData(data);
      setIsAreaContentVisible(true);
    })
    .catch(error => {
      console.error('Error fetching area data:', error);
    });
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const handlePlace = () => {
  fetch(`http://localhost:5000/api/tile/${selectedSliceid}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Tile Data:', data);
      setTiledata(data);

      // After you fetch tile data, also fetch background color data
      fetch('http://localhost:5000/api/bg')
        .then((response) => response.json())
        .then((bgData) => {
          if (Array.isArray(bgData)) {
            // Check if the customer name is present in the fetched data
            const existingTile = bgData.find((item) => item.customer_name === data.customer_name);

            if (existingTile) {
              // Use the background color from the existing tile
              setBg(existingTile.color);
            } else {
              // If the customer name is not found, generate a new random color
              setBg(getRandomColor());
            }
          } else {
            console.error('Background Data is not an array.');
            // Handle the case where the data is not an array
          }
        })
        .catch((error) => {
          console.error('Error fetching background color data:', error);
          // Handle the error as needed
        });

      setIsTemporaryTileVisible(true);
    })
    .catch((error) => {
      console.error('Error fetching area data:', error);
    });
};

 const handleDivMouseDown = (e) => {
  e.preventDefault(); // Prevent any default browser behavior

  setIsDragging(true);

  const offsetX = e.clientX - divPosition.x;
  const offsetY = e.clientY - divPosition.y;
  setDragOffset({ x: offsetX, y: offsetY });

  // Attach the event listener to the entire document
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};


const handleMouseMove = (e) => {
  if (!isDragging) return;

  const maxX = padsDivRef.current?.clientWidth - (tileData.occ_length / 1000) * 20;
  const maxY = padsDivRef.current?.clientHeight - (tileData.occ_breadth / 1000) * 20;

  // Calculate the new position based on the mouse movement and drag offset
  let newX = e.clientX - dragOffset.x;
  let newY = e.clientY - dragOffset.y;

  // Constrain the movement within the bounds of the pads div
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  setDivPosition({ x: newX, y: newY });
};

const handleMouseUp = () => {
  if (isDragging) {
    setIsDragging(false);

    // Remove the event listeners from the document
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
};

const handleFixPosition = () => {
  // collisson part start
  const updatedTilePosition = { x: divPosition.x, y: divPosition.y };
  function checkCollision(tile1, tile2) {
    return (
      tile1.x < tile2.x + tile2.width &&
      tile1.x + tile1.width > tile2.x &&
      tile1.y < tile2.y + tile2.height &&
      tile1.y + tile1.height > tile2.y
    );
  }
  
  const hasCollision = tilePos.some((otherTile) => {
    if (otherTile.id !== selectedSliceid && otherTile.area_number === selectedAreaNumber) {
      const tile1 = {
        x: updatedTilePosition.x,
        y: updatedTilePosition.y,
        width: (tileData.foot_length / 1000) * 20,
        height: (tileData.foot_breadth / 1000) * 20,
        area_number :tileData.area_number,
      };
      const tile2 = {
        x: otherTile.x,
        y: otherTile.y,
        width: (otherTile.foot_length / 1000) * 20,
        height: (otherTile.foot_breadth / 1000) * 20,
        area_number :tileData.area_number,
      };
      return checkCollision(tile1, tile2);
    }
    return false;
  }); 
  if (hasCollision) {
    alert('Tile collision detected. Adjust the position.');
    console.log("it works")
    return; // Exit the function if a collision was detected
  }
  // collission part ends
  const requestBody = {
   id: selectedSliceid,
    x: divPosition.x,
    y: divPosition.y,
    area_number: selectedAreaNumber,
    color: bg,
    drawing_number:drawingNumber,
  };
  

  
  fetch(`http://localhost:5000/api/sliceposition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
  .then((response) => {
    if (!response.ok) {
      // Check the HTTP status code and handle accordingly
      if (response.status === 500) {
        alert('Server error: An error occurred on the server.');
      } else {
        alert('Unknown error occurred.');
      }
    } else {
      alert('Tile Fixed Successfully');
      setIsTemporaryTileVisible(false);
      fetchTilePositions(selectedSliceid);
      return response.json();
     
    }
  })
  .then((data) => {
    console.log('Data sent successfully:', data);
    
  })
  .catch((error) => {
    console.error('Error sending data:', error);
    alert('Error fixing tile. Please try again.');
  });
};


const fetchTilePositions = (sliceId) => {
  fetch(`http://localhost:5000/api/sliceposition/${sliceId}`)
    .then(response => response.json())
    .then(data => {
      console.log('Tile Position Data:', data);
      setTilepos(data);
    })
    .catch(error => {
      console.error('Error fetching tile position data:', error);
    });
};

useEffect(() => {
  console.log("Fetching tile position data...");
  if (selectedSliceid) {
    console.log("Fetching tile position data...");
    fetch(`http://localhost:5000/api/sliceposition/${selectedSliceid}`)
      .then(response => response.json())
      .then(data => {
        console.log('tile Position Data:', data);
        setTilepos(data);
      })
      .catch(error => {
        console.error('Error fetching tile position data:', error);
      });
  }
}, [selectedSliceid]);

useEffect(() => {
  if (startDate && endDate) {
    fetch(`http://localhost:5000/api/position?start_date=${startDate}&end_date=${endDate}`)
      .then(response => response.json())
      .then(data => {
        console.log('tile Position Data:', data);
        setTilepos(data);
      })
      .catch(error => {
        console.error('Error fetching tile position data:', error);
      });
  }
}, [startDate, endDate]);





const [showNav, setShowNav] = useState(false);
  
const handleMouseEnter = () => {
  setShowNav(true);
};

const handleMouseLeave = () => {
  setShowNav(false);
};


  
  
    return(
      <div  className="Container">
        <div  style={{padding:'8px'}}>
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
            <div className="Navbar"onClick={navigateToArea}>Area</div>
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
          <div className="topinputs" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' ,color:'white'}}>
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
        <div style={{display:'flex',marginTop:'2%'}}>
            <div style={{marginLeft:'18%'}}>
            <label style={{color:'white'}}>Start Date </label>
              <input type="date"  placeholder="Start Date"value={startDate} onChange= {e=>setStartdate(e.target.value)}  /> <br/>
            </div>
            <div style={{marginLeft:'11%'}}>
            <label style={{color:'white'}}>End Date </label>
              <input type="date" placeholder="End Date"value={endDate} onChange= {e=>setEnddate(e.target.value)}  />
            </div>
             
        </div>
          <div className='slicedparts' style={{display:'flex',marginTop:'3vh'}}>
          <div style={{ width: '70%', backgroundColor: '#DAFFFB', marginTop: '1%', display: 'flex', flexDirection: 'column' }}>
  <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
    {slicedPartsData.map((slice, index) => (
      <div
        key={index}
        style={{
          border: '3px solid black',
          backgroundColor: '#1F4172',
          padding: '8px',
          width: '200px',
          height: '150px',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'white',
          margin: '8px',
        }}

        onClick={() => handleSliceDivClick(slice)}
      >
        <p>{slice.slice_name}<br />Length: {slice.length}<br />Breadth: {slice.breadth}<br />Height: {slice.height}<br />Start Date: {slice.start_date}<br />End Date: {slice.end_date}</p>
      </div>
    ))}
  </div>


            </div>
            <div  className="bookinputs"style={{color:'white',marginLeft:'2%'}}>
                <label style={{marginTop:'60px'}}>Length</label><br/>
                <input type="text" value={selectedSliceLength} placeholder="Length"/><br/>
                <label>Breadth</label><br/>
                <input type="text" value={selectedSliceBreadth} placeholder="Breadth" /><br/>
                <label>Footprint Area</label><br/>
                <input type="text" placeholder="Footprint Area" value={footprintArea} readOnly /><br/>
                <label>Occupied Area</label><br/>
                <input type="text" placeholder="Occupied Area" value={occupiedArea} readOnly /><br/>
            </div>
            <div  className="bookinputs" style={{color:'white',marginLeft:'2%'}}>
            <label> Additional length</label><br/>
            <input
      type="text"
      placeholder="Additional Length"
      value={additionalLength}
      onChange={e => setAdditionalLength(e.target.value)}/><br/>
                <label> Additional Breadth</label><br/>
                <input
      type="text"
      placeholder="Additional Breadth"
      value={additionalBreadth}
      onChange={e => setAdditionalBreadth(e.target.value)}/><br/>
                <label>Walk Around Distance</label><br/>
                <input
      type="text"
      placeholder="Walk Around Distance"
      value={walkAroundDistance}
      onChange={e => setWalkAroundDistance(e.target.value)}
    /><br/>

<button onClick={handleSubmit}>Calculate</button>

            </div>
            </div>  


            <div style={{ backgroundColor: 'white', width: '98%', height: '40vh', marginTop: '3%', padding: '1%', display: 'flex',textAlign:'center' }}>
  {plants.map((plant, index) => (
    <div
      key={index}
      style={{
        border: '1px solid black',
      
        padding: '8px',
        margin: '20px',
        width: '300px',
        
        cursor: 'pointer',
      }}
    >
      <p>Plant Number : {plant.plant_number}</p>
      {areas
        .filter(area => area.plant_number === plant.plant_number)
        .map((area, index) => (
          <div
            key={index}
            style={{
              border: '1px solid black',
              margin: '4px',
              padding: '4px',
              backgroundColor: 'lightgray',
              height:'120px',
              
            }}

            onClick={()=> handleAreaClick(area.area_number)}
          >
            <p> {area.area_number}</p>
            <p>Length: {area.length}</p>
            <p>Breadth: {area.breadth}</p>

</div>
       ))}

    </div>
  ))}
</div>
<div>
  
</div>
<div>
{selectedAreaData &&  isAreaContentVisible && (
  <div id={`area-${selectedAreaNumber}-content`} className="area-content" style={{ position: 'fixed', top: '50%', left: '45%', transform: 'translate(-50%, -50%)', background: '#D0E7D2', zIndex: 999 ,padding:'20px'}}>
    <FontAwesomeIcon icon={faTimes} style={{  cursor: 'pointer' }} onClick={handleAreaClose}  />
    <p style={{textAlign:'center'}}>Area Number:{selectedAreaNumber}</p>
    <div className="pads" ref={padsDivRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
    <div className="tile" ref={tileDivRef}
  style={{
    position: 'absolute',
    top: `${divPosition.y}px`,
    left: `${divPosition.x}px`,
    width: `${(tileData.occ_length/1000)*20}px`,
    height: `${(tileData.occ_breadth/1000)*20}px`,
    background: 'red',
    zIndex: 1,
    display:'flex',
    visibility: isTemporaryTileVisible ? 'visible' : 'hidden',
    justifyContent:'center',
   alignItems:'center',
    cursor: isDragging ? 'grabbing' : 'grab', // Disable pointer events during dragging
  }}
  onMouseDown={handleDivMouseDown}
 
>
  
{ <div
                
                style={{
                  position: 'relative',
                  top:0,
                  left:0,
                  width: `${tileData.foot_length/50}px`, // Set your width
                  height: `${tileData.foot_breadth/50}px`, // Set your height
                  background:bg,
                 
                 
                }}
              >

                </div>}
</div>
{selectedAreaNumber && tilePos.length > 0 && (
        <div>
          {tilePos
            .filter((item) => item.area_number === selectedAreaNumber)
            .map((item) => (
              <div className="tile"
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.x }px`, // Adjust based on your grid unit size
                  top: `${item.y}px`,
                  width: `${item.occ_length/50}px`, // Set your width
                  height: `${item.occ_breadth/50}px`, // Set your height
                  background:'red',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center',
                  textAlign:'center'
                 
                  
                }}
              >
              
                { <div
                key={item.id}
                style={{
                  position: 'absolute',
                 
                  width: `${item.foot_length/50}px`, // Set your width
                  height: `${item.foot_breadth/50}px`, // Set your height
                  background: item.color,
                  fontSize:`${item.foot_breadth/550}px`
                 
                }}
              >
                 <div className="delete-icon" onClick={() => showDeleteModal(item)}>
                    <FontAwesomeIcon icon={faTrash } style={{ cursor: 'pointer',fontSize:'300%' }} />
                  </div>
                <p >{item.customer_name}<br/>{item.slice_name}<br/>{item.occ_length}*{item.occ_breadth}*{item.height}<br/> Inspection Date : {item.inspection_date}<br/> Start Date:{item.start_date}<br/> End Date: {item.end_date}</p>
               
                </div>}
               
              </div>
            ))}
            
        </div>
      )}

    {Array.from({ length: selectedAreaData.rows }).map((_, i) => (
      <div key={i} style={{ display: 'flex'}}>
        {Array.from({ length: selectedAreaData.columns }).map((_, j) => (
          <div
            key={j}
            style={{
              width: `${(selectedAreaData.pad_length)*20}px`,
              height: `${(selectedAreaData.pad_breadth)*20}px`,
              background:'#186F65' ,
               // Include padding and border in total width/height
              marginRight: j < selectedAreaData.columns - 1 ? `${(75 / 1000) * 20}px` : '0px', // Add right margin only for adjacent divs
              marginBottom: i < selectedAreaData.rows - 1 ? `${(75 / 1000) * 20}px` : '0px', // Add bottom margin only for adjacent divs
            }}
           
          >
         
          </div>
        
        ))}
       
      </div>
    ))}

  
    </div>
    <div className='footer' style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
  <button style={{ width: '20%', height: '40px',marginLeft:'5px' }} onClick={handlePlace}>PLACE</button>
  <button style={{ width: '20%', height: '40px', marginLeft: 'auto' }} onClick={handleFixPosition}>FIX</button>
</div>

  </div>
)}

</div>



              
</div>

 {/* Delete Modal */}
 {isDeleteModalVisible && tileToDelete && (
        <div className="custom-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this tile?</p>
            <button onClick={deleteTile}>Yes</button>
            <button style={{marginLeft:'60%'}}onClick={hideDeleteModal}>No</button>
          </div>
        </div>
      )}
</div>
           
        

    );
}

export default Book;

import React, {useState, useEffect} from 'react'
import logo from 'F:/assembly-planning/src/Saint-Gobain_SEFPRO_logo_2023.png';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function UserTable() {
  const [data, setData] = useState([]);
  //const [updatedUserData, setUpdatedUserData] = useState({});
  //const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false); // For changing user status 
  const [isAlert,setIsAlertOpen]=useState(false);// State to control the visibility of the modal
  const [isStatusUpdatedAlertOpen, setIsStatusUpdatedAlertOpen] = useState(false); // For displaying status updated alert
  const [statusUpdatedMessage, setStatusUpdatedMessage] = useState(''); // Message for status updated alert
  
  useEffect(() => {
    axios.get('http://localhost:5000/userdata')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleOpenChangeStatusModal = (userID) => {
    setSelectedUserID(userID);
    setIsChangeStatusModalOpen(true);
  };

  const handleCloseChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const handleStatusSave = () => {
    console.log('SelectedUserID:', selectedUserID);
    console.log('New Status:', newStatus);
  
    axios
      .put(`http://localhost:5000/api/users/${selectedUserID}`, { status: newStatus })
      .then((response) => {
        console.log('Status changed:', response.data, newStatus);
        setStatusUpdatedMessage('Status updated successfully'); // Set the message for the status updated alert
        setIsStatusUpdatedAlertOpen(true);
        setIsChangeStatusModalOpen(false);

        // Update the user's status in the 'data' state
        setData((prevData) =>
          prevData.map((user) => {
            if (user.sgid === selectedUserID) {
              return { ...user, status: newStatus };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        setIsChangeStatusModalOpen(false);
      });
  };

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
    const UserID = document.getElementById('UserIDInput').value;
    const UserName = document.getElementById('UserNameInput').value;
    const Role = document.getElementById('RoleInput').value;
    const Email = document.getElementById('EmailInput').value;
    const Password = document.getElementById('PasswordInput').value;

    axios.post('http://localhost:5000/api/users', { UserID, UserName, Role, Email, Password })
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
      setIsAlertOpen(true);
       // Show the success alert
    })
    .catch((error) => {
      console.log("error occured")
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

  const handleCloseStatusUpdatedAlert = () => {
    setIsStatusUpdatedAlertOpen(false);
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

  const navigateToArea=() =>{
    navigate('/Area')
  }
const navigateToLogin=() => {
  navigate('/')
}
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
     

       
      
      
      <table style={{marginTop:'4%'}}>
        <thead>
          <tr>
            <th>UserID</th>
            <th>UserName</th>
            <th>Role</th>
            <th>Status</th>
           
          </tr>
        </thead>
     
        <tbody style={{color:'black'}}>
          {data.map((item) => (
            <tr key={item.sgid}>
              <td>{item.sgid}</td>
              <td>{item.username}</td>
              <td>{item.usertype}</td>
              <td>{item.status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable
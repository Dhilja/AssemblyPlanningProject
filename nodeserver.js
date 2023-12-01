// server.js

const express = require('express');
const app = express();
const pg = require('pg');
const { Pool } = pg;
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const multer = require('multer');
const path = require('path');


const pool = new Pool({

  user: 'postgres',
  host: '127.0.0.1',
  database: 'SaintGobain-SEFPRO',  //chsnge it to the corresponding dsatabase and password
  password: 'arcane@gk',
  port: 5432, // default PostgreSQL port
});


const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});


app.use(cors());

app.use(bodyParser.json());
const clientId = "hQd7ISBoA79IXZiMQyNwNjmA2tlFAuYm";
const clientSecret = "7XsA00C7MaGdhmqM";

const PORT = 5000; // or any port number you prefer
io.on('connection', (socket) => {
  console.log('A client connected.');

  // When a new pad is added, emit the data to all connected clients
  socket.on('newPadAdded', (data) => {
    console.log('WebSocket data emitted:', data);
    io.emit('padAdded', data);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});


app.get('/api/data', (req, res) => {
  pool.query('SELECT area_number,plant_number,total_area,available_area,occupied_area,status FROM assembly_area', (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
});

app.post('/api/data', (req, res) => {
  const { areaNumber, plantNumber,length , breadth ,padLength,padBreadth,rows,columns } = req.body;
   // Replace column1, column2, column3 with actual column names in your "assembly_pads" table
   
   

  // Assuming you have three columns - column1, column2, and column3
  const query = 'INSERT INTO assembly_area (area_number,plant_number,length,breadth,pad_length,pad_breadth,rows,columns,status) VALUES ($1, $2, $3 , $4 ,$5 ,$6,$7,$8,$9)';

  pool.query(query, [areaNumber,plantNumber,length,breadth,padLength,padBreadth,rows,columns,'active'], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    }

    else {
      // Emit the 'newPadAdded' event with the newly added data
      const newData = {
        area_number: areaNumber,
        plant_number: plantNumber,
        total_area: length * breadth,
        available_area:(length*breadth),
        occupied_area: 0.0,
        status:'active',
      };
      io.emit('newPadAdded', newData);

  
    res.json({ message: 'Data inserted successfully!' });
    }
  });
});



app.put('/api/updateStatus/:areaNumber', (req, res) => {
  const { status } = req.body;
  const areaNumber = req.params.areaNumber;

  // Update the status in the database using a SQL query (you will need to use your database library here)
  const query = 'UPDATE assembly_area SET status = $1 WHERE area_number = $2';

  pool.query(query, [status, areaNumber], (error, result) => {
    if (error) {
      console.error('Error updating status in the database:', error);
      res.status(500).json({ error: 'Error updating status in the database' });
    } else {
      res.status(200).json({ message: 'Status updated successfully' });
    }
  });
});


// ... existing code ...

app.get('/api/data/:areaNumber', (req, res) => {
  const { areaNumber } = req.params;

  // Replace 'assembly_area' with the actual name of your table
  const query = 'SELECT * FROM assembly_area WHERE area_number = $1';

  pool.query(query, [areaNumber], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.put('/api/data/:areaNumber', (req, res) => {

  const { area_number, length, breadth,pad_length,pad_breadth,rows,columns} = req.body;

  // Replace 'assembly_area' with the actual name of your table
  const query = 'UPDATE assembly_area SET  length = $2, breadth = $3,pad_length = $4,pad_breadth = $5,rows=$6,columns=$7 WHERE area_number = $1';
  console.log('Received data for update:', { area_number, length, breadth, pad_length, pad_breadth, rows, columns });
  pool.query(query, [area_number, length, breadth, pad_length, pad_breadth, rows,columns], (error, result) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Error updating data' });
    } else {
      // Emit the 'padUpdated' event with the updated data
      const updatedData = {
        area_number: area_number,
        total_area: length * breadth,
        available_area: length * breadth,
        occupied_area: 0.0,
      };

     
      io.emit('padUpdated', updatedData);

      res.json({ message: 'Data updated successfully!' });
    }
  });
});

// ... existing code ...






//planning page

app.post('/api/product', (req, res) => {
  const { customerName, oaNumber, drawingNumber, modelName, length, breadth, height,inspection } = req.body;
  
  const query = 'INSERT INTO product (customer_name,oa_number,drawing_number,module_name,length,breadth,height,inspection_date) VALUES ($1, $2, $3 , $4 ,$5 ,$6, $7, $8)';

  pool.query(query, [customerName,oaNumber,drawingNumber,modelName,length,breadth,height,inspection], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      
      if (error.code === '23505') {
        // Duplicate key violation (unique constraint)
        const duplicateParam = error.detail.match(/\((.*?)\)/)[1];
        res.status(400).json({ error: `Duplicate value for parameter: ${duplicateParam}. Ensure uniqueness of parameters.` });
      } else if (error.code === '500') {
        // Not null violation
        const missingParam = error.column;
        res.status(400).json({ error: `Missing value for parameter: ${missingParam}. All parameters are required.` });
      } else {
        // Generic error message for other errors
        res.status(500).json({ error: 'Error inserting data.' });
      }
    }

    else 
    {
      res.status(200).json({ message: 'Data inserted successfully' });

    }


    
  });
  
});


app.get('/api/product/:oa_number', (req, res) => {
  const { oa_number } = req.params;

  // Replace 'assembly_area' with the actual name of your table
  const query = 'SELECT drawing_number from product WHERE oa_number = $1';

  pool.query(query, [oa_number], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

const storage = multer.diskStorage({
  destination: 'f:/uploads', // Set your desired file upload directory here
  filename: (req, file, cb) => {
    // Use the drawing number as the filename
    const drawingNumber = req.params.drawingNumber;
    const ext = path.extname(file.originalname);
    const filename = `${drawingNumber}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const APS = require('forge-apis');
const qs = require('querystring');
app.use(bodyParser.urlencoded({ extended: false }));

// API endpoint for file upload
app.post('/api/upload/:drawingNumber', upload.single('file'), async (req, res) => {
  const drawingNumber = req.params.drawingNumber;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Perform authentication to get an access token
    const accessToken = await performAuthentication(clientId, clientSecret);

    // Create a new Forge Data Management client
    const client = new APS.AuthClientTwoLegged(clientId, clientSecret, [
      'data:read', 'data:write', 'data:create', 'data:search', 'bucket:create', 'bucket:read'
    ], true);

    

    client.credentials = { access_token: accessToken };

    // Start a database transaction
    await pool.query('BEGIN');

    // Insert the file data into the database
    const insertQuery = `
      INSERT INTO files (drawing_number, file_name, file_path) VALUES ($1, $2, $3)`;

    const filePath = path.join('F:/uploads', `${drawingNumber}${path.extname(file.originalname)}`);
    const values = [drawingNumber, drawingNumber, filePath];

    try {
      await pool.query(insertQuery, values);
      console.log("Insert successful");
    } catch (error) {
      console.error("Error inserting data:", error);
      // Handle the error or return an appropriate response
    }

    // Upload the file to Autodesk Forge and get the URN
    const bucketKey = 'vygn-real-time-tracker'; // Change this to your specific bucket key
    const objectName = `${drawingNumber}${path.extname(file.originalname)}`;
    console.log("Before uploading");

   
try {
  // Wait for the file upload to complete
  
  const uploadResponse = await client.objects.upload(bucketKey, objectName, file, {});
  console.log("Upload successful");

  const urn = uploadResponse.body.objectId;

  // Update the file data in the database with the URN
  const updateQuery = `
    UPDATE files SET urn = $1 WHERE drawing_number = $2`;

  const updateValues = [urn, drawingNumber];

  await pool.query(updateQuery, updateValues);

  // Commit the database transaction
  await pool.query('COMMIT');

  // Return a success response to the client
  res.json({ message: 'Data updated successfully' });
} catch (error) {
  // Handle and log any upload errors
  console.error("Upload error:", error);

  // Roll back the database transaction if there is an error
  await pool.query('ROLLBACK');

  // Return an error response to the client
  res.status(500).json({ message: 'Error' });
}
  }catch(error){
    console.error(" error:", error);

  }
});


async function performAuthentication(clientId, clientSecret) {
  const data = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'data:read data:write data:create data:search bucket:create bucket:read',
  });

  try {
    const response = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', data, {
      timeout: 25000, 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('Authentication response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}



//slicing page
app.post('/api/slicedparts', (req, res) => {
  const { sliceName,length,breadth,height,startDate,endDate,blocks,drawingNumber } = req.body;
  
  const query = 'INSERT INTO slicedparts(slice_name,length,breadth,height,start_date,end_date,no_of_blocks,drawing_number) VALUES ($1, $2, $3 , $4 ,$5 ,$6, $7, $8)';

  pool.query(query, [sliceName,length,breadth,height,startDate,endDate,blocks,drawingNumber], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      
      res.status(500).json({ error: 'Error inserting data' });
    }

    else 
    {
      res.status(200).json({ message: 'Data inserted successfully' });

    }


    
  });
  
});


app.get('/api/slicedparts/:drawingNumber', (req, res) => {
  const { drawingNumber } = req.params;

  // Replace 'assembly_area' with the actual name of your table
  const query = `
  SELECT id, slice_name, length, breadth, height,
    to_char(start_date, 'YYYY-MM-DD') as start_date,
    to_char(end_date, 'YYYY-MM-DD') as end_date
  FROM slicedparts
  WHERE drawing_number = $1;
`;

  pool.query(query, [drawingNumber], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
      
    }
  });
});



// Endpoint to insert additional data and fetch corresponding footprint area and occupied area
app.post('/api/slicedparts/:id', (req, res) => {
  const { id } = req.params;
  const { additionalLength, additionalBreadth, walkAroundDistance } = req.body;

  // Insert the additional data into the database
  const insertQuery = `
      UPDATE  slicedparts SET additional_length =$2, additional_breadth =$3, walkaround_distance=$4 
      where id = $1`;

  pool.query(insertQuery, [id, additionalLength, additionalBreadth, walkAroundDistance], (insertError, insertResult) => {
    if (insertError) {
      console.error('Error inserting data:', insertError);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      // Fetch the corresponding footprint area and occupied area for the same drawing number
      const fetchQuery = `
        SELECT footprint_area, occupied_area
        FROM slicedparts
        WHERE id = $1
        `;

      pool.query(fetchQuery, [id], (fetchError, fetchResult) => {
        if (fetchError) {
          console.error('Error fetching data:', fetchError);
          res.status(500).json({ error: 'Error fetching data' });
        } else {
          res.json(fetchResult.rows[0]);
        }
      });
    }
  });
});

app.get('/api/plants', (req, res) => {
  

  // Replace 'assembly_area' with the actual name of your table
  const query = 'SELECT distinct plant_number from assembly_area';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/areas', (req, res) => {
  

  // Replace 'assembly_area' with the actual name of your table
  const query = `SELECT area_number,plant_number,length,breadth from assembly_area where status='active'`;

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/area/:area_number', (req, res) => {
  const { area_number } = req.params;

  // Replace 'assembly_area' with the actual name of your table
  const query = 'SELECT rows,columns,pad_length,pad_breadth from assembly_area WHERE area_number = $1';

  pool.query(query, [area_number], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get('/api/tile/:id', (req, res) => {
  const { id } = req.params;

  // Replace 'assembly_area' with the actual name of your table
  const query = `SELECT
  sp.foot_length,
  sp.foot_breadth,
  sp.occ_length,
  sp.occ_breadth,
  p.customer_name
FROM
  slicedparts AS sp
JOIN
  product AS p ON sp.drawing_number = p.drawing_number
WHERE
  sp.id = $1`


  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows[0]);
    }
  });
});


app.post('/api/sliceposition', (req, res) => {
 
  const {id, x, y, area_number, color, drawing_number } = req.body;
  

  const query = 'INSERT into sliceposition(id,x,y,area_number,color,drawing_number) values ($1,$2,$3,$4,$5,$6)';

  pool.query(query, [id,x, y, area_number, color, drawing_number], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/sliceposition/:id', (req, res) => {
 
  const { id } = req.params;
  // Replace 'assembly_area' with the actual name of your table
  const query = `
  SELECT
    s.id,
    p.slice_name,
    s.x,
    s.y,
    s.area_number,
    s.color,
    s.drawing_number,
    p.height,
    p.foot_length,
    p.foot_breadth,
    p.occ_length,
    p.occ_breadth,
    pt.customer_name,
    to_char(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
    to_char(p.start_date, 'YYYY-MM-DD') as start_date,
    to_char(p.end_date, 'YYYY-MM-DD') as end_date
    
  FROM
    sliceposition AS s
  JOIN
    slicedparts AS p ON s.id = p.id
  JOIN
    product AS pt ON s.drawing_number = pt.drawing_number
    where
    (p.start_date <= (SELECT end_date FROM slicedparts WHERE id = $1)
    AND p.end_date >= (SELECT start_date FROM slicedparts WHERE id = $1))
  `;
  
  pool.query(query,  [id],(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows)
      console.log(result.rows);
    }
  });
});


app.get('/api/position', (req, res) => {
 
  const { start_date, end_date } = req.query;
  // Replace 'assembly_area' with the actual name of your table
  const query = `SELECT
  s.id,
  p.slice_name,
  s.x,
  s.y,
  s.area_number,
  s.color,
  s.drawing_number,
  p.height,
  p.foot_length,
  p.foot_breadth,
  p.occ_length,
  p.occ_breadth,
  pt.customer_name,
  TO_CHAR(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
  TO_CHAR(p.start_date, 'YYYY-MM-DD') as start_date,
  TO_CHAR(p.end_date, 'YYYY-MM-DD') as end_date
FROM
  sliceposition AS s
JOIN
  slicedparts AS p ON s.id = p.id
JOIN
  product AS pt ON s.drawing_number = pt.drawing_number
WHERE
p.start_date::date <= $2
  AND
  p.end_date::date >= $1;`


  pool.query(query,   [start_date, end_date],(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/bg', (req, res) => {
 
 
  // Replace 'assembly_area' with the actual name of your table
  const query = `
  SELECT
    s.id,
    p.slice_name,
    s.x,
    s.y,
    s.area_number,
    s.color,
    s.drawing_number,
    p.height,
    p.foot_length,
    p.foot_breadth,
    p.occ_length,
    p.occ_breadth,
    pt.customer_name,
    to_char(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
    to_char(p.start_date, 'YYYY-MM-DD') as start_date,
    to_char(p.end_date, 'YYYY-MM-DD') as end_date
    
  FROM
    sliceposition AS s
  JOIN
    slicedparts AS p ON s.id = p.id
  JOIN
    product AS pt ON s.drawing_number = pt.drawing_number
    
  `;
  
  pool.query(query,(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows)
      
    }
  });
});





app.use(express.json());

app.delete('/api/tile/:id', (req, res) => {
  const { id } = req.params;

  // Perform the delete operation in the database
  pool.query('DELETE FROM sliceposition WHERE id = $1', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'An error occurred while deleting the tile.' });
      return;
    }

    if (results.rowCount === 0) {
      res.status(404).json({ error: 'Tile not found.' });
    } else {
      res.status(200).json({ message: 'Tile deleted successfully.' });
    }
  });
});





//viewer set up
// Endpoint to handle authentication and return the access token
app.post('/authenticate', async (req, res) => {
  try {
    console.log("hello");
    // Perform the authentication logic here (e.g., using client ID and secret)
    const accessToken = await performAuthentication(clientId, clientSecret);

    // Send the access token as a JSON response
    res.json({ access_token: accessToken });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.post('/login', async (req, res) => {
  const { sgid, password } = req.body;

  try {
    const querySelect = {
      text: 'SELECT * FROM "users" WHERE "sgid" = $1 AND "userpassword" = $2',
      values: [sgid, password],
    };
    const resultSelect = await pool.query(querySelect);

    if (resultSelect.rows.length === 1) {
      const userRole = resultSelect.rows[0].usertype;

      // Update LastLogin
      const queryUpdate = {
        text: 'UPDATE "users" SET "lastlogin" = CURRENT_TIMESTAMP WHERE "sgid" = $1',
        values: [sgid],
      };
      await pool.query(queryUpdate);

      // Check if userRole is defined before applying toLowerCase()
      const lowercaseRole = userRole.toLowerCase();

      if (lowercaseRole === 'viewer') {
        res.json({ success: true, message: 'Login successful', role: 'viewer' });
      } else if (lowercaseRole === 'supervisor') {
        res.json({ success: true, message: 'Login successful', role: 'supervisor' });
      } else if (lowercaseRole === 'admin') {
        res.json({ success: true, message: 'Login successful', role: 'admin' });
      } else {
        res.json({ success: true, message: 'Login successful', role: 'Other' });
      }
    } else {
      res.json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




// POST route to add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { UserID, UserName, Role, Email, Password } = req.body;

    // Perform database insertion using the provided data
    await pool.query(
      'INSERT INTO public."users" ("sgid", "username", "usertype", "useremail", "userpassword",  "status") VALUES ($1, $2, $3, $4, $5,  $6)',
      [UserID, UserName, Role, Email, Password, 'INACTIVE']
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


//Update Status
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    //console.log(id,status)

    // Perform the status update operation using the user ID
    await pool.query('UPDATE public."users" SET "status" = $1 WHERE "sgid" = $2', [status, id]);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

app.get('/userdata', async (req, res) => {
  try {
    const result = await pool.query('SELECT "sgid", "username", "usertype", "status" FROM public."users" ORDER BY "sgid"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

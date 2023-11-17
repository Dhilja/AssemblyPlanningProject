import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './login';
import Dashboard from './component/supervisor/dashboard/dashBoard';
import Planning from './component/supervisor/planning/Planning';
import FileUpload from './component/supervisor/fileupload/fileUpload';
import Slicing from './component/supervisor/slicing/slicing';
import Book from './component/supervisor/book/bookPage';
import ViewerDashboard from './component/viewer/dashboard/viewerDashboard';
import Viewerarea from './component/viewer/area/viewerArea';
import Area from './component/supervisor/Area/viewerArea'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/dashBoard" element={<Dashboard />} />
        <Route path="/Planning" element={<Planning />} />
        <Route path="/fileUpload" element={<FileUpload />} />
        <Route path="/slicing" element={<Slicing />} />
        <Route path="/bookPage" element={<Book />} />
        <Route path="/viewerDashboard" element={<ViewerDashboard />} />
        <Route path="/viewerArea" element={<Viewerarea />} />
        <Route path="/Area" element={<Area />} />
      </Routes>
    </Router>
  );
}

export default App;

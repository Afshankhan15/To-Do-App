import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Dash from "./Components/Dash/Dash";
import CreateTask from "./Components/CreateTask/CreateTask";
import UpdateTask from "./Components/UpdateTask/UpdateTask";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/update/:id" element={<UpdateTask />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

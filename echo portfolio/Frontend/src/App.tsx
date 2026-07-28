import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Testimonials from './pages/Testimonials';
import Packages from './pages/Packages';
import ContactUs from './pages/ContactUs';
import ServiceDetails from './pages/ServiceDetails';
import Services from './pages/Services';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:id" element={<ProjectDetails />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="packages" element={<Packages />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="services" element={<Services />} />
          <Route path="service/:id" element={<ServiceDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

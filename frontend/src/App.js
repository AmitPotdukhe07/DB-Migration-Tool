import { Container } from '@mui/material';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './component/Header'
import HomeScreen from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import Footer from './component/Footer';
import { useState } from 'react';
import { ReactInternetSpeedMeter } from 'react-internet-meter';
function App() {
  const [wifiSpeed, setwifiSpeed] = useState("Checking ... ");



  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        <Header />
        <Container sx={{ marginTop: 5, flex: '1 0 auto' }}>
          <Routes>
            <Route path="/dashboard" element={<HomeScreen />} />
            <Route path="/" element={<LoginScreen />} />

          </Routes>
        </Container>
        <Footer />
      </div>
    </>
  );
}

export default App;

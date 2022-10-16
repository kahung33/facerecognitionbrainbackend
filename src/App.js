import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';


function App() {
  

  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      <ParticlesBg className ='particles' type='polygon' bg={true} />
      {/* {
      <FaceRecognition />} */}
    </div>
  );
}

export default App;

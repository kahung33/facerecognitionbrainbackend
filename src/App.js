import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'


console.log(Clarifai);

const app = new Clarifai.App({
  apiKey: 'd37936effb2c4579a90dc12a2daf243ae9bce8df45964982ab401a67dc52efd6'
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height)
    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow : clarifaiFace.top_row * height,
      bottomRow : height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box : box});
  }

  onInputChange = (event) => {
    this.setState({ input : event.target.value });
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    console.log('calling api');
    const USER_ID = 'kahung33';
    const PAT = '2a6d757f14714eb8a9b6a13b122574ea';
    const APP_ID = 'brainrecog';
    const MODEL_ID ='face-detection';
    const MODEL_VERSION_ID='6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = this.state.input;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('result:', result);
        this.displayFaceBox(this.calculateFaceLocation(result));
      }).catch(error => console.log('error', error));
  }

  render(){
    return (
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange = {this.onInputChange} 
        onButtonSubmit = {this.onButtonSubmit}/>
        <ParticlesBg className ='particles' type='polygon' bg={true} />
        <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/>
      </div>
    );
  }
  }
  

export default App;

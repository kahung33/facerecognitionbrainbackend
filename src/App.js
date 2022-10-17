import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// console.log(Clarifai);

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
      route: 'signIn',
      isSignedIn : false, 
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width,height)
    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow : clarifaiFace.top_row * height,
      bottomRow : height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    // console.log(box);
    this.setState({box : box});
  }
 
  onInputChange = (event) => {
    this.setState({ input : event.target.value });
  }

  //Doing in way of JS REST API
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    // console.log('calling api');
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
    //cast the response to Javascript Obejct
      .then(response => response.json())
      .then(result => {
        // //use this to check how to get the bounding box
        // console.log('result:', result);
        this.displayFaceBox(this.calculateFaceLocation(result));
      }).catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signIn'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route : route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
        <ParticlesBg className ='particles' type='polygon' bg={true} />
        { route === 'home' 
          ?<div>
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange = {this.onInputChange} 
          onButtonSubmit = {this.onButtonSubmit}/>
          <FaceRecognition box = {box} imageUrl = {imageUrl}/>
          </div>
          : (
            route === 'signIn' ?
            <SignIn onRouteChange={this.onRouteChange}/> 
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }
        
      </div>
    );
  }
  }
  

export default App;

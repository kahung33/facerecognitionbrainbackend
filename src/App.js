import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// console.log(Clarifai);



const initialState = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signIn',
      isSignedIn : false, 
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signIn',
      isSignedIn : false, 
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    }
  }


  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
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
    fetch(' https://salty-caverns-71107.herokuapp.com/imageurl',{
      method : 'post',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({
        input : this.state.input,
      })
    }).then(response => response.json())
      .then(result => {
        if (result) {
          fetch(' https://salty-caverns-71107.herokuapp.com/image',{
            method : 'put',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
              id : this.state.user.id,
            })
          })
          .then(response => response.json())
          //might add .catch after each .then statement
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          
        }
        // //use this to check how to get the bounding box
        // console.log('result:', result);
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signIn'){
      this.setState(initialState)
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
          <Rank user = {this.state.user}/>
          <ImageLinkForm 
          onInputChange = {this.onInputChange} 
          onButtonSubmit = {this.onButtonSubmit}/>
          <FaceRecognition box = {box} imageUrl = {imageUrl}/>
          </div>
          : (
            route === 'signIn' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser = {this.loadUser}/> 
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
        }
        
      </div>
    );
  }
  }
  

export default App;

import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const API_KEY = process.env.REACT_APP_API_KEY;

const app = new Clarifai.App({
  apiKey: API_KEY
});

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      // clarifaiFace = the image
      // left_col = the % of the width
      // width = total with of img
      // if we multiply this we get the point where the left col should be 
      leftCol: clarifaiFace.left_col * width,
  
      //repeat for others
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    //event.target.value prints out the value of the event. I.e prints out everything being typed
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input }); //update img url with input

    // refactored to arrow functions half way through video.
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

//react particles to make the background a little jazzier
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

const initState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin', //  'signin' initially so that we have to navigate to the sign in page before anything else
  isSignedIn: false, // same story as above
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  // constructor needed for classes with state
  constructor() {
    super();
    // components with state are things that need to be recognised as they change on the fly 
    this.state = initState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // takes in response data and calculated the points at which the corners of the face recognition box is
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
      //repeat for others
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // need to change name of this function when finished the course as it's misleading
  // this sets the state of the box, it doesn't display anything
  faceBox = (box) => {
    this.setState({ box: box });
  }

  // event listener to set the state of the input
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    //event.target.value prints out the value of the event. I.e prints out everything being typed
  }

  // sets the state of the image URL 
  // extracts the response and passes locations to calculation functions
  // also gets no. of entries for a user
  // a better name might be onPhotoSubmit 
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});  //update img url with input
      fetch('https://stark-thicket-50588.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://stark-thicket-50588.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.faceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initState);
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  // usual react rendering function
  render() {

    //NB ----- Destructuring!! i.e stopping repetition of this.state 
    const {isSignedIn, imageUrl, route, box} = this.state;

    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {
          // first conditional statement... if state is on home screen great, otherwise...
          route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : ( 
            //second conditional statement... if state is on sign-in screen great, otherwise register screen
            route === 'signin'
              ? <div>
                  <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              </div> 
              : <div>
                  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              </div>
          )
        }
      </div>
    );
  }
}

export default App;

import React,{ Fragment,useEffect } from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/alert';
import {Provider} from 'react-redux';
import store from './store';
import './App.css';
import {loadUser} from './actions/auth';
import CreateProfile from './components/profile-forms/CreateProfile';
import setAuthToken from './utilis/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/privateRoutes';
import EditProfile from './components/profile-forms/editProfile';
import AddExperience from './components/profile-forms/addExperience';
import AddEducation from './components/profile-forms/addEducation';
import Profiles from './components/profiles/Profiles';
import ProfileById from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App=() =>{
  
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);

  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar/>
        <Route exact path='/'  component={Landing} />
        <section className='container'>
          <Alert/>
          <Switch>
            <PrivateRoute exact path='/dashboard' component={Dashboard}/>
            <PrivateRoute exact path='/posts/:id' component={Post}/>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/profiles' component={Profiles}/>
            <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
            <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
            <PrivateRoute eaxct path='/add-experience' component={AddExperience}/>
            <PrivateRoute eaxct path='/add-education' component={AddEducation}/>
            <Route exact path='/profile/:id' component={ProfileById} />
            <PrivateRoute exact path='/posts' component={Posts} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)};


export default App;

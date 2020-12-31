import React from 'react';
import './bootstrap.min.css';
import './App.css';

import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

import NavBar from './components/NavBar';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Main />
      <footer style={{ textAlign: 'left', paddingLeft: '5px' }}>
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
          <Button variant="success">New Features 🎉</Button>
        </OverlayTrigger>
      </footer>
      <footer style={{ textAlign: 'right' }}>
        <p>By <a href="https://github.com/Siyer2" target="_blank" rel="noopener noreferrer">Syam</a>&nbsp;&nbsp;</p>
      </footer>
    </div>
  );
}

const newFeatures = [
  "Double Majors", 
  "Delete Courses", 
  "Mark course as completed with the tick"
]
const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">31st December, 2020</Popover.Title>
    {newFeatures.map((feature, i) => {
      return (
        <Popover.Content key={i + feature}>
          + {feature}
        </Popover.Content>)
    })}
  </Popover>
);

export default App;

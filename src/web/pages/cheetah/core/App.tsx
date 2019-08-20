import * as React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Webview from '../layouts/Webview';
import Login from '../layouts/Login';
import Settings from '../layouts/Settings';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Webview />
      <Footer />
      <Login />
      <Settings />
    </div>
  );
};

export default App;

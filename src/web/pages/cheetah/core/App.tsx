import * as React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Webview from '../layouts/Webview';
import Login from '../layouts/Login';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Webview />
      <Footer />
      <Login />
    </div>
  );
};

export default App;

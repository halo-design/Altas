import * as React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Webview from '../layouts/Webview';

const App = (): any => {
  return (
    <div className="app">
      <Header />
      <Webview />
      <Footer />
    </div>
  );
};

export default App;

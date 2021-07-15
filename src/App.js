import React from 'react';
import Header from "./components/Header/Header";
import InfoBox from "./components/InfoBox/InfoBox";

function App() {
  return (
    <div className="app">
      <Header />

      <div className="app__stats">
        <InfoBox 
          title="Coronavirus Cases" 
          cases={123}
          total={2000}
        />
        <InfoBox 
          title="Recovered"
          cases={124}
          total={3000} 
        />
        <InfoBox 
          title="Deaths"
          cases={125} 
          total={4000}
        />
      </div>

    </div>
  );
}

export default App;

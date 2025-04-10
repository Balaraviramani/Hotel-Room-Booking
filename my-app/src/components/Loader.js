import React from 'react';
import RingLoader from "react-spinners/RingLoader";

function Loader() {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
      }}>
    <div className="sweet-loading " >
      <RingLoader color="#000" loading={true} size={80} />
    </div>
    </div>
  );
}

export default Loader;

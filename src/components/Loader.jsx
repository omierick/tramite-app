// src/components/Loader.jsx
const Loader = () => {
    return (
      <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spinner" />
      </div>
    );
  };
  
  export default Loader;
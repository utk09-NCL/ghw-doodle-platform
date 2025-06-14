import CanvasComponent from "./CanvasComponent";

const App = () => {
  return (
    <main>
      <h1
        style={{
          textAlign: "center",
          color: "#333333",
          marginBottom: "20px",
          padding: "4px 0",
        }}
      >
        Doodle Canvas
      </h1>
      <CanvasComponent />
    </main>
  );
};

export default App;

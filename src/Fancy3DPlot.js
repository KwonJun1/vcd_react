import React from 'react';
import Plot from 'react-plotly.js';

const Fancy3DPlot = ({ selectedTemperatureData }) => {
  const processData = () => {
    const x = selectedTemperatureData[0].map(point => point.temperature);
    const y = selectedTemperatureData.map((_, index) => `${index}`);
    const z = selectedTemperatureData.map(curve => 
      curve.map(point => point.value)
    );

    return [
      {
        x: x,
        y: y,
        z: z,
        type: 'surface',
        colorscale: 'Viridis',
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "#42f462",
            project: { z: true }
          }
        }
      }
    ];
  };

  const layout = {
    // title: '3D Temperature vs tan δ Plot',
    autosize: true,
    scene: {
      xaxis: { title: 'Temperature (°C)' },
      yaxis: { title: 'Curve' },
      zaxis: { title: 'tan δ' },
      camera: {
        eye: { x: 1.5, y: -1.5, z: 0.5 }
      }
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 40
    }
  };

  return (
    <Plot
      data={processData()}
      layout={{
        ...layout,
        autosize: true,
        height: 520, // Set this to match the container height
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
};

export default Fancy3DPlot;
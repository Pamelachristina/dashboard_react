import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from './us.json'; // Ensure you have the US topojson data
import '../App.css'; // Correct path to App.css

const USMap = () => {
  const svgRef = useRef();
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const width = 800; // Adjusted width for the map
    const height = 500; // Adjusted height for the map

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `-100 0 ${width + 200} ${height}`) // Adjust viewBox to include all states
      .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio
      .attr('width', '100%') // Responsive width
      .attr('height', '100%') // Responsive height
      .attr('style', 'max-width: 100%; height: auto;');

    const path = d3.geoPath();

    const g = svg.append('g');

    const states = g.append('g')
      .attr('fill', '#444')
      .attr('cursor', 'pointer')
      .selectAll('path')
      .data(topojson.feature(us, us.objects.states).features)
      .join('path')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#6baed6');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#444');
        setPopupData(null);
      })
      .on('click', function(event, d) {
        setPopupData({
          name: d.properties.name,
          coords: d3.pointer(event)
        });
      })
      .attr('d', path);

    states.append('title')
      .text(d => d.properties.name);

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
  }, []);

  return (
    <div className="us-map-container">
      <svg ref={svgRef}></svg>
      {popupData && (
        <div className="popup" style={{
          left: popupData.coords[0],
          top: popupData.coords[1]
        }}>
          <h4>{popupData.name}</h4>
          <p>User stats...</p>
        </div>
      )}
    </div>
  );
};

export default USMap;








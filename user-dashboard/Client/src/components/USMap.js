import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from './us.json'; // Ensure you have the US topojson data
import '../App.css'; // Correct path to App.css

const USMap = ({ data = [] }) => {
  const svgRef = useRef();
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 960 600`) // Adjust viewBox to include all states
      .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio
      .attr('width', '100%') // Responsive width
      .attr('height', '100%') // Responsive height
      .attr('style', 'max-width: 100%; height: auto;');

    const path = d3.geoPath();

    const g = svg.append('g');

    // Ensure data is defined and is an array
    const stateDataMap = (Array.isArray(data) ? data : []).reduce((acc, item) => {
      acc[item.state] = item.count;
      return acc;
    }, {});

    const states = g.append('g')
      .attr('fill', '#041C2C')
      .attr('cursor', 'pointer')
      .selectAll('path')
      .data(topojson.feature(us, us.objects.states).features)
      .join('path')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#F0B323');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#041C2C');
        setPopupData(null);
      })
      .on('click', function(event, d) {
        const coords = d3.pointer(event);
        const container = svg.node().getBoundingClientRect();
        const popupWidth = 250; // Adjust as necessary
        const popupHeight = 200; // Adjust as necessary

        // Offset values to position the popup off-centered
        const offsetX = 10;
        const offsetY = 10;

        let x = coords[0] + offsetX;
        let y = coords[1] + offsetY;

        // Adjust x position to ensure popup is within bounds
        if (x + popupWidth > container.width) {
          x = container.width - popupWidth;
        } else if (x < 0) {
          x = 0;
        }

        // Adjust y position to ensure popup is within bounds
        if (y + popupHeight > container.height) {
          y = container.height - popupHeight;
        } else if (y < 0) {
          y = 0;
        }

        setPopupData({
          name: d.properties.name,
          count: stateDataMap[d.id] || 0,
          coords: [x, y]
        });
      })
      .attr('d', path);

    states.append('title')
      .text(d => d.properties.name);

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 2) // Increase the stroke width
      .attr('stroke-linejoin', 'round')
      .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
  }, [data]); // Re-run the effect when data changes

  return (
    <div className="us-map-container">
      <svg ref={svgRef}></svg>
      {popupData && (
        <div className="popup" style={{
          left: `${popupData.coords[0]}px`,
          top: `${popupData.coords[1]}px`
        }}>
          <h4>{popupData.name}</h4>
          <p>Users: {popupData.count}</p>
        </div>
      )}
    </div>
  );
};

export default USMap;










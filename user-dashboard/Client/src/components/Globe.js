import React, { useEffect } from 'react';
import { select, geoOrthographic, geoPath, drag, json } from 'd3';
import * as topojson from 'topojson-client';

const Globe = () => {
  useEffect(() => {
    const width = 300, // Adjust the size as needed
      height = 300,
      sphere = { type: 'Sphere' };

    const projection = geoOrthographic()
      .scale(140) // Adjust the scale as needed
      .translate([width / 2, height / 2])
      .precision(0.5);

    const path = geoPath(projection);

    const svgContainer = select('#globe');
    svgContainer.selectAll('*').remove(); // Remove existing SVG elements

    const svg = svgContainer.append('svg')
      .attr('width', width)
      .attr('height', height);

    svg.append('path')
      .datum(sphere)
      .attr('d', path)
      .attr('fill', '#1f77b4');

    let g = svg.append('g');

    const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

    json(url).then(world => {
      g.selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        .attr('d', path);
    }).catch(error => {
      console.error('Failed to load world map data:', error);
    });

    const dragBehavior = drag()
      .on('drag', (event) => {
        const rotate = projection.rotate();
        const k = 140 / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        g.selectAll('path').attr('d', path);
        svg.selectAll('path').attr('d', path);
      });

    svg.call(dragBehavior);
  }, []);

  return <div id="globe"></div>;
};

export default Globe;



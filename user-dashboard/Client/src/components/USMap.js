import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from './us.json'; // Ensure you have the US topojson data
import '../App.css'; // Correct path to App.css

const USMap = ({ data = [] }) => {
  const svgRef = useRef();
  const [popupData, setPopupData] = useState(null);

  // Create the state abbreviation to ID map
  const stateAbbrToIdMap = {
    'AL': '01',
    'AK': '02',
    'AZ': '04',
    'AR': '05',
    'CA': '06',
    'CO': '08',
    'CT': '09',
    'DE': '10',
    'DC': '11',
    'FL': '12',
    'GA': '13',
    'HI': '15',
    'ID': '16',
    'IL': '17',
    'IN': '18',
    'IA': '19',
    'KS': '20',
    'KY': '21',
    'LA': '22',
    'ME': '23',
    'MD': '24',
    'MA': '25',
    'MI': '26',
    'MN': '27',
    'MS': '28',
    'MO': '29',
    'MT': '30',
    'NE': '31',
    'NV': '32',
    'NH': '33',
    'NJ': '34',
    'NM': '35',
    'NY': '36',
    'NC': '37',
    'ND': '38',
    'OH': '39',
    'OK': '40',
    'OR': '41',
    'PA': '42',
    'RI': '44',
    'SC': '45',
    'SD': '46',
    'TN': '47',
    'TX': '48',
    'UT': '49',
    'VT': '50',
    'VA': '51',
    'WA': '53',
    'WV': '54',
    'WI': '55',
    'WY': '56'
  };

  // Create a reverse map for names
  const stateIdToNameMap = {
    '01': 'Alabama',
    '02': 'Alaska',
    '04': 'Arizona',
    '05': 'Arkansas',
    '06': 'California',
    '08': 'Colorado',
    '09': 'Connecticut',
    '10': 'Delaware',
    '11': 'District of Columbia',
    '12': 'Florida',
    '13': 'Georgia',
    '15': 'Hawaii',
    '16': 'Idaho',
    '17': 'Illinois',
    '18': 'Indiana',
    '19': 'Iowa',
    '20': 'Kansas',
    '21': 'Kentucky',
    '22': 'Louisiana',
    '23': 'Maine',
    '24': 'Maryland',
    '25': 'Massachusetts',
    '26': 'Michigan',
    '27': 'Minnesota',
    '28': 'Mississippi',
    '29': 'Missouri',
    '30': 'Montana',
    '31': 'Nebraska',
    '32': 'Nevada',
    '33': 'New Hampshire',
    '34': 'New Jersey',
    '35': 'New Mexico',
    '36': 'New York',
    '37': 'North Carolina',
    '38': 'North Dakota',
    '39': 'Ohio',
    '40': 'Oklahoma',
    '41': 'Oregon',
    '42': 'Pennsylvania',
    '44': 'Rhode Island',
    '45': 'South Carolina',
    '46': 'South Dakota',
    '47': 'Tennessee',
    '48': 'Texas',
    '49': 'Utah',
    '50': 'Vermont',
    '51': 'Virginia',
    '53': 'Washington',
    '54': 'West Virginia',
    '55': 'Wisconsin',
    '56': 'Wyoming'
  };

  // Define states that should have the popup centered
  const centeredStates = new Set([
    '02', // Alaska
    '04', // Arizona
    '06', // California
    '08', // Colorado
    '10', // Delaware
    '16', // Idaho
    '20', // Kansas
    '17', // Illinois
    '18', // Indiana
    '19', // Iowa
    '21', // Kentucky
    '23', // Maine
    '24', // Maryland
    '30', // Montana
    '31', // Nebraska
    '32', // Nevada
    '33', // New Hampshire
    '34', // New Jersey
    '37', // North Carolina
    '38', // North Dakota
    '39', // Ohio
    '41', // Oregon
    '42', // Pennsylvania
    '49', // Utah
    '50', // Vermont
    '51', // Virginia
    '53', // Washington
    '54', // West Virginia
    '29'  // Missouri
  ]);

  useEffect(() => {
    console.log("USMap data:", data); // Log the data passed to USMap
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 960 600') // Adjust viewBox to include all states
      .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio
      .attr('width', '100%') // Responsive width
      .attr('height', '100%') // Responsive height
      .attr('style', 'max-width: 100%; height: auto;');

    const path = d3.geoPath();

    const g = svg.append('g');

    // Log the state IDs and names from the JSON file
    const statesData = topojson.feature(us, us.objects.states).features.map(state => {
      const name = stateIdToNameMap[state.id];
      console.log("State object:", state);
      return {
        id: state.id,
        name: name ? name : "Unknown"
      };
    });

    console.log("States Data from JSON:", statesData);

    // Create a mapping from state abbreviations to IDs
    const stateIdMap = Object.keys(stateAbbrToIdMap).reduce((acc, abbr) => {
      acc[stateAbbrToIdMap[abbr]] = abbr;
      return acc;
    }, {});

    console.log("State ID Map:", stateIdMap);

    const stateDataMap = (Array.isArray(data) ? data : []).reduce((acc, item) => {
      const stateId = stateAbbrToIdMap[item.state];
      if (stateId) {
        acc[stateId] = {
          minorityServingInstitutions: item.minorityservinginstitutions,
          EPSCOR: item.epscor,
        };
      }
      return acc;
    }, {});

    console.log("stateDataMap:", stateDataMap); // Log the stateDataMap

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
        const popupWidth = 250; // Adjust width
        const popupHeight = 200; // Adjust as necessary

        let x, y;

        if (centeredStates.has(d.id)) {
          // Center position
          x = container.width / 2 - popupWidth / 2;
          y = container.height / 2 - popupHeight / 2;
        } else {
          // Offset values to position the popup off-centered
          const offsetX = 10;
          const offsetY = 10;

          x = coords[0] + offsetX;
          y = coords[1] - popupHeight - offsetY;

          // Adjust x position to ensure popup is within bounds
          if (x + popupWidth > container.width) {
            x = container.width - popupWidth;
          } else if (x < 0) {
            x = 0;
          }

          // Adjust y position to ensure popup is within bounds
          if (y < 0) {
            y = coords[1] + offsetY;
          }
        }

        const stateId = d.id; // ID from the JSON file
        const stateData = stateDataMap[stateId] || { minorityServingInstitutions: 0, EPSCOR: 0 };

        setPopupData({
          name: stateIdToNameMap[stateId] ? stateIdToNameMap[stateId] : "Unknown",
          data: stateData,
          coords: [x, y]
        });
      })
      .attr('d', path);

    states.append('title')
      .text(d => stateIdToNameMap[d.id] ? stateIdToNameMap[d.id] : "Unknown");

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 2) // Increase the stroke width
      .attr('stroke-linejoin', 'round')
      .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="us-map-container">
      <svg ref={svgRef}></svg>
      {popupData && (
        <div className="popup" style={{
          left: `${popupData.coords[0]}px`,
          top: `${popupData.coords[1]}px`
        }}>
          <h4>{popupData.name}</h4>
          <p className="line1">Minority Serving</p>
          <p>Institutions: <span className="number">{popupData.data.minorityServingInstitutions}</span></p>
          <p>EPSCOR: <span className="number">{popupData.data.EPSCOR}</span></p>
        </div>
      )}
    </div>
  );
};

export default USMap;






















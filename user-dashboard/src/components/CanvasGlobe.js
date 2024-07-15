import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import "./CanvasGlobe.css"; // Import the CSS file

const CanvasGlobe = ({
  width,
  height,
  landColor = "#",
  countryColor = "#",
  borderColor = "#fff",
  dotColor = "#B7312C",
  waterColor = "#041C2C",
}) => {
  const globeContainerRef = useRef(null); // Use ref to keep track of the container
  const animationRef = useRef(null); // Ref to store the animation frame ID

  useEffect(() => {
    const dpr = window.devicePixelRatio ?? 1;
    const canvas = d3
      .create("canvas")
      .attr("width", dpr * width)
      .attr("height", dpr * height)
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .node();
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);

    const projection = d3.geoOrthographic().fitExtent(
      [
        [10, 10],
        [width - 10, height - 10],
      ],
      { type: "Sphere" }
    );
    const path = d3.geoPath(projection, context);
    const tilt = 20;

    const render = (country, arc, land, borders) => {
      context.clearRect(0, 0, width, height);

      // Draw water
      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = waterColor;
      context.fill();

      // Draw land
      context.beginPath();
      path(land);
      context.fillStyle = landColor;
      context.fill();

      // Draw country
      context.beginPath();
      path(country);
      context.fillStyle = countryColor;
      context.fill();

      // Draw borders
      context.beginPath();
      path(borders);
      context.strokeStyle = borderColor;
      context.lineWidth = 0.5;
      context.stroke();

      // Draw the outline of the sphere
      context.beginPath();
      path({ type: "Sphere" });
      context.strokeStyle = "#000";
      context.lineWidth = 1.5;
      context.stroke();

      // Draw the arc
      context.beginPath();
      context.setLineDash([2, 2]);
      context.strokeStyle = dotColor;
      path(arc);
      context.stroke();
      context.setLineDash([]);

      return context.canvas;
    };

    const Versor = {
      fromAngles: ([l, p, g]) => {
        l *= Math.PI / 360;
        p *= Math.PI / 360;
        g *= Math.PI / 360;
        const sl = Math.sin(l),
          cl = Math.cos(l);
        const sp = Math.sin(p),
          cp = Math.cos(p);
        const sg = Math.sin(g),
          cg = Math.cos(g);
        return [
          cl * cp * cg + sl * sp * sg,
          sl * cp * cg - cl * sp * sg,
          cl * sp * cg + sl * cp * sg,
          cl * cp * sg - sl * sp * cg,
        ];
      },
      toAngles: ([a, b, c, d]) => [
        (Math.atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * 180) /
          Math.PI,
        (Math.asin(Math.max(-1, Math.min(1, 2 * (a * c - d * b)))) * 180) /
          Math.PI,
        (Math.atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * 180) /
          Math.PI,
      ],
      interpolateAngles: (a, b) => {
        const i = Versor.interpolate(
          Versor.fromAngles(a),
          Versor.fromAngles(b)
        );
        return (t) => Versor.toAngles(i(t));
      },
      interpolateLinear: ([a1, b1, c1, d1], [a2, b2, c2, d2]) => {
        a2 -= a1;
        b2 -= b1;
        c2 -= c1;
        d2 -= d1;
        const x = new Array(4);
        return (t) => {
          const l = Math.hypot(
            (x[0] = a1 + a2 * t),
            (x[1] = b1 + b2 * t),
            (x[2] = c1 + c2 * t),
            (x[3] = d1 + d2 * t)
          );
          x[0] /= l;
          x[1] /= l;
          x[2] /= l;
          x[3] /= l;
          return x;
        };
      },
      interpolate: ([a1, b1, c1, d1], [a2, b2, c2, d2]) => {
        let dot = a1 * a2 + b1 * b2 + c1 * c2 + d1 * d2;
        if (dot < 0) {
          a2 = -a2;
          b2 = -b2;
          c2 = -c2;
          d2 = -d2;
        }
        dot = -dot;
        if (dot > 0.9995)
          return Versor.interpolateLinear([a1, b1, c1, d1], [a2, b2, c2, d2]);
        const theta0 = Math.acos(Math.max(-1, Math.min(1, dot)));
        const x = new Array(4);
        const l = Math.hypot(
          (a2 -= a1 * dot),
          (b2 -= b1 * dot),
          (c2 -= c1 * dot),
          (d2 -= d1 * dot)
        );
        a2 /= l;
        b2 /= l;
        c2 /= l;
        d2 /= l;
        return (t) => {
          const theta = theta0 * t;
          const s = Math.sin(theta);
          const c = Math.cos(theta);
          x[0] = a1 * c + a2 * s;
          x[1] = b1 * c + b2 * s;
          x[2] = c1 * c + c2 * s;
          x[3] = d1 * c + d2 * s;
          return x;
        };
      },
    };

    const fetchData = async () => {
      try {
        const world = await d3.json(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
        );
        const land = topojson.feature(world, world.objects.land);
        const countries = topojson.feature(
          world,
          world.objects.countries
        ).features;
        const borders = topojson.mesh(
          world,
          world.objects.countries,
          (a, b) => a !== b
        );

        // Log all country IDs to verify, and filter out undefined values
        const countryIds = countries
          .map((country) => country.id)
          .filter((id) => id !== undefined);
        console.log("Fetched country IDs:", countryIds);

        // Define the sequence of countries by their ISO 3166-1 numeric code as strings
        const countrySequence = ["840", "124", "250", "276", "392"]; // Example: USA, Canada, France, Germany, Japan

        // Filter countries based on the sequence
        const countriesToRotate = countries.filter((country) =>
          countrySequence.includes(country.id)
        );

        if (countriesToRotate.length === 0) {
          console.error("No countries found for the specified sequence.");
          return;
        }

        let p2 = [0, 0],
          r2 = [0, 0, 0];

        let countryIndex = 0;

        const animate = async () => {
          try {
            const country = countriesToRotate[countryIndex];
            const currentP2 = d3.geoCentroid(country);
            const currentR2 = [-currentP2[0], tilt - currentP2[1], 0];

            const ip = d3.geoInterpolate(p2, currentP2);
            const iv = Versor.interpolateAngles(r2, currentR2);

            const duration = 625; // Halve the duration to make it faster
            const steps = duration / 16; // Assuming 60fps, so ~16ms per frame
            let step = 0;

            const rotate = () => {
              if (step <= steps) {
                const t = step / steps;
                projection.rotate(iv(t));
                render(
                  country,
                  { type: "LineString", coordinates: [p2, ip(t)] },
                  land,
                  borders
                );
                step++;
                animationRef.current = requestAnimationFrame(rotate);
              } else {
                p2 = currentP2;
                r2 = currentR2;
                countryIndex = (countryIndex + 1) % countriesToRotate.length;
                setTimeout(() => {
                  animationRef.current = requestAnimationFrame(animate);
                }, 500); // Reduce the delay between rotations
              }
            };

            rotate();
          } catch (countryError) {
            console.error("Error processing country:", countryError);
            countryIndex = (countryIndex + 1) % countriesToRotate.length;
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Error fetching world data:", error.message || error);
      }
    };

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error.message || error);
    });

    const globeContainer = globeContainerRef.current;

    // Remove any existing canvas elements to avoid duplicate globes
    if (globeContainer.firstChild) {
      globeContainer.removeChild(globeContainer.firstChild);
    }

    globeContainer.appendChild(canvas);
    console.log("Canvas appended to container");

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    width,
    height,
    landColor,
    countryColor,
    borderColor,
    dotColor,
    waterColor,
  ]);

  return <div id="globe-container" ref={globeContainerRef}></div>;
};

export default CanvasGlobe;

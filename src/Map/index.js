/*global kakao*/
import React, { useEffect, useRef, useState } from "react";

import "./index.css";

const MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;
const POLYGON_COLOR = "#f55c47";

function Map({
  center,
  level,
  areas,
  onGeoJsonPolygonAdd,
  polygonExtractMode,
  onCenterChange,
}) {
  const [map, setMap] = useState(null);
  const makedPolygonsRef = useRef([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(center[0], center[1]),
          level,
        };

        const map = new window.kakao.maps.Map(container, options);

        setMap(map);
      });
    };
  }, [center, level]);

  useEffect(() => {
    let drawingFlag = false;
    let drawingPolygon;
    let polygon;
    let areaOverlay;

    function handleDblClick(mouseEvent) {
      const latlng = mouseEvent.latLng;
      const level = map.getLevel() - 1;

      onCenterChange({ lat: latlng.getLat(), lng: latlng.getLng(), level });
    }

    function handleClick(mouseEvent) {
      if (!polygonExtractMode) {
        return;
      }

      const clickPosition = mouseEvent.latLng;

      if (!drawingFlag) {
        drawingFlag = true;

        if (polygon) {
          polygon.setMap(null);
          polygon = null;
        }

        if (areaOverlay) {
          areaOverlay.setMap(null);
          areaOverlay = null;
        }

        drawingPolygon = new kakao.maps.Polygon({
          map: map,
          path: [clickPosition],
          strokeWeight: 3,
          strokeColor: POLYGON_COLOR,
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: POLYGON_COLOR,
          fillOpacity: 0.2,
        });

        polygon = new kakao.maps.Polygon({
          path: [clickPosition],
          strokeWeight: 3,
          strokeColor: POLYGON_COLOR,
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: POLYGON_COLOR,
          fillOpacity: 0.2,
        });
      } else {
        const drawingPath = drawingPolygon.getPath();
        drawingPath.push(clickPosition);
        drawingPolygon.setPath(drawingPath);

        const path = polygon.getPath();
        path.push(clickPosition);
        polygon.setPath(path);
      }
    }

    function handleMouseMove(mouseEvent) {
      if (drawingFlag) {
        const mousePosition = mouseEvent.latLng;

        const path = drawingPolygon.getPath();

        if (path.length > 1) {
          path.pop();
        }

        path.push(mousePosition);

        drawingPolygon.setPath(path);
      }
    }

    function handleRightClick(mouseEvent) {
      if (drawingFlag) {
        drawingPolygon.setMap(null);
        drawingPolygon = null;

        const path = polygon.getPath();

        if (path.length > 2) {
          polygon.setMap(map);
          const area = Math.round(polygon.getArea()),
            content =
              '<div class="info">총면적 <span class="number"> ' +
              area +
              "</span> m<sup>2</sup></div>";

          areaOverlay = new kakao.maps.CustomOverlay({
            map: map,
            content: content,
            xAnchor: 0,
            yAnchor: 0,
            position: path[path.length - 1],
          });

          const shp = {};
          shp.type = "Polygon";
          shp.coordinates = [[]];

          for (const i in path) {
            const lng = path[i].getLat();
            const lat = path[i].getLng();
            shp.coordinates[0].push([lng, lat]);
          }
          const lng = path[0].getLat();
          const lat = path[0].getLng();
          shp.coordinates[0].push([lng, lat]);

          onGeoJsonPolygonAdd(shp, map.getCenter(), map.getLevel());
        } else {
          polygon = null;
        }

        drawingFlag = false;
      }
    }

    if (map) {
      kakao.maps.event.addListener(map, "dblclick", handleDblClick);
      kakao.maps.event.addListener(map, "click", handleClick);
      kakao.maps.event.addListener(map, "mousemove", handleMouseMove);
      kakao.maps.event.addListener(map, "rightclick", handleRightClick);
    }

    return () => {
      if (map) {
        kakao.maps.event.removeListener(map, "dblclick", handleDblClick);
        kakao.maps.event.removeListener(map, "click", handleClick);
        kakao.maps.event.removeListener(map, "mousemove", handleMouseMove);
        kakao.maps.event.removeListener(map, "rightclick", handleRightClick);
      }
    };
  }, [map, onCenterChange, onGeoJsonPolygonAdd, polygonExtractMode]);

  useEffect(() => {
    if (map && areas && areas.length > 0) {
      clearMakedPolygons();

      for (var i = 0, len = areas.length; i < len; i++) {
        const polygon = displayArea(areas[i]);

        makedPolygonsRef.current.push(polygon);
      }
    }
  }, [areas, map]);

  function clearMakedPolygons() {
    makedPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    makedPolygonsRef.current = [];
  }

  function displayArea(area) {
    let customOverlay = new kakao.maps.CustomOverlay({});;

    const path = area.location.coordinates[0].map(
      (coordinate) => new kakao.maps.LatLng(coordinate[0], coordinate[1])
    );

    const polygon = new kakao.maps.Polygon({
      map: map,
      path: path,
      strokeWeight: 2,
      strokeColor: POLYGON_COLOR,
      strokeOpacity: 0.8,
      fillColor: "#fff",
      fillOpacity: 0.7,
    });

    kakao.maps.event.addListener(polygon, "mouseover", function (mouseEvent) {
      polygon.setOptions({ fillColor: POLYGON_COLOR });

      customOverlay.setContent('<div class="area-overay">' + area.name + "</div>");

      customOverlay.setPosition(mouseEvent.latLng);
      customOverlay.setMap(map);
    });

    kakao.maps.event.addListener(polygon, "mousemove", function (mouseEvent) {
      customOverlay.setPosition(mouseEvent.latLng);
    });

    kakao.maps.event.addListener(polygon, "mouseout", function () {
      polygon.setOptions({ fillColor: "#fff" });
      customOverlay.setMap(null);
    });

    return polygon;
  }

  return <div id="map" className="map"></div>;
}

export default React.memo(Map);

function getDistancePosition(kakaoLatLng, distance) {
  return new kakao.maps.LatLng(kakaoLatLng.getLat() - distance, kakaoLatLng.getLng() - distance);
}

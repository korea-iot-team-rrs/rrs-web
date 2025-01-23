import React, { useEffect, useState } from "react";
import { NAVER_MAP_API } from "../../apis/naverApi";

type Point = {
  lat: number;
  lng: number;
};

declare global {
  interface Window {
    naver: any;
  }
}

const apiKey = process.env.REACT_APP_NAVER_API;

export default function PetRoad() {
  const [latLng, setLatLng] = useState<Point | null>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    setLatLng({
      lat: 35.1524181,
      lng: 129.0596052
    })
  },[]) 

  useEffect(() => {
    if (!latLng) return;

    const loadMap = () => {
      const script = document.createElement("script");
      script.src = `${NAVER_MAP_API}${apiKey}&modules=geocoder`;
      script.async = true;

      script.onload = () => {
        console.log("Naver maps script loaded");
        console.log("Window.naver:", window.naver);

        if (!window.naver || !window.naver.maps) {
          console.error("네이버 지도 라이브러리 로드 실패");
          return;
        }

        try {
          const newMap = new window.naver.maps.Map("map", {
            center: new window.naver.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 25,
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: true,
            minZoom: 6,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT
            },

          });

          new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(latLng.lat, latLng.lng),
            map: newMap,
          });

          setMap(newMap);
        } catch (error) {
          console.error("지도 생성 중 오류:", error);
        }
      };

      script.onerror = (error) => {
        console.error("지도 스크립트 로드 실패", error);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadMap();
  }, [latLng, apiKey]);

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh"}}>
      <div
        id="map"
        style={{ width: "1000px", height: "700px", borderRadius: "5px" , backgroundColor: "red"}}
      />
    </div>
  );
}

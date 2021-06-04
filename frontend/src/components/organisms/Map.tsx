import React, { useState } from "react";
import styled from "styled-components";
import ReactMapGL, { Marker } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import Link from "@material-ui/core/Link";
import FsLightbox from "fslightbox-react";

import Typography from "../atoms/Typography";

const accessToken =
  "pk.eyJ1IjoidGFnZ3IiLCJhIjoiY2thMmJ0cGgyMDh2aDNocG5kZjcwaTdrOSJ9.dLriq493UOY4Jt-xZaAAZQ";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;

  border-radius: 6px;
`;

// TODO: improve: add backdrop when there are no images to show, with tip: https://material-ui.com/components/backdrop/
const Map = ({ imageList = [] }) => {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toggler, setToggler] = useState(false);

  return (
    <Wrapper>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={accessToken}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/taggr/cka6yzzew11f71iogmj35drzc?optimize=true"
        attributionControl={false}
        onViewportChange={(viewport: any) => {
          // prevent overriding the height and width: https://github.com/visgl/react-map-gl/issues/604#issuecomment-462398674
          const { width, height, ...etc } = viewport;
          setViewport(etc);
        }}
        style={{
          filter: "blur(4px)",
        }}
      >
        {imageList.map((image, index) => (
          <Marker
            key={image.hash}
            // Given marker dimensions (H x W): 35 x 35 :https://material.io/resources/icons/?search=map&icon=room&style=baseline
            offsetTop={-35}
            offsetLeft={-17.5}
            latitude={image.location.latitude}
            longitude={image.location.longitude}
          >
            <Link
              href="#"
              onClick={async (e: any) => {
                e.preventDefault();
                setSelectedIndex(index);
                // hack to prevent lightbox with isOpen: undefined
                await new Promise((r) => setTimeout(r, 10));
                setToggler(!toggler);
              }}
            >
              <RoomIcon fontSize="large" />
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
      <FsLightbox
        toggler={toggler}
        sources={[
          imageList[selectedIndex] ? imageList[selectedIndex].path : null,
        ]}
        key={selectedIndex}
      />
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
          margin: "2rem 0",
          position: "absolute",
          top: "50%",
          left: "45%",
        }}
      >
        {"🚧 Geolocation comming soon, stay tuned!"}
      </Typography>
    </Wrapper>
  );
};

// If slow performance, consider geoJson: https://github.com/visgl/react-map-gl/issues/750

export default React.memo(Map);
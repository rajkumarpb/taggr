const { app } = require("electron").remote;
let shell = require("electron").shell;

import React, { useEffect } from "react";
import { hot, setConfig } from "react-hot-loader";
import { connect } from "react-redux";
import styled from "styled-components";
import semverCompare from "semver/functions/compare";

import StartPage from "./pages/start";
import DashboardPage from "./pages/main";
import SettingsPage from "./pages/settings";
import UpdateModal from "./molecules/UpdateModal";
import CONSTANTS from "../store/constants";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageWrapper = styled.div`
  height: 100%;
`;

const App = ({ activeRoute }) => {
  const [state, setState] = React.useState({
    currentAppVersion: "v0.0.0",
    latestAppVersion: "v0.0.0",
  });

  const fetchLatestAppVersion = async () => {
    var url = `https://api.github.com/repos/aperkaz/taggr-releases/tags`;
    const res = await fetch(url);

    res.json().then((tagList) => {
      const descendingOrderVersionTags = tagList.sort((v1, v2) => {
        return semverCompare(v2.name, v1.name);
      });

      const latestAppVersion = descendingOrderVersionTags[0].name;
      const currentAppVersion = `v${app.getVersion()}`;

      setState((prev) => ({
        ...prev,
        latestAppVersion,
        currentAppVersion,
      }));

      console.log(
        `Current version: ${currentAppVersion} | Latest version: ${latestAppVersion}`
      );

      // open modal if new version of app exists
      if (semverCompare(currentAppVersion, latestAppVersion) === -1) {
        handleOpen();
      }
    });
  };

  useEffect(() => {
    fetchLatestAppVersion();
  }, []);

  return (
    <Wrapper>
      <PageWrapper>{renderRoute(activeRoute)}</PageWrapper>
      <UpdateModal
        // currentAppVersion={}
        updateAction={async (event) => {
          handleClose();
          event.preventDefault();
          shell.openExternal("https://taggr.ai");
        }}
      />
    </Wrapper>
  );
};

const renderRoute = (activeRoute) => {
  switch (activeRoute) {
    case CONSTANTS.ROUTES.START_PAGE:
      return <StartPage />;
    case CONSTANTS.ROUTES.DASHBOARD_PAGE:
      return <DashboardPage />;
    case CONSTANTS.ROUTES.SETTINGS_PAGE:
      return <SettingsPage />;
  }
};

// redux bindings
const mapStateToProps = (state) => ({ activeRoute: state.activeRoute });

setConfig({
  showReactDomPatchNotification: false,
});
export default connect(mapStateToProps)(hot(module)(App));

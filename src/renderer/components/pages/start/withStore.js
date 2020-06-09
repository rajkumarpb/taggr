import React from "react";
import { useDispatch } from "react-redux";

import { ACTIONS } from "../../../store";
import { createProject } from "../../../services";
import CONSTANTS from "../../../store/constants";
import StartPage from "./Page";

const withStore = () => {
  const dispatch = useDispatch();

  const onSelectRootFolderPath = async () => {
    const { dialog } = require("electron").remote;

    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    const projectRootFolderPath = filePaths ? filePaths[0] : null;

    if (!projectRootFolderPath) return;

    dispatch(ACTIONS.setActiveRoute(CONSTANTS.ROUTES.DASHBOARD_PAGE));
    createProject(projectRootFolderPath);
  };

  const onSelectLogo = () => {
    const { shell } = require("electron");
    shell.openExternal("https://taggr.ai");
  };

  return (
    <StartPage
      onSelectRootFolderPath={onSelectRootFolderPath}
      onSelectLogo={onSelectLogo}
    />
  );
};

export default withStore;
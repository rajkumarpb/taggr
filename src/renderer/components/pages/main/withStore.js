import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MainPage from "./Page";
import {
  setActiveRoute,
  serviceDeleteProject,
  serviceSearchImages,
} from "../../../store";
import CONSTANTS from "../../../store/constants";
import debounce from "lodash.debounce";

const withStore = () => {
  const dispatch = useDispatch();

  const onSettingsClick = () => {
    dispatch(setActiveRoute(CONSTANTS.ROUTES.SETTINGS));
  };

  const onInputChange = debounce((v) => {
    console.log("input changed", v);

    serviceSearchImages(v);
  }, 200);

  const onPressReset = () => {
    dispatch(setActiveRoute(CONSTANTS.ROUTES.START_PAGE));
    serviceDeleteProject();
  };

  return (
    <MainPage
      {...{
        onSettingsClick,
        onInputChange,
        onPressReset,
        task: useSelector((s) => s.task),
        tags: useSelector((s) => s.tags),
        images: useSelector((s) => s.images),
      }}
    />
  );
};

export default withStore;

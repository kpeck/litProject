import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

/*
 *  React-Router-Dom setup
 *  Docs: https://reactrouter.com/docs/en/v6/getting-started/overview
 */

import LitSave from "./components/LitSave";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

export default function Router() {
  return (
    <BrowserRouter style={{ display: "block" }}>
      <Wrapper>
        <Routes>
          <Route path="/" element={<LitSave />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

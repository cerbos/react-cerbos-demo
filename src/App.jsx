import { AutoUpdatingLoader, Embedded as Cerbos } from "@cerbos/embedded";

import { CerbosProvider } from "@cerbos/react";

import { Route, Routes } from "react-router-dom";
import { HomePage, CoursesPage } from "./Pages";

const client = new Cerbos(
  new AutoUpdatingLoader(import.meta.env.VITE_CERBOS_BUNDLE_URL),
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses/*" element={<ProtectedCoursesPage />} />
    </Routes>
  );
};

export default App;

import userService from "./services/userService";
import { getAccessToken } from "./services/tokenStorage";

const ProtectedCoursesPage = () => {
  const currentUser = userService.getUserId(getAccessToken());

  return (
    <CerbosProvider //wraping component in CerbosProvider to make Cerbos client available to all child components
      client={client}
      principal={{
        id: currentUser?.id,
        roles: currentUser?.roles,
      }}
    >
      <Routes>
        <Route path="/" element={<CoursesPage />} />
      </Routes>
    </CerbosProvider>
  );
};

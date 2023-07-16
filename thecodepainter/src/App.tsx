import React from 'react';
import logo from './logo.svg';

import Layout from './Components/Layout'
import AboutMe from './Components/AboutMe';
import ReadMe from './Components/ReadMe';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: 'aboutme',
        element: <AboutMe />
      },
      {
        path: 'readme',
        element: <ReadMe />
      }
    ]
  }
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

import React, {useEffect} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css_nes.min.css"

import Layout from './Components/Layout';

import Home from './Components/Home';
import About from './Components/About';
import Blog from './Components/Blog';
import Book from './Components/Book';
import Contact from './Components/Contact';
import Gallery from './Components/Gallery';
import Podcasts from './Components/Podcasts';
import Talks from './Components/Talks';
import Upcoming from './Components/Upcoming';

import WebFont from 'webfontloader';

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
        path: '/',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'blog',
        element: <Blog />
      },
      {
        path: 'book',
        element: <Book />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'gallery',
        element: <Gallery />
      },
      {
        path: 'podcasts',
        element: <Podcasts />
      },
      {
        path: 'talks',
        element: <Talks />
      },
      {
        path: 'upcoming',
        element: <Upcoming />
      }
    ]
  }
]);


function App() {

  useEffect(() => {

    WebFont.load({
      google: {
        families: ['Press+Start+2P']
      }
    })

  });

  return (
    <RouterProvider router={router} />
  );
}

export default App;
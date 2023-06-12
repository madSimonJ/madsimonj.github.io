import React from 'react';
import logo from './logo.svg';
import './App.css';

import { RouterProvider, createBrowserRouter, Outlet, Navigate } from 'react-router-dom';

import Layout from '../Components/Layout';
import Home from '../Components/Home';
import About from '../Components/About';
import Talks from '../Components/Talks'
import Podcasts from '../Components/Podcasts'
import Upcoming from '../Components/Upcoming';
import Gallery from '../Components/Gallery';
import Contact from '../Components/Contact';
import Blog from '../Components/Blog';
import Book from '../Components/Book';


const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'talks',
        element: <Talks />
      },
      {
        path: 'podcasts',
        element: <Podcasts />
      },
      {
        path: 'upcoming',
        element: <Upcoming  />
      },
      {
        path: 'gallery',
        element: <Gallery  />
      },
      {
        path: 'contact',
        element: <Contact  />
      },
      {
        path: 'blog',
        element: <Blog  />
      },
      {
        path: 'book',
        element: <Book  />
      },
    ]
  }

]);

function App() {
  return (
      <RouterProvider router={router} />
)
}

export default App;

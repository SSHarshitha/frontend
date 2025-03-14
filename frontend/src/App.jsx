import Navbar from './components/navbar.component';
import { Routes, Route } from "react-router-dom";
import UserAuthForm from './pages/userAuthForm.page';
import { createContext, useState, useEffect } from 'react';
import { lookInSession } from './common/session';
import Editor from './pages/editor.pages';
import Homepage from './pages/home.page';
import SearchPage from './pages/search.page';
import PageNotFound from './pages/404.page';
import ProfilePage from './pages/profile.page';
import Blogpage from "./pages/blog.page";
import PrivateRoute from './components/private.component'; // Adjust the path based on your file structure
import SideNav from './components/sidenavbar.component';
import Notifications from './components/notifications.page';
import ManageBlogs from './pages/manage-blogs.page';

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, [])

    return (
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<Homepage />} />
            <Route path="dashboard" element={<SideNav />}>
              <Route path="blogs" element= {<ManageBlogs />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="settings" element={<SideNav />}>
              <Route
                path="edit-profile"
                element={<h1>this is edit profile page</h1>}
              />
              <Route
                path="change-password"
                element={<h1>this is change password page</h1>}
              />
            </Route>
            <Route path="signin" element={<UserAuthForm type="sign-in" />} />
            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            <Route
              path="search/:query"
              element={<PrivateRoute element={<SearchPage />} />}
            />
            <Route
              path="user/:id"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route
              path="blog/:blog_id"
              element={<PrivateRoute element={<Blogpage />} />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    );
}

export default App;

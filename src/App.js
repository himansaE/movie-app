import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//components
import Navbar from "./components/navbar/index";
import Error404 from "./components/404/Error404";
import BottomNav from "./components/navbar/BottomNav";
import Loading from "./components/loading/Loading";
//
import Main from "./components/main/main";
import Genre from "./components/genre/Genre";
import List from "./components/list/List";
import Movie from "./components/movie/movie";
import ErrorBoundary from "./components/ConnectionError/LazyError";
const Search = React.lazy(() => import("./components/search/index"));
const Watchlist = React.lazy(() => import("./components/watchlist/Watchlist"));
const Signup = React.lazy(() => import("./components/auth/signup"));
const Login = React.lazy(() => import("./components/auth/signin"));
const ResetPass = React.lazy(() => import("./components/auth/Resetpass"));
const Verify = React.lazy(() => import("./components/auth/verify"));
const Settings = React.lazy(() => import("./components/settings/Settings"));

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={Navbar} />
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" exact component={Main} />
              <Route path="/search" exact component={Search} />
              <Route path="/login" exact component={Login} />
              <Route path="/reset" exact component={ResetPass} />
              <Route path="/_verify" exact component={Verify} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/movie/:data" exact component={Movie} />
              <Route path="/genre/:data" exact component={Genre} />
              <Route path="/list/:data" exact component={List} />
              <Route path="/settings" component={Settings} />
              <Route path="/watchlist" component={Watchlist} />
              <Route path="/" component={Error404} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
        <Route path="/" component={BottomNav} />
      </Router>
    </div>
  );
}

export default App;

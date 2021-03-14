export const signup = (user) => {
  // console.log(process.env.REACT_APP_API);
  return fetch(`${process.env.REACT_APP_API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${process.env.REACT_APP_API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => console.log(error));
};

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
  }

  next();
  return fetch(`${process.env.REACT_APP_API}/signout`, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const authenticate = (jwt, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else return false;
};

export const updateUserInLocalStorage = (user) => {
  if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
    let auth = JSON.parse(localStorage.getItem("jwt"));

    auth.user = user;
    localStorage.setItem("jwt", JSON.stringify(auth));
  }
};

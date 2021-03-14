export const readUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
export const getAllUsers = () => {
  return fetch(`${process.env.REACT_APP_API}/users`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
export const deleteuser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
export const updateUser = (userId, token, user) => {
  // Display the key/value pairs
  // console.log(user.length);
  return fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const follow = (userId, token, followId) => {
  return fetch(`${process.env.REACT_APP_API}/user/follow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, followId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const unfollow = (userId, token, unfollowId) => {
  return fetch(`${process.env.REACT_APP_API}/user/unfollow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, unfollowId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const findPeople = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API}/user/findpeople/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

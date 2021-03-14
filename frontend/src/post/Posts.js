import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getAllPosts } from "../auth/post";
import DefaultPost from "../images/pleasent.jpg";
const Posts = () => {
  const [data, setdata] = useState({
    posts: [],
    page: 1,
  });

  const loadPosts = (page) => {
    getAllPosts(page).then((d) => {
      if (d.error) {
        console.log(d.error);
      } else {
        setdata({ ...data, posts: d.posts, page });
      }
    });
  };

  const loadMore = (number) => {
    loadPosts(data.page + number);
  };

  const loadLess = (number) => {
    loadPosts(data.page - number);
  };
  useEffect(() => {
    loadPosts(data.page);
  }, []);
  const displayposts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `${DefaultPost}`)}
                  className="img-thunbnail mb-3"
                  style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.body && post.body.substring(0, 100)}...
                </p>
                <br />
                <p className="font-italic mark">
                  Posted by{" "}
                  <Link to={`/user/${post.postedBy._id}`}>
                    {post.postedBy.name}{" "}
                  </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised btn-primary btn-sm"
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">
        {data.posts.length ? "Recent Posts" : "Loading..."}
      </h2>
      <div className="card">{displayposts(data.posts)}</div>

      {data.page > 1 ? (
        <button
          className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
          onClick={() => loadLess(1)}
        >
          Previous ({data.page - 1})
        </button>
      ) : (
        ""
      )}

      {data.posts.length ? (
        <button
          className="btn btn-raised btn-success mt-5 mb-5"
          onClick={() => loadMore(1)}
        >
          Next ({data.page + 1})
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Posts;

import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAdmin, children }) {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.user
  );
  return (
    <Fragment>
      {loading === false ? (
        isAuthenticated === true ? (
          isAdmin === true ? (
            user.role === "admin" ? (
              children
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            children
          )
        ) : (
          <Navigate to="/login" />
        )
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  );
}

export default ProtectedRoute;
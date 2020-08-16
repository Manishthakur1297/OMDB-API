import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Typography } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "70%",
    height: "80%",
    backgroundColor: "#85FFBD",
    backgroundImage: "linear-gradient(to right, #85FFBD 0%, #FFFB7D 100%)",
    border: "4px solid #fff",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: "scroll",
  },
  loadingM: {
    display: "flex",
    height: 75,
    color: "red",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

export default function CustomModal({ id, show, hide }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [series, setSeries] = useState({});
  const [loading, setLoading] = useState(true);

  const Hide = () => {
    hide();
  };

  const loadIMDBData = async (id) => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=79fb6e47&i=${id}&plot=full`
    );
    const data = await res.json();
    setSeries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadIMDBData(id);
  }, []);

  const body = (
    <>
      {!loading ? (
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">{series.Title}</h2>
          <ul id="simple-modal-description">
            <li>Actors : {series.Actors}</li>
            {/* <li>Awards : {series.Awards}</li> */}
            <li>Country : {series.Country}</li>
            {/* <li>Director : {series.Director}</li> */}
            <li>Genre : {series.Genre}</li>
            <li>Language : {series.Language}</li>
            {/* <li>Metascore: {series.Metascore}</li> */}
            <li>Plot: {series.Plot}</li>
            {/* <li>Poster: {series.Poster}</li> */}
            {/* <li>Rated: {series.Rated}</li> */}
            {/* <li>Ratings: {series.Ratings}</li> */}
            <li>Released: {series.Released}</li>
            {/* <li>Response: {series.Response}</li> */}
            {/* <li>Runtime: {series.Runtime}</li> */}
            {/* <li>Type: {series.Type}</li> */}
            {/* <li>Writer: {series.Writer}</li> */}
            {/* <li>Year: {series.Year}</li> */}
            <li>imdbID: {series.imdbID}</li>
            <li>imdbRating: {series.imdbRating}</li>
            {/* <li>imdbVotes: {series.imdbVotes}</li> */}
            <li>totalSeasons: {series.totalSeasons}</li>
          </ul>
        </div>
      ) : (
        <div style={modalStyle} className={classes.paper}>
          <div className={classes.loadingM}>
            <Typography variant="h4" component="h1" gutterBottom>
              Loading...
            </Typography>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div>
      <Modal
        open={show}
        onClose={Hide}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  CardMedia,
  Button,
  Container,
  TextField,
  Box,
} from "@material-ui/core/";

import CustomModal from "../components/modal";
// const CustomModal = lazy(() => import("../components/modal"));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    height: 330,
  },
  media: {
    height: 150,
  },
  content: {
    height: 75,
    alignItems: "left",
  },
  bar: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    display: "flex",
    height: 75,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

const Index = ({ series, size, error }) => {
  function useAsyncState(initialValue) {
    const [value, setValue] = useState(initialValue);
    const setter = (x) =>
      new Promise((resolve) => {
        setValue(x);
        resolve(x);
      });
    return [value, setter];
  }

  const classes = useStyles();
  const [page, setPage] = useState(2);
  const [count, setCount] = useState(10);
  const [maxC, setMaxC] = useState(size);
  const [data, setData] = useAsyncState(series);
  const [title, setTitle] = useState("Game");
  const [year, setYear] = useState("");
  const [err, setErr] = useState(error);

  const [filterData, setFilterData] = useState(series.slice(0, 8));
  const [index, setIndex] = useState(8);
  const [nxt, setNxt] = useState(true);

  const [show, setShow] = useState(false);
  const [imdb, setImdb] = useState(null);

  const loadNextPage = (title, year, type, page) => {
    return fetch(
      `https://www.omdbapi.com/?apikey=79fb6e47&s=${title}&y=${year}&type=${type}&page=${page}`
    ).then((res) => {
      return res.json();
    });
  };

  // Handle Previous Button

  const handlePrev = (event) => {
    if (nxt || index > count) {
      let start = index - 16;
      if (start < 0) {
        start = 0;
      }
      setNxt(false);
      setFilterData(data.slice(start, start + 8));
      setIndex(start);
    } else if (index > 0) {
      setFilterData(data.slice(index - 8, index));
      setIndex(index - 8);
    }

    if (index == 0 || index - 8 == 0) {
      alert("You are on First page");
      setIndex(8);
      setNxt(true);
    }
  };

  // Handle Next Button

  const handleNext = (event) => {
    if (!nxt) {
      setNxt(true);
      setFilterData(data.slice(index + 8, index + 16));
      setIndex(index + 16);
    } else if (count - index < 8) {
      if (count < maxC) {
        loadNextPage(title, year, "series", page).then(async (result) => {
          if (result.Response == "False") {
            setData([]);
            setMaxC(0);
            setErr(true);
            alert("Sorry, No Series Found!!");
          } else {
            const d = await setData([...data, ...result.Search]);
            setMaxC(result.totalResults);
            setCount(count + result.Search.length);
            setErr(false);
            setFilterData(d.slice(index, index + 8));
            setIndex(index + 8);
            setPage(page + 1);
          }
        });
      } else {
        if (index < count) {
          setFilterData(data.slice(index, index + 8));
          setIndex(index + 8);
        } else {
          alert("You are on Last page");
        }
      }
    } else {
      setFilterData(data.slice(index, index + 8));
      setIndex(index + 8);
    }
  };

  // Handle Title Input

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  // Handle Year Input

  const handleYear = (event) => {
    setYear(event.target.value);
  };

  // Handle Search Button

  const handleSearch = (event) => {
    if (title.length < 3) {
      alert("Title Should be atleast 3 characters");
    } else {
      loadNextPage(title, year, "series", 1).then(async (result) => {
        if (result.Response == "False") {
          setData([]);
          setMaxC(0);
          setErr(true);
          alert("Sorry, No Series Found!!");
        } else {
          const d = await setData([...result.Search]);
          setMaxC(result.totalResults);
          setCount(result.Search.length);
          setErr(false);
          setFilterData(d.slice(0, 8));
          setIndex(8);
          setPage(2);
        }
      });
    }
  };

  // Handle Modal Component (SHOW MODAL)

  const readFullPlot = (item) => (event) => {
    setImdb(item.imdbID);
    setShow(true);
  };

  // Handle Modal Component (HIDE MODAL)

  const hide = () => {
    setShow(false);
    setImdb(null);
  };

  // MAIN COMPONENT

  return (
    <div className={classes.root}>
      <Container>
        {show ? (
          // <Suspense fallback={<h2>Modal is loading...</h2>}>
          <CustomModal id={imdb} show={show} hide={hide} />
        ) : // </Suspense>
        null}
        <div className={classes.bar}>
          <Typography variant="h4" component="h1" gutterBottom>
            OMDB API
          </Typography>
          <TextField id="standard-basic" label="Title" onChange={handleTitle} />
          <TextField
            id="standard-basic"
            label="Year"
            type="Number"
            onChange={handleYear}
          />
          <Button color="secondary" variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {!err ? (
          filterData.length > 0 && (
            <div>
              <Grid
                container
                spacing={5}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
              >
                {filterData.map((elem) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={filterData.indexOf(elem)}
                  >
                    <Card className={classes.root}>
                      <CardMedia
                        className={classes.media}
                        image={elem.Poster}
                        title={elem.Title}
                      />
                      <hr />
                      <CardContent className={classes.content}>
                        <p>
                          {elem.Title} | {elem.Year}
                        </p>
                      </CardContent>
                      <CardActions className={classes.button}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={readFullPlot(elem)}
                        >
                          Read Plot
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <div className={classes.bar}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePrev}
                >
                  Prev
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        ) : (
          <Typography variant="h4" component="h1" gutterBottom>
            <br />
            <hr />
            <p>
              {`No Series Found with Given Title : ${title} and Year : ${year}`}
            </p>
            <hr />
            <br />
          </Typography>
        )}
      </Container>
    </div>
  );
};

Index.getInitialProps = async () => {
  const res = await fetch(
    "https://www.omdbapi.com/?apikey=79fb6e47&s=Game&y=&type=series&page=1"
  );
  const data = await res.json();
  if (data.Response == "False") {
    return { series: [], size: 0, error: true };
  }
  return { series: data.Search, size: data.totalResults, error: false };
};

export default Index;

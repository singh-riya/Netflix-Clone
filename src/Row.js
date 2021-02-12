import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs based on a specific condition
  useEffect(() => {
    //if [] (empty),run once when the row loads,and dont run again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // "https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_network=213"
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          // youtube.com/watch?v=XtMThy8QKqU
          // so what urlParmas.get('v') is doing, retrieving the value of v from youtube video url
          // v is video id
          // const urlParams = new URLSearchParams(new URL(url).search);
          const urlParams = new URLSearchParams(new URL(url).search);
          const myParam = urlParams.get("v");
          console.log(myParam);
          // setTrailerUrl(myParam);
        })
        .catch((error) => console.log(error));
    }
  };

  //   console.log(movies);

  return (
    <div className='row'>
      <h2>{title}</h2>
      {/* title */}

      <div className='row__posters'>
        {/* several row__poster(s) */}

        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoID={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;

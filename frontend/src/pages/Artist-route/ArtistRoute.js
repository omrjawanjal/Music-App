import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MyToken } from "../ContextAPI/context";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Home/navbar";

const ArtistRoute = () => {
  const ids = useParams();
  console.log(ids.id);
  const [data, setData] = useState([]);
  const [albums, setAlbums] = useState([]);
  const token = useContext(MyToken);
  const navigate = useNavigate();
  const location = useLocation();
  let username = location.state ? location.state.username : null;

  useEffect(() => {
    if (username === null) {
      navigate("/");
    }
  }, [username]);
  useEffect(() => {
    fetch(
      "https://api.spotify.com/v1/artists/" +
        ids.id +
        "/albums" +
        "?include_groups=album&market=IN&limit=50",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ids.id, token]);
  console.log(albums);
  return (
    <div>
      <Navbar />
      <br />
      <br />
      {/* <a href={`/search/tracks/music/${data[0]?.id}`}> */}
      <div
        className="card-flex"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        {albums &&
          albums.length > 0 &&
          albums.map((album, i) => (
            <a
              onClick={() => {
                navigate(`/search/album/music/${album.id}`, {
                  state: { username },
                });
              }}
              key={i}
            >
              <div
                className="card card-flex"
                style={{ width: "18rem", cursor: "pointer" }}
              >
                {album.images && album.images.length > 0 && (
                  <img
                    className="card-img-top"
                    style={{ height: "300px" }}
                    src={album.images[0]?.url}
                    alt="Card image cap"
                  />
                )}
                <div className="card-body">
                  <p
                    className="card-text value"
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {album.name}
                  </p>
                </div>
              </div>
            </a>
          ))}
      </div>
      {/* </a> */}
      //{" "}
    </div>
  );
};

export default ArtistRoute;

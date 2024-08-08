import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import "./search.css";
import Navbar from "../Home/navbar";
import { MyToken } from "../ContextAPI/context";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import image from "../../images/silivan-munguarakarama-NrR9gn3lFKU-unsplash.jpg";

const Search = () => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [albums, setAlbums] = useState([]);
  const token = useContext(MyToken);
  const [image, setImage] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  let username = location.state ? location.state.username : null;

  useEffect(() => {
    if (username === null) {
      navigate("/");
    }
  }, [username]);

  const changeHandler = (e) => {
    setSearch(e.target.value);
  };

  const searchHandler = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${search}&type=album`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const searchData = await response.json();
      setImage(searchData.albums.items[0].images[0].url);
      setData(searchData.albums.items[0].id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    searchHandler();
  }, [search, token]);

  const loadingContainerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Set a higher z-index to appear above other elements
    color: "white",
  };

  const blurOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${image})`,
    backgroundSize: "100%", // Zoom out the background image
    filter: "blur(5px)", // Add blur effect
    zIndex: -1, // Behind the loading content
  };

  useEffect(() => {
    searchHandler();
  }, [search, token]);

  useEffect(() => {
    fetch(
      "https://api.spotify.com/v1/albums/" +
        data +
        "/tracks" +
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
  }, [data]);
  console.log(albums);

  if (loading) {
    return (
      <div>
        <div style={blurOverlayStyle}></div>
        <div style={loadingContainerStyle}>
          <Spinner animation="border" role="status"></Spinner>
          <h1 className="sr-only">&nbsp;&nbsp;Loading...</h1>
        </div>
      </div>
    );
  }

  if (!loading) {
    return (
      <>
        <Navbar />
        <div className="container1">
          <div className="search-box" style={{ marginBottom: "40px" }}>
            <input
              type="text"
              className="search-box-input"
              placeholder="What are you looking for?"
              value={search}
              onChange={changeHandler}
            />
            <button className="search-box-btn" onClick={searchHandler}>
              <i className="search-box-icon material-icons">
                <i
                  className="bi bi-search"
                  style={{
                    fontSize: "22px",
                    fontWeight: "500",
                  }}
                ></i>
              </i>
            </button>
          </div>
          <Container>
            <Row className="row row-cols-4 ">
              {albums &&
                albums.length > 0 &&
                albums.map((album, i) => (
                  <a
                    onClick={() => {
                      navigate(`/search/album/${album.id}`, {
                        state: { username },
                      });
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      key={i}
                      style={{
                        background:
                          "linear-gradient(-135deg, #c850c0, #4158d0)",
                        marginBottom: "20px",
                        boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      }}
                    >
                      <Card.Img src={image} />
                      <Card.Body>
                        <Card.Title
                          style={{
                            color: "white",
                          }}
                        >
                          {album?.name}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                ))}
            </Row>
          </Container>
          <Container
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            <Button
              onClick={() => {
                navigate("/search", { state: { username } });
              }}
              style={{
                fontSize: "20px",
                marginTop: "70px",
                background: "linear-gradient(-135deg, #c850c0, #4158d0)",
              }}
            >
              Go Back
            </Button>
          </Container>
        </div>
      </>
    );
  }
};

export default Search;

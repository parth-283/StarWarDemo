import React, { useEffect, useState } from "react";
import "../style/StarWar.css";
// Material UI Search
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
// Material UI Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

function StarWar() {
  const [data, setData] = useState();
  const [search, setSearch] = useState("");
  const [response, setResponse] = useState([]);
  const [people, setPeople] = useState([]);
  const [validation, setValidation] = useState("");
  const [loader, setLoader] = useState(false);
  const [flag, setFlag] = useState(-1);
  const Api = [
    // { Url: "https://swapi.dev/api/people", Category: "people" },
    { Url: "https://swapi.dev/api/planets", Category: "planets" },
    { Url: "https://swapi.dev/api/films", Category: "films" },
    { Url: "https://swapi.dev/api/species", Category: "species" },
    { Url: "https://swapi.dev/api/vehicles", Category: "vehicles" },
    { Url: "https://swapi.dev/api/starships", Category: "starships" },
  ];
  let peopleData = [];
  let rows = [];

  useEffect(() => {
    if ((loader === true && people.length > 0) || flag === 0) {
      setLoader(false);
    }
  }, [people, flag]);

  useEffect(() => {
    if (search && search.length >= 0 && flag === 0 && people.length === 0) {
      alert("data not found");
    }
  }, [flag]);

  useEffect(() => {
    if (data) {
      let mydata = [];
      data.json.results.map((item) => {
        if (data.Category === "planets" && item?.residents.length > 0)
          mydata.push({
            Name: item.name,
            people: item.residents,
            Category: data.Category,
          });
        else if (data.Category === "films" && item?.characters.length > 0)
          mydata.push({
            Name: item.title,
            people: item.characters,
            Category: data.Category,
          });
        else if (data.Category === "species" && item?.people.length > 0)
          mydata.push({
            Name: item.name,
            people: item.people,
            Category: data.Category,
          });
        else if (data.Category === "vehicles" && item?.pilots.length > 0)
          mydata.push({
            Name: item.name,
            people: item.pilots,
            Category: data.Category,
          });
        else if (data.Category === "starships" && item?.pilots.length > 0)
          mydata.push({
            Name: item.name,
            people: item.pilots,
            Category: data.Category,
          });
      });
      if (mydata.length > 0) setResponse([...response, mydata]);

      if (data.json.next) apiCall(data.json.next, data.Category, true);
    }
  }, [data]);

  useEffect(() => {
    for (let index = 0; index < response.length; index++) {
      const Element = response[index];
      for (let j = 0; j < Element.length; j++) {
        const peopleurl = Element[j];
        for (let k = 0; k < peopleurl.people.length; k++) {
          apisCallPeople(
            peopleurl.people[k],
            peopleurl.Name,
            peopleurl.Category
          );
        }
      }
    }
  }, [response]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  let apiCount = 0;
  const apiCall = async (Url, Category, isNextPage) => {
    const apiUrl = isNextPage ? Url : `${Url}?search=${search}`;
    

    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        apiCount += 1;
        if (json.results.length > 0) {
          setFlag(1);
          setData({ json, Category });
        } else {
          if (apiCount >= 5 && flag !== 1) {
            setFlag(0);
          }
        }
      });
  };

  const apisCallPeople = async (apiUrl, CategoryName, Category) => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        peopleData.push({
          Name: json.name,
          CategoryName: CategoryName,
          Category: Category,
        });
        setPeople([peopleData]);
      });
  };

  const handleApi = async () => {
    for (let index = 0; index < Api.length; index++) {
      await apiCall(Api[index].Url, Api[index].Category);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.length > 0) {
      setValidation("**Please Enter your Search");
      console.log(search, "Validation");
    } else {
      apiCount = 0
      setFlag(-1)
      setLoader(true);
      setValidation("");
      setResponse([]);
      setPeople([]);
      peopleData = [];
      await handleApi();
    }
  };

  // Material Table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "Character", label: "Character", minWidth: 170 },
    {
      id: "Belong_To",
      label: "Character From",
      minWidth: 170,
      align: "right",
    },
  ];

  function createData(Character, Belong_To) {
    return { Character, Belong_To };
  }

  return (
    <>
      <div className="MainHeader">
        <h1 className="Header">StarWar Search</h1>
      </div>
      <div className="searchBox">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Here"
            className="textbox"
            onChange={handleSearch}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            type="submit"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSubmit}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <div>
        <h3 className="validation">{validation}</h3>
      </div>
      {loader && (
        <Box className="loader">
          <CircularProgress />
        </Box>
      )}
      {people && people.length > 0 && (
        <div className="tablemaindiv">
          <div className="table2div">
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 358 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {people &&
                        people.map((x, index) => {
                          return people[index].map((item, index2) => {
                            let CategoryName = `${item.Category} : ${item.CategoryName}`;
                            rows.push(createData(item.Name, CategoryName));
                          });
                        })}
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </div>
      )}

      {/* {people &&
            people.map((x, index) => {
              return people[index].map((item, index2) => {
                return (
                  <React.Fragment key={index2}>
                    <div>
                      {" "}
                      {item.Name +
                        " : " +
                        item.Category +
                        "=>" +
                        item.CategoryName}{" "}
                    </div>
                    <br />
                  </React.Fragment>
                );
              });
            })} */}
    </>
  );
}

export default StarWar;

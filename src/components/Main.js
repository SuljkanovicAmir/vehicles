import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './Main.css'

export const Main = () => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(5);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  const sortOptions = ["Name", "Type", "Price", "Status"]
  
  useEffect(() => {
    loadCarsData(0, 5, 0);
}, []);
 

  const loadCarsData = async (start, end, increase, optType=null, filterOrSortValue) => {
    switch (optType) {
        case 'search': 
            setOperation(optType);
            setSortValue("");
            return await axios.get(`https://my-json-server.typicode.com/SuljkanovicAmir/db.json/cars?q=${value}&_start=${start}&_end=${end}`)
                .then((response) => { 
                setData(response.data);
                setCurrentPage(currentPage + increase)
            })
            .catch((err) => console.log(err));
        case 'sort':
            setOperation(optType);
            setSortFilterValue(filterOrSortValue);
            return await axios.get(`https://my-json-server.typicode.com/SuljkanovicAmir/db.json/cars?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
                .then((response) => { 
                setData(response.data)
                setCurrentPage(currentPage + increase)
            })
            .catch((err) => console.log(err));
        case 'filter':
            setOperation(optType);
            setSortFilterValue(filterOrSortValue);
            return await axios
                .get(`https://my-json-server.typicode.com/SuljkanovicAmir/db.json/cars?Status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
                .then((response) => { 
                setData(response.data)
                setCurrentPage(currentPage + increase)
            })
            .catch((err) => console.log(err));
        default:
            return await axios
            .get(`https://my-json-server.typicode.com/SuljkanovicAmir/db.json/cars?_start=${start}&_end=${end}`)
            .then((response) => { 
                setData(response.data)
                setCurrentPage(currentPage + increase)
            })
            .catch((err) => console.log(err));    
        

    }
   
  }

 

  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue(""); 
    loadCarsData(0, 5, 0);
    console.log(loadCarsData(0, 5, 0))
  };

  const handleSearch = async (e) => {
      e.preventDefault();
      loadCarsData(0, 5, 0, 'search')
}

const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    loadCarsData(0, 5, 0, "sort", value)
}
const handleFilter = async (value) => {
    loadCarsData(0, 5, 0, "filter", value)
}

const renderPagination = () => {
    if (data.length < 5 && currentPage === 0) return null;
    if (currentPage === 0) {
        return (
            <div className='paginations'><p>1</p><button onClick={() => loadCarsData(5, 10, 1, operation, sortFilterValue)}>Next</button></div>
        )    
    } else if (currentPage < pageLimit -1 && data.length === pageLimit) {
        return (
            <div className='paginations'>
                <button onClick={() => loadCarsData((currentPage -1) * 5, currentPage * 5, -1, operation, sortFilterValue)}>Previous</button>
                 <p>{currentPage + 1}</p>
                 <button onClick={() => loadCarsData((currentPage +1) * 5, (currentPage +2) * 5, 1, operation, sortFilterValue)}>Next</button>
            </div>
        )
    } else {
        return <div className='paginations'><button onClick={() => loadCarsData((currentPage -1) * 5, currentPage * 5, -1, operation, sortFilterValue)}>Previous</button><p>{currentPage + 1}</p></div>
    }
};

  return (
        <div className='main-div'>
            <h1>Rent a Car</h1>
            <form onSubmit={handleSearch}>
                <input type="text" 
                placeholder='Search' 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                />
                <button type='submit'>Search</button>
                <button  onClick={() => handleReset()}>Reset</button>
            </form>
            <div className='table-container'>
                <table>
                        <thead>
                            <tr>
                                <th scope='col'>No.</th>
                                <th scope='col'>Car name</th>
                                <th scope='col'>Car type</th>
                                <th scope='col'>Car price</th>
                                <th scope='col'>Status</th>
                            </tr>
                        </thead>
                        {data.length === 0 ?  (
                            <tbody className='align-center mb-0'>
                                <tr>
                                    <td colSpan={5} className='text-center mb-0'>No data</td>
                                </tr>          
                            </tbody>
                        ) : (
                            data.map((car, index) => (
                                <tbody key={index}>
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{car.Name}</td>
                                        <td>{car.Type}</td>
                                        <td>{car.Price}$</td>
                                        <td>{car.Status}</td>
                                    </tr>
                                </tbody>
                            ))
                        )}
                </table>
                <div className='pagination'>
                    {renderPagination()}
                </div>
            </div>
            {data.length > 0  && (
                <div className='bottom-div'>
                <div className='selection'>
                    <h2>Sort by</h2>
                    <select
                    onChange={handleSort}
                    value={sortValue}
                    >
                        <option>Select your option</option>
                        {sortOptions.map ((item, index) => (
                        <option value={item} key={index}>{item}</option>
                        
                        ))};
                    </select>
                </div>
                <div className='show'>
                    <h2>Show:</h2>
                    <button onClick={() => handleFilter("Available")}>Available</button>
                    <button onClick={() => handleFilter("Unavailable")}>Unavailable</button>
                    <button onClick={() => handleReset()}>All</button>
                </div>
                </div>      
            )}
        </div>
  )
}


export default Main
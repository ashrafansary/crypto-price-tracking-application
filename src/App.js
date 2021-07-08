import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Crypto from './Crypto';
import ReactPaginate from 'react-paginate';


// https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false

function App() {

  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(0)

  const coinsPerPage = 10;
  const currentPage = pageNumber * coinsPerPage

  const filteredCoins = coins.filter(coin => {
    return coin.name.toLowerCase().includes(search.toLowerCase())
  })

  const pageCount = Math.ceil(coins.length / coinsPerPage)
  const changePage =({selected}) => {
    setPageNumber(selected)
  }

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false')
      .then(res => {
        setCoins(res.data)
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [pageNumber])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }


  return (
    <div className="crypto-app">
      <div className="crypto-search">
        <h1 className="crypto-search-currency">Search a currency</h1>
        <form>
          <input type="text" placeholder="Search here: type xrp " className="crypto-search-input" onChange={handleChange }/>
        </form>
      </div>
      {filteredCoins
      .slice(currentPage, currentPage + coinsPerPage)
      .map(coin => {
        return (
          <Crypto 
          key={coin.id} 
          name={coin.name} 
          image={coin.image}
          symbol={coin.symbol}
          marketcap={coin.market_cap}
          price={coin.current_price}
          priceChange={coin.price_change_percentage_24h}
          volume={coin.total_volume}
          pageCount={pageCount}
          changePage={changePage}
          />
        )
      })}
      <ReactPaginate 
        onPageChange={changePage}
        pageCount={pageCount}
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"} 
        />
    </div>
  );
}

export default App;

import React, {useState, useEffect} from 'react'
import Header from './components/header/Header'
import './App.css';
import InfoBox from './components/infoBoxes/InfoBox'
import Map from './components/map/Map'
import Table from './components/table/Table'
import LineGraph from './components/lineGraph/LineGraph'
import { Card, CardContent} from '@material-ui/core'
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css" 
import './components/infoBoxes/InfoBox.css'
 
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = 
  useState([ 34.80746, -40.4796 ]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData(); 
  }, []);


  const handleCountryChange = async (e) => {
    setLoading(true)
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = 
      countryCode === 'worldwide' 
      ? `https://disease.sh/v3/covid-19/all` 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);

        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      })

      console.log(countryInfo);
  }


  return ( 
  
        <div className="app">

          {/* Left Column */}
          <div className="app__left">
            {/* Header Section */}
            <div className="app__header">
              <Header country={country} handleCountryChange={handleCountryChange} countries={countries} />
            </div>
            {/* Infobox section */}
            <div className="app__stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                className="infoBox__cases"
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                total={prettyPrintStat(countryInfo.cases)}
                cases={prettyPrintStat(countryInfo.todayCases)}
                isloading={isLoading}
              />
              <InfoBox
                active={casesType === "recovered"}
                className="infoBox__recovered"
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                total={prettyPrintStat(countryInfo.recovered)}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                isloading={isLoading}
              />
              <InfoBox
                isGrey
                active={casesType === "deaths"}
                className="infoBox__deaths"
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                total={prettyPrintStat(countryInfo.deaths)}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                isloading={isLoading}
              />
            </div>

            {/* Map section */}
            <Map 
              countries={mapCountries} 
              center={mapCenter} 
              zoom={zoom} 
              casesType={casesType} 
            />

          </div>

          {/* Right Column */}
            <Card className="app__right">
              <CardContent>
                <h3>Live cases by Country</h3>
                <Table countries={tableData} />               
                <LineGraph />
              </CardContent>
            </Card>
        </div>
  );
}

export default App;
 
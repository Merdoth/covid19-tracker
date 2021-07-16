import React, { useState, useEffect } from "react";
import NightsStayIcon from '@material-ui/icons/NightsStay';
import {
	Card,
	CardContent,
	FormControl,
	Select,
	MenuItem,
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";

import "./App.css";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import InfoBox from "./components/InfoBox/InfoBox";
import LineGraph from "./components/Graph/LineGraph";
import { sortData, prettyPrintStat } from "./utils/util";

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((res) => res.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((res) => res.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;
		setCountry(countryCode);

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);
				countryCode === "worldwide"
					? setMapCenter([34.80746, -40.4796])
					: setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
	};

	return (
		<div className={`app ${theme}`} >
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>

					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country, index) => (
								<MenuItem key={index} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<InfoBox
						title="Coronavirus Cases"
            active={casesType === "cases"}
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
						onClick={(e) => setCasesType("cases")}
            isRed
					/>
					<InfoBox
						title="Recovered"
            active={casesType === "recovered"}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
						onClick={(e) => setCasesType("recovered")}
					/>
					<InfoBox
						title="Deaths"
            active={casesType === "deaths"}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
						onClick={(e) => setCasesType("deaths")}
            isBlack
					/>
				</div>

				<Map
					countries={mapCountries}
					casesType={casesType}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>

			<Card className="app__right">
				<CardContent>
					<div className="app__rightTitle">
						<h3>Live Cases by Country</h3>
						<button style={{ fontSize: 30 }}
            className='btn-clear' onClick={toggleTheme}>
							{ theme === 'light' 
								? <NightsStayIcon fontSize="medium" style={{ color: "#f8e076" }} /> 
								: <NightsStayIcon fontSize="medium" style={{ color: "black" }} /> 
							}
						</button>
					</div>
					<Table countries={tableData} />

					<h3 className="app__graphTitle">Worldwide new {casesType}</h3>
					<LineGraph casesType={casesType}/>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;

import React, { useEffect, useState } from 'react';
import SelectCountry from './SelectCountry';

type Countries = {
  name: string,
  flag: string,
  currency: string,
  code: string,
}

function App() {

  const [countries, setCountries] = useState<Countries[]>([]);
  const [source, setSource] = useState<string>("CAD-Canada");
  const [destination, setDestination] = useState<string>("USD-United States");
  const [conversionAmount, setConversionAmount] = useState<React.HTMLInputTypeAttribute>("");
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => {
        if (!response.ok) {
          setError("Oops, no country data is available.");
        } else {
          response.json().then((data) => sortCountries(data));
        }
      })
  }, [])

  useEffect(() => {
    setConversionResult(null);
  }, [source, destination, conversionAmount]);

  function sortCountries(data: object[]): void {
    let countries: Countries[] = [];

    data.forEach((country: any) => {
      if (country.currencies) {
        let x = Object.keys(country.currencies)[0];
        countries.push(
          {
            name: country.name.common,
            flag: country.flag,
            currency: Object.keys(country.currencies)[0],
            code: country.cca3
          }
        )
      }
    })

    countries.sort((a, b) => a.name.localeCompare(b.name));
    setCountries(countries);
  }

  function reverseCurrencies(): void {
    setSource(destination);
    setDestination(source);
    setConversionResult("");
  }

  function convertCurrencies(): void {
    setError("");

    if (conversionAmount) {
      const sourceCurrency = source.split("-").shift();
      const destinationCurrency = destination.split("-").shift();

      fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/pair/${sourceCurrency}/${destinationCurrency}/${conversionAmount}`)
        .then((response) => {
          if (!response.ok) {
            setError("Oops, the conversion failed.")
          } else {
            response.json()
              .then((data) => setConversionResult(data.conversion_result));
          }
        })
    } else {
      setError("Please enter a valid number.")
    }
  }

  return (
    <main>
      <h1>Currency Converter</h1>
      <div className="md:flex md:gap-4">
        <div>
          <h2>Amount</h2>
          <input
            type="number"
            min="1"
            placeholder="0.00"
            className="w-24 text-lg"
            value={conversionAmount}
            onChange={(e) => setConversionAmount(e.target.value)}
          />
        </div>

        <SelectCountry
          countries={countries}
          direction="From"
          value={source}
          setValue={setSource}
        />

        <button className="btn-reverse" onClick={reverseCurrencies}>&#8646;</button>

        <SelectCountry
          countries={countries}
          direction="To"
          value={destination}
          setValue={setDestination}
        />
      </div>

      <div className="result">
        {conversionResult &&
          <div>
            <h4>
              {conversionAmount} {source.split("-").shift()} =
              </h4>
            <h3>
              {conversionResult}
              <span>{destination.split("-").shift()}</span>
            </h3>
          </div>
        }
        <button className="btn-convert" onClick={convertCurrencies}>
          Convert
        </button>
      </div>

      {error &&
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setError("")}>X</button>
        </div>
      }
    </main>
  );
}

export default App;


type Countries = {
    name: string,
    flag: string,
    currency: string,
    code: string,
}

function SelectCountry({ countries, direction, value, setValue }: {
    countries: Countries[],
    direction: "From" | "To",
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
}) {

    return (
        <div className="w-64 my-4 md:my-0">
            <h2>{direction}</h2>
            <select value={value} className="w-full" onChange={(e) => setValue(e.target.value)}>
                {countries.map((country, key) =>
                    <option
                        key={key}
                        value={country.currency + "-" + country.name}>
                        {country.flag} {country.name} ({country.currency})
                    </option>
                )}
            </select>
        </div>
    );
}

export default SelectCountry;

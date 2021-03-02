import { FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react'
import './Header.css'


function Header({handleCountryChange, country, countries}) {

    
    return (
            <>
                <h1>COVID-19 TRACKER</h1>
                <FormControl className="app__dropdown">
                <Select variant="outlined" onChange={handleCountryChange} value={country}>
                    <MenuItem value="worldwide">Worldwide</MenuItem>
                    {
                    countries.map((country) => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                    }
                </Select>
                </FormControl>
            </>
    )
}

export default Header

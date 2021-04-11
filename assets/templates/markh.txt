# Server Side APIs: Weather Dashboard

## Description

This project was to build a web app that will use the OpenWeather API to populate a Weather Dashboard. The app will feature dynamically updated HTML and CSS. It will use `localStorage` to store any persistent data.

```md
The app should operate within the following requirements:
1. The user can search a city and be shown:
    * Current weather conditions for that city.
    * A 5-day forecast for that city.
2. The block that displays the current weather conditions should show:
    * the city name 
    * the date 
    * an icon representation of weather conditions 
    * the temperature
    * the humidity
    * the wind speed
    * the UV index
        * presented with a color that indicates whether the conditions are favorable, moderate, or severe
3. The block that displays the 5-day forecast should show:
    * the date
    * an icon representation of weather conditions
    * the temperature
    * the humidity
4. Searched City History will be displayed
    * When the user clicks on a city in the Searched City History the current and 5-day forecast for that city should be displayed.
    * Cities should be listed alphabetically and only once in the Searched City History
5.  The search city entered should be:
    * Capitalized appropriately
    * Prompted for corrections for entries that don't return weather
    * Displayed in the Searched City History
```
## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Badges](#badges)
* [Features](#features)
* [Contributing](#contributing)
* [Tests](#tests)


## Installation

```md
The following steps should be used to install:
1. Push code to GitHub repository
    * git add -A
    * git committ -m "descriptive message"
    * git push
2. Select the Settings in GitHub
    * Scroll down to the GitHub Pages section
    * Under Source select to use main branch as source
```

## Usage 

Navigate to:
[https://markhatthorinc.github.io/06-Server-Side-APIs/](https://markhatthorinc.github.io/06-Server-Side-APIs/)

**Images of App:**
![Weather Dashboard on Initial Load](./assets/images/WeatherDashboard_Initial.png)
![Weather Dashboard with One City](./assets/images/WeatherDashboard_OneCity.png)
![Weather Dashboard with Multiple Cities](./assets/images/WeatherDashboard_MultipleCities.png)


## Credits

Trilogy Education Services, LLC, a 2U, Inc. brand


## License

MIT License

Copyright (c) 2021 Mark S. Harrison

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Badges

![badgeGT](https://img.shields.io/static/v1?label=%3CGT%20Bootcamp%3E&message=06-Server-Side-APIs&color=blue)
![badgeCourse](https://img.shields.io/static/v1?label=%3CCourse%20Work%3E&message=06-Homework&color=blue)

## Features

There are no special features on this page.

## Contributing


## Tests

```md
Verify links work:
1. Enter a city in the _Search_ box and click on the search button (magnifying glass).
2. You should see the current weather and 5-day forecast for the city entered.
3. The city you entered should appear in a Searched City History below the _Search_ box.
4. Clicking a previously searched city will display the current weather and 5-day forecast for this city.
```

```md
Verify page layout and that all images display.
```

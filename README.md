# NHL Team Schedule CSV Generator

## Usage

1. Clone the repository

```bash
git clone git@github.com:timcappalli/nhl-schedule-csv.git
```

2. Install dependencies

```bash
cd nhl-schedule-csv
npm install
```

3. Update the `TEAM` variable with your team's short code (e.g. "BOS" for Boston Bruins)

4. Update the `SEASON` variable with the season identifier (ex: "20242025" for 2024-2025 season)

5. Update the `TIMEZONE` variable with an [IANA time zone identifier](https://data.iana.org/time-zones/tzdb-2021a/zone1970.tab) (ex: "America/New York")

6. Run the generator ( `node app.js` )

7. An CSV file will be generated in the working directory with the name "{TEAM}-{SEASON}.csv".

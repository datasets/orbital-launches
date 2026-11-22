Every attempt to launch something into orbit since Sputnik in October 1957, counted per year, with how many succeeded and failed, which state launched them, and how many satellites and spacecraft (payloads) reached orbit. The counts are aggregated from Jonathan McDowell's General Catalog of Artificial Space Objects (GCAT), the most complete public record of spaceflight. Coverage runs from 1957 as of GCAT's 19 November 2026 update (latest launch listed: 15 November 2026), so 2026 is a partial year. Units are counts of launches and of payloads.

From 1957 as of GCAT's 19 November 2026 update (latest launch listed: 15 November 2026) there were 7,431 orbital launch attempts: 6,923 successes and 508 failures. The busiest year so far is 2025, with 329 attempts, more than twice the busiest year of the space race (139 in 1967).

This is a frozen snapshot taken on 2026-11-22, from GCAT data updated on 19 November 2026.

## What stands out

More than half of all the satellites and spacecraft ever put into orbit went up in 2021–2025. Of the 27,376 payloads that reached orbit from 1957 to the end of 2025, 14,722 (53.8%) were launched in 2021 to 2025. 2025 alone put 4,572 payloads into orbit, more than in the first 28 years of the space age combined (4,493 from 1957 to 1984).

## Data

`data/orbital-launches-by-year.csv`: one row per year, 1957 to 2026.

- `year`: calendar year of launch (UTC)
- `attempts`: orbital launch attempts from Earth
- `successes`, `failures`: attempts that GCAT scores as successes or failures
- `payloads_to_orbit`: payloads carried on that year's launches that reached Earth orbit or beyond

`data/orbital-launches-by-state.csv`: one row per year and launching state (only states with at least one attempt that year).

- `year`, `attempts`, `successes`, `failures`: as above
- `state_code`: GCAT's state code for the launch (its LVState field)
- `state_name`: a plain English name for the code

Notes and caveats:

- An orbital launch attempt is a launch from Earth that GCAT classes as orbital (launch code O) or deep space (D), whether it succeeded or failed. Pad explosions and pad aborts are left out, because the rocket never flew. So are "near-orbital" flights that were not meant to reach a full orbit, such as the first three Starship test flights (April 2023 to March 2024); GCAT classes later Starship test flights as orbital, so they are counted. Launches from the Moon.
- Success and failure follow GCAT. Success and failure follow GCAT's own S/F code; McDowell treats a score below 0.75 as a failure, so a launch that reached a slightly wrong but usable orbit counts as a success.
- The state is GCAT's own assignment, and it does not always match where the rocket was built or launched. Electron launches from New Zealand count as New Zealand (NZ). Most Ariane launches, and Soyuz launches run by Arianespace or Starsem, count as France (F); a few Ariane and Vega launches count as the European Space Agency (I-ESA). The Soviet Union (SU) runs to 1991 and Russia (RU) starts in 1992.
- Payloads are satellites and spacecraft, not rocket stages or debris. A payload counts as reaching orbit unless GCAT lists it in its failed-to-orbit catalog, so a payload from a partly failed launch can still count. Objects released from the International Space Station are counted in the year they were launched to the station, not the year they were released.
- 2026 runs only as of GCAT's 19 November 2026 update (latest launch listed: 15 November 2026). Recent entries may still be revised by GCAT.

The CSVs are built from the archived source file with `node scripts/build.mjs`.

## Source and licence

Data from GCAT (J. McDowell, planet4589.org/space/gcat). Full citation: McDowell, Jonathan C., 2020. General Catalog of Artificial Space Objects, Release 1.8.9, https://planet4589.org/space/gcat. This dataset uses the GCAT Orbital Launch Log (https://planet4589.org/space/gcat/tsv/derived/launchlog.tsv), data update of 19 November 2026.

GCAT states: "GCAT is released under the Creative Commons CC-BY licence" and "Licence: CC-BY-4.0 Creative Commons/Attribution". This dataset is released under the same licence, Creative Commons Attribution 4.0 (CC-BY-4.0). If you use it, credit Jonathan McDowell and GCAT.

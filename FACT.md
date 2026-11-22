# Fact for checking

Claim (README "What stands out"): More than half of all the satellites and spacecraft ever put into orbit went up in 2021–2025. Of the 27,376 payloads that reached orbit from 1957 to the end of 2025, 14,722 (53.8%) were launched in 2021 to 2025. 2025 alone put 4,572 payloads into orbit, more than in the first 28 years of the space age combined (4,493 from 1957 to 1984).

Numbers (from `data/orbital-launches-by-year.csv`, column `payloads_to_orbit`):

- 1957–2025 total: 27,376
- 2021–2025: 14,722 (53.8% of 27,376)
- 2025: 4,572
- 1957–1984: 4,493 (1957–1985 would be 4,741, more than 2025)

Recompute:

```sh
awk -F, 'NR>1 && $1<=2025{t+=$5; if($1>=2021) r+=$5; if($1<=1984) e+=$5; if($1==2025) y=$5} END{printf "total %d, 2021-25 %d (%.1f%%), 2025 %d, 1957-84 %d\n", t, r, 100*r/t, y, e}' data/orbital-launches-by-year.csv
```

Expected: `total 27376, 2021-25 14722 (53.8%), 2025 4572, 1957-84 4493`

Other numbers in the README intro: 7,431 attempts, 6,923 successes, 508 failures (1957 to 19 Nov 2026); 329 attempts in 2025; 139 in 1967.

```sh
awk -F, 'NR>1{a+=$2;s+=$3;f+=$4} END{print a,s,f}' data/orbital-launches-by-year.csv; awk -F, '$1==2025||$1==1967' data/orbital-launches-by-year.csv
```

Things worth checking: the definition of an orbital attempt (GCAT launch code starting O or D followed by S or F; see scripts/build.mjs) and that "payload reached orbit" means JCAT not starting with F (failed-to-orbit catalog). Payloads are satellites/spacecraft only, so "objects" in promotion copy must not be read as including debris.

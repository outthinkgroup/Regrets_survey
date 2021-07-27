# World Regret Survey

## Documentation

## TODOS

- research localization for gatsby.
- pull in new results.

## Notes

- Think about if creating new Json Files instead of overwriting the same json file would be better.
- Research Sentry and add it to triggerRebuild action

## Bugs

- Its not Rebuilding
  - the end result is always 1 ?

## V2 of TRIGGERREBUILD
with this rebuild Im going to 
- make it easier to rebuild when stuff goes wrong
- make files more robust
- functions more modular
- clean up unused functions
- easier to debug and see if things are incorrect.


### Local Functions
These are functions to help rebuild data when stuff has gone wrong. Intended for restarting and debugging purposes
- Rebuild all
  - separate files by month
  - 
# Learning

Materiály pro denní učení (jazyky, IT), tvořené skillem `/teach` v Claude Code.

## Struktura

- `<oblast>/<tema>/repo/` – workspace pro `/teach` (MISSION, RESOURCES, lessons, reference, assets, learning-records)
- `<oblast>/<tema>/podklady/` – surové materiály, **necommitují se**
- `scripts/build.py` – sestaví `_site/` (jen lessons, reference, assets + rozcestník)
- `scripts/smoke_test.py` – ověří stránky a odkazy v `_site/`
- `VERSION` – verze webu, zobrazená v patičce

## Postup

1. `cd jazyky/anglictina/repo && claude`, pak `/teach`
2. Lokálně: `python3 scripts/build.py && python3 scripts/smoke_test.py`
3. Nasazení jen na pokyn „nasaď“: zvednout `VERSION`, commit, `git push` (GitHub Actions postaví a nasadí Pages)

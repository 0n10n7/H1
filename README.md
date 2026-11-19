# Hållut

Prototyp av en kollektivtrafikapp i SL-stil där **autonoma anropsstyrda bussar** är en del av
den vanliga reseplaneraren:

1. **Sök resa** – från, till och när (åka nu eller välj datum och tid).
2. **Reseförslag** – vanliga bussar blandas med bokningsbara autonoma bussar.
3. **Bekräfta bokning** – välj ett autonomt förslag och boka.
4. **Resan är bokad** – följ bussen live på kartan, med påstigningskod.

Fliken **Karta** visar alla autonoma bussar just nu. **Biljetter**, **Mer** och **Trafikläget**
är tomma platshållare.

Ren Svelte 5-app byggd med Vite – ingen backend. Bussarna simuleras direkt i webbläsaren
i [src/lib/autobuss.svelte.js](src/lib/autobuss.svelte.js) och reseförslagen tas fram i
[src/lib/planner.js](src/lib/planner.js).

## Kom igång

```sh
bun install      # eller: npm install
bun run dev      # eller: npm run dev  → http://localhost:5173
```

`bun run build` bygger en statisk sida till `dist/`. `bun run preview` visar den lokalt.

## Publicera på GitHub Pages

Workflowen [.github/workflows/deploy.yml](.github/workflows/deploy.yml) bygger och publicerar
sidan automatiskt vid varje push till `main`.

1. Skapa ett nytt repo på GitHub, t.ex. `hallut`.
2. I repot: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Pusha koden:

   ```sh
   git init
   git add .
   git commit -m "Första versionen"
   git branch -M main
   git remote add origin https://github.com/<användarnamn>/hallut.git
   git push -u origin main
   ```

4. Följ bygget under fliken **Actions**. Efter någon minut finns appen på
   `https://<användarnamn>.github.io/hallut/`.

Vite är inställt på relativa sökvägar (`base: './'` i `vite.config.js`), så sidan fungerar
oavsett vad repot heter.

## Simuleringen

- 7 hållplatser, 3 vanliga busslinjer och 3 förarlösa bussar i ett påhittat trafikområde i
  Barkarby ([src/lib/places.js](src/lib/places.js)).
- Vanliga bussar föreslås bara om en linje går mellan hållplatserna. Autonoma bussar kan
  bokas mellan alla hållplatser och är snabbare eftersom de kör direkt.
- En resa går igenom `scheduled` → `to_pickup` → `boarding` → `riding` → `completed`
  (eller `cancelled`). Resor som avgår inom 15 minuter får en buss direkt; senare resor
  kan startas med knappen "Starta resan nu (demo)".
- Andra simulerade resenärer bokar bussar ibland, men en buss lämnas alltid ledig åt dig.
- Demotid: 1 sekund i simuleringen motsvarar 1 minut, så en resa tar under en minut att följa.
- Allt ligger i minnet – laddar du om sidan börjar simuleringen om.

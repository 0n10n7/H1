# Hållut

Prototyp av en kollektivtrafikapp i SL-stil med en ny flik för **autonoma anropsstyrda bussar**.
Övriga flikar (Sök resa, Avgångar, Biljetter, Trafikläget) är tomma platshållare.

Ren Svelte 5-app byggd med Vite – ingen backend. Bussarna simuleras direkt i webbläsaren
i [src/lib/autobuss.svelte.js](src/lib/autobuss.svelte.js).

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

- 7 hållplatser och 3 förarlösa bussar i ett påhittat trafikområde i Barkarby.
- Närmaste lediga buss skickas när du beställer. En resa går igenom
  `to_pickup` → `boarding` → `riding` → `completed` (eller `cancelled`).
- Andra simulerade resenärer beställer bussar ibland, men en buss lämnas alltid ledig åt dig.
- Tiden går snabbare än i verkligheten (`SPEED` och `BOARDING_SECONDS` högst upp i filen).
- Allt ligger i minnet – laddar du om sidan börjar simuleringen om.

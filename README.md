# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Photos
- Photo `public/images/` mein daalo (JPG ya PNG, kam az kam 1400px chaudi; phone ki bari photo bhi chalegi) aur `school.js` mein `'/images/naam.jpg'` likho.
- `npm run dev` / `npm run build` khud har photo ke chhote-bade WebP versions aur blur placeholder bana deta hai (`public/images/_opt/` aur `src/data/images.json`). Phone ko chhoti file milti hai, laptop ko bari.
- Kam resolution wali photo par terminal mein warning aati hai.
- Focal point: kisi bhi photo ke data mein `pos: '50% 20%'` likho (x% y%) taake crop mein sahi hissa (jaise chehra) dikhe.
- Gallery: `gallery: [{ img, alt, caption, cat: 'Events' }]`. `cat` se filter buttons ban jate hain.
- `assets-original/` mein purani 410px photos ka backup hai (site ye use nahi karti).

# Portfólio — Lizarb | QA Sênior

Site estático (HTML + CSS + JS puro, sem build) pronto para o GitHub Pages.

## 1. O que editar antes de publicar

Procure por `EDITAR` e `SEU-USUARIO` em `index.html`:

- [ ] Seu nome completo (título, `<meta>`, navegação, rodapé)
- [ ] Seção **Trajetória**: cargos, empresas, períodos e conquistas (copie do LinkedIn)
- [ ] Seção **Contato**: e-mail, LinkedIn e GitHub
- [ ] Links "Meu GitHub" na seção Entregas
- [ ] (Opcional) PDF do currículo em `assets/` e descomentar o botão de download
- [ ] (Opcional) Métricas reais nos cards, se quiser números de resultado

## 2. Publicar no GitHub Pages

1. Crie um repositório público chamado **`SEU-USUARIO.github.io`** (exatamente assim).
2. Envie os arquivos:

```bash
git init
git add .
git commit -m "feat: portfólio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-USUARIO.github.io.git
git push -u origin main
```

3. No GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
4. Em ~1 minuto o site estará em `https://SEU-USUARIO.github.io`.

## 3. Testar localmente

```bash
npx serve .
# ou
python3 -m http.server 8080
```

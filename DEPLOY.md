Kana Sprint pode rodar em tres jeitos:

1. Local puro
   Abra `index.html` ou rode o servidor local que ja existe.

2. Local com Supabase
   Preencha [supabase-config.js](C:/Users/pedro.dessanti/Documents/Codex/2026-08-04/referenced-chatgpt-conversation-this-is-an/outputs/kana-sprint/supabase-config.js) com a URL e a anon key publica do seu projeto e abra com um servidor local simples.

3. Online com Vercel + Supabase
   Use esta mesma pasta como projeto no Vercel e adicione as variaveis:
   `SUPABASE_URL`
   `SUPABASE_ANON_KEY`

Passos no Supabase:

1. Crie um projeto novo.
2. Em `Auth > Providers > Email`, deixe login por email ligado.
3. Em `Auth > Providers > Email`, desative a confirmacao obrigatoria por email.
   Sem isso, o modo "nome + senha" nao entra direto depois do cadastro.
4. No SQL Editor, rode o arquivo [supabase-schema.sql](C:/Users/pedro.dessanti/Documents/Codex/2026-08-04/referenced-chatgpt-conversation-this-is-an/outputs/kana-sprint/supabase-schema.sql).
5. Copie a `Project URL` e a `anon public key`.

Passos no Vercel:

1. Importe esta pasta como projeto.
2. Defina `SUPABASE_URL` e `SUPABASE_ANON_KEY` nas variaveis de ambiente.
3. Faça o deploy.
4. O endpoint `/api/runtime-config` injeta essas chaves publicas no frontend automaticamente.

Observacoes:

- O ranking compartilhado aparece quando o Supabase estiver ativo.
- Sem Supabase configurado, o app continua funcionando no modo local.
- A anon key do Supabase e publica. Nao use a service role key no frontend.

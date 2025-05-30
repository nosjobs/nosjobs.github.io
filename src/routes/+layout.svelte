<link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Ubuntu&display=swap" rel="stylesheet">

<script>
  import { MetaTags } from 'svelte-meta-tags'
  import { base } from '$app/paths'
  export let title = "Default Title"
  import '../styles/style.sass'

  import LoginButton from '$lib/components/LoginButton.svelte'
</script>

<MetaTags
  title="NosJobs - Conectando talentos e oportunidades no universo Bitcoin"
  titleTemplate="%s"
  description="Encontre ou publique vagas de trabalho no ecossistema Bitcoin. A plataforma ideal para quem vive o futuro descentralizado."
  canonical="https://nosjobs.space"
  openGraph={{
    url: 'https://nosjobs.space',
    title: 'NosJobs - Conectando talentos e oportunidades no universo Bitcoin',
    description: 'NosJobs conecta profissionais e empresas que compartilham valores descentralizados. Vagas remotas, em Bitcoin, para quem acredita no futuro da liberdade financeira.',
    images: [
      {
        url: 'https://nosjobs.space/nosjobs-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'NosJobs - Plataforma de vagas no universo Bitcoin'
      }
    ],
    siteName: 'NosJobs'
  }}
  twitter={{
    creator: '@nosjobs', // troque pelo seu handle real, se houver
    site: '@nosjobs',
    cardType: 'summary_large_image',
    title: 'NosJobs - Conectando talentos e oportunidades no universo Bitcoin',
    description: 'Plataforma de empregos focada em Bitcoin. Vagas remotas, descentralizadas e alinhadas com o futuro do trabalho.',
    image: 'https://nosjobs.space/nosjobs-cover.jpg',
    imageAlt: 'NosJobs - Plataforma de empregos para usuários Bitcoin'
  }}
/>

<main>
  <header class="head">
    <div class="wrapper">
      <div class="head-top">
        <a class="logo" href="{base}/">
          <img src="/nosjobs.svg" />
        </a>
        <a class="head-btn" href="#">
          <img src="/iconMenu.svg" />
        </a>
      </div>
      <div class="head-bot">
        <ul class="head-nav">
          <!--li><a href="{base}/jobs/post">Postar Vaga</a></li>
          <li><a href="/freelancers" title=''>Freelancers</a></li-->
          <LoginButton />
          <!--li class="dropdown">
            <div class="dropdown-active">
              <div class="dropdown-active__icon"><img src="/icon-lang.svg" /></div>
              <div class="dropdown-active__text">pt-br</div>
            </div>
            <ul class="dropdown__body">
              <li><a href="#">EN</a></li>
              <li><a href="#">PT-BR</a></li>
              <li><a href="#">ES</a></li>
            </ul>
          </li-->
        </ul>
      </div>
    </div>
  </header>

  <slot></slot> <!-- This is where the child content will be rendered -->

  <footer class="foot">
    <div class="wrapper">
      <div class="foot-top">
        <a class="foot-logo" href="/" title="NosJobs">
          <img class="logo-foot__img" src="/nosjobs-white.svg" alt="NosJobs" />
        </a>
      </div>

      <div class="foot-bot">
        <!--ul class="foot-nav">
          <li><a href="/landing/post">Postar Vaga</a></li>
          <li><a href="/freelancers" title=''>Freelancers</a></li>
        </ul-->
        <ul class="foot-social">
          <li>
            <a href="https://njump.me/npub10j5hz4l6l9ea6u2nut0r66v5d07lsqjaj4jl80sf0phyanaduefsnkc4cn" title="Nostr">
              <img src="/nostr.svg" alt="Nostr" />
            </a>
          </li>
          <li>
            <a href="https://github.com/nosjobs" title="Github">
              <img src="/github.svg" alt="Github" />
            </a>
          </li>
        </ul>
        <div class="foot-copy">© 2025 BitVagas</div>
      </div>
    </div>
  </footer>
</main>

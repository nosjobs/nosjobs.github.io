<link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Ubuntu&display=swap" rel="stylesheet">

<script>
  import { base } from '$app/paths'
  export let title = "Default Title"
  import '../styles/style.sass'

  import LoginButton from '$lib/components/LoginButton.svelte'
</script>

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
            <a href="" title="Nostr">
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

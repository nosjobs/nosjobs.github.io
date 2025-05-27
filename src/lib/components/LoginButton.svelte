<script>
  import { nostrProfile, loginWithNostr, logoutNostr } from '$lib/stores/nostr.js'
  import { onMount } from 'svelte'
  let profile

  const unsubscribe = nostrProfile.subscribe(value => {
    profile = value
  })

  onMount(() => {
    return () => unsubscribe()
  })
</script>

{#if profile?.pubkey}
  <li class="dropdown">
    <div class="dropdown-active">
      <div class="dropdown-active__icon"><img src={profile.picture} /></div>
      <div class="dropdown-active__text">
        {profile.name}
      </div>
    </div>
    <ul class="dropdown__body">
      <li><a href="/jobs/post">Postar Vaga</a></li>
      <li><a href="/my/jobs">Minhas Vaga</a></li>
      <!--li><a href="/my/cv">Meu Curriculo</a></li-->
      <li><a on:click={logoutNostr} href="#">Log out</a></li>
    </ul>
  </li>
{:else}
  <button on:click={loginWithNostr} class="btn btn--primary">Log in</button>
{/if}

<style>
  .user {
    display: flex;
    align-items: center;
    gap: .3rem;
  }
  img {
    border-radius: 50%;
    height: 32px;
    width: 32px;
  }
</style>

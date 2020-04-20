<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script context="module">
  import mf from '../components/multifetch.js';

  export async function preload({ host, params, query }) {
    let baseUrl = ''
    if (!process.browser && process.env.NOW_REGION) {
	baseUrl = `https://${host}`
    }

    let urls = [
      {v: 'latest', u: `${baseUrl}/posts/latest.json`}
    ];

    // let ret = await mf.call(this, urls);
    return {...ret};
  }
</script>

<script>
import { stores } from '@sapper/app';


const { preloading } = stores();
export let searchterm = "a";

async function search() {
  const res = await fetch(`https://messagechache.pandemy.xyz/api/search?query=${searchterm}`);
  const text = await res.text();

console.log(res, text);
  if (res.ok) {
    return text;
  } else {
    throw new Error(text);
  }
    
}
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<form on:submit|preventDefault={search}>
	<input name="search" bind:value="{searchterm}" />
	<input type="submit" />
</form>

{searchterm}

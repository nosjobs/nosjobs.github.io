//import adapter from '@sveltejs/adapter-auto';
import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
    prerender: {
      entries: ['*'], // Isso garante que todas as rotas sejam prerenderizadas

      // Implementing handleHttpError
      handleHttpError: (error) => {
        // Log the error or handle it as needed
        console.error('HTTP Error:', error);

        // You can return a custom response or throw an error
        // For example, you can return a 404 page
        if (error.status === 404) {
          return {
            status: 404,
            error: new Error('Page not found'),
          };
        }

        // For other errors, you can return a generic error page or rethrow
        return {
          status: error.status || 500,
          error: new Error('An unexpected error occurred'),
        };
      },
    },
	}
};

export default config;

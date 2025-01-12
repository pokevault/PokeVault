## PokéVault - v0.1.5

<img style="margin-right: 12px;" align="left" src="https://avatars.githubusercontent.com/u/154698405?s=200&u=ded331a652f3ba2ec0168cbb20f0cae52dda9ff7&v=4"></img>

PokéVault is a **Highly W.I.P** attempt at a *somewhat* drop-in alternative to ~~Pokémon H~~, a certain service hosted by a certain company.

My aim for this project is to provide anyone with a way of archiving & protecting their precious Pokémon, no matter what.


### Building

The whole project (right now) is built around [Docker Compose](https://docs.docker.com/compose/).
First, install it for your desired system, move into the `/docker` folder & then run `docker compose up -d`
The frontend UI can be accessed via `http://localhost:80`. I may add a way to change the port in the future, so keep an eye out

### TODO

- [ ] Support for generations >= 3
- [ ] Save Box Editor
- [ ] Ability to edit Pokémon via form
- [ ] View Pokémon added via form visible within the Box component
- [ ] Get basic homebrew support added
- [ ] Create offline-first static version

Once these have been done, the Project's version will be bumped to v1.0.
After this, I will upgrade to Svelte 5 & start work on v2.0, which will include an overhauled UI & backend, alongside offical native support via Tauri.

## Credits

- [Bulbapedia](https://bulbapedia.bulbagarden.net/) - Supplying a lot of the data used within this Project, alongside the images used in the favicon.
- [PokéAPI](https://pokeapi.co) - Also supplying most of the data used, especially within the form & info pages.
- [PKHeX](https://github.com/kwsch/PKHeX) - For its maintainer [kwsch](https://github.com/kwsch/) & its contributors, for creating PKHeX.Core library, which is the foundation for the whole project
- [The Noun Project](https://thenounproject.com/) - The treasure trove of resources that make up the Project's logo
- And to everyone else that have indirectly helped - Thank You :)
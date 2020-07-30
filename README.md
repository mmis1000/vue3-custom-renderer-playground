# vue3-custom-renderer-playground

A playground to play with the vue3 custom renderer

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Caveats

Due to a issue in vue cli/vue loader.  
This repo used a plugin to dirty patch the loader to make build work in parallel mode.  
This should not be required in the future.

See also: [https://github.com/vuejs/vue-cli/issues/5723](https://github.com/vuejs/vue-cli/issues/5723)

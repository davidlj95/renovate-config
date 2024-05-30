# Renovate config

A series of configurations and presets for [Renovate] dependency updates bot

## Angular

> [!WARNING]
> This is currently a work in progress

Angular and Angular CLI need some dependencies to operate (apart from their own internal `@angular(-devkit)/*` ones).

Specifically [Node.js], [TypeScript], [RxJS] and [zone.js]

Each minor Angular version may introduce support for newer versions of those dependencies. And each Angular major version may also drop support for some older versions.

Angular maintains [a list of compatible dependencies](https://angular.dev/reference/versions) for each minor version of Angular out there.

In order to configure [Renovate] to update dependencies within the compatible range with your current Angular version, you can use one of the [Angular presets].

For instance, to use dependencies compatible with Angular 18.0.x, add the following to your [Renovate config]:

```json
{
  "extends": ["github>davidlj95/renovate-config:angular/v18.0.x"]
}
```

Checkout the [Angular presets] file for all the available presets. For more information about version compatibility data, check [Angular versions compatibility sources](./angular-versions-compatibility-sources/index.md)

[Angular presets]: ./angular.json
[Node.js]: https://nodejs.org/
[TypeScript]: https://www.typescriptlang.org/
[RxJS]: https://rxjs.dev/
[zone.js]: https://www.npmjs.com/package/zone.js
[Renovate config]: https://docs.renovatebot.com/configuration-options/
[Renovate]: https://www.mend.io/renovate/

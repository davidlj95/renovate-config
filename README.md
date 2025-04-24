# Renovate config

A series of configurations and presets for [Renovate] dependency updates bot

## Angular

### Why is this needed?

> [!WARNING]
> This is currently a work in progress

Angular and Angular CLI need some dependencies to operate (apart from their own internal `@angular(-devkit)/*` ones). Specifically [Node.js], [TypeScript], [RxJS] and [zone.js]

Nowadays [Renovate doesn't check if upgrades satisfy peer dependencies](https://github.com/renovatebot/renovate/issues/1864). Hence, it may suggest some dependency upgrades that would not be compatible with Angular.

Each minor Angular version may introduce support for newer versions of those dependencies. And each Angular major version may also drop support for some older versions. Angular maintains [a list of compatible dependencies](https://angular.dev/reference/versions) for each minor version of Angular out there.

In order to configure [Renovate] to update dependencies within the compatible range with your current Angular version, you can use one of the following [Angular presets].

### Usage

#### Safest: by minor version

You can restrict Renovate into update dependencies whose versions are compatible with a specific Angular minor version. For instance, for Angular 19.0.x, add the following to your [Renovate config]:

```json
{
  "extends": ["github>davidlj95/renovate-config:angular/v19.0.x"]
}
```

> [!TIP]
> Remember to change that preset every time you upgrade your Angular minor version in order to leverage newer versions support.
>
> If you forget to update it, you may miss updates if the new Angular minor you're using supports an updated range of dependency versions. But existing dependency versions will keep working though as dropping support for a version is only done in major Angular releases. That's why this is the safest option

#### Handy: by major version

You can configure Renovate to update dependencies whose versions are compatible with latest version of a given Angular major version. For instance, to allow upgrading to dependency versions that are compatible with the latest version of Angular v19, add the following to your [Renovate config]:

```json
{
  "extends": ["github>davidlj95/renovate-config:angular/v19-lts"]
}
```

> [!WARNING]
> This requires a bit of manual good practice by your side. **You should first update Angular to latest minor version, then update their dependencies**. Otherwise, you may update a dependency whose version is not supported for the Angular minor version you're using.
>
> Most of the time nothing will happen as no breaking changes should be introduced in a minor version. But who knows 🎱 The good bit: **no need to update the preset config until upgrading to a major version 🎉**

> [!NOTE]
> The `v19-lts` format is actually the [same npm tag format Angular uses to label the latest package release of a major version release](https://www.npmjs.com/package/@angular/core?activeTab=versions)

### Presets list

Checkout the [Angular presets] file for all the available presets.

For more information about where version compatibility data was extracted from, check [Angular versions compatibility sources](./angular-versions-compatibility-sources/index.md)

[Angular presets]: ./angular.json
[Node.js]: https://nodejs.org/
[TypeScript]: https://www.typescriptlang.org/
[RxJS]: https://rxjs.dev/
[zone.js]: https://www.npmjs.com/package/zone.js
[Renovate config]: https://docs.renovatebot.com/configuration-options/
[Renovate]: https://www.mend.io/renovate/

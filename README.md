# Renovate config

A series of presets for [Renovate] dependency updates bot

- [Angular](#angular)
- [Schedule](#schedule)
- [Commit](#commit)
- [Personal](#personal)

[Renovate config]: https://docs.renovatebot.com/configuration-options/
[Renovate]: https://www.mend.io/renovate/

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

## Schedule

### Why is this needed?

Renovate allows [scheduling dependency updates](https://docs.renovatebot.com/key-concepts/scheduling/). However, specifying a period when Renovate can perform dependency updates is not so easy:

- **Renovate Mend App**: if not self-hosting Renovate, the cloud app will run [from time to time](https://docs.renovatebot.com/known-limitations/#the-mend-renovate-app-and-scheduled-jobs) and see if it's the right moment to do dependency updates based on the configuration. So the schedule you define must take this into account.
- **Schedule syntax**: at the moment of writing specified via a `cron` or via a string to be parsed with `@breejs/later` library. `cron` lines are not very straight-forward to parse as humans. With the latter, despite more human, can be prone to error. Library may fail to parse it, and [Renovate will reject it if it fails to parse it](https://github.com/renovatebot/renovate/blob/32.241.11/lib/workers/repository/update/branch/schedule.ts#L55-L59). Also specifying it in this more human-friendly syntax [will be deprecated](https://docs.renovatebot.com/key-concepts/scheduling/#deprecated-breejslater-syntax)

Therefore, sharing here some presets that may be useful. They are tested to ensure they behave as expected.

### Usage

#### First weekend of the month. During the day.

This will schedule your updates for the first weekend of every month. Saturday and Sunday. Will skip dependency updates at night so you can have sweet dreams. To use it:

```json
{
  "extends": [
    "github>davidlj95/renovate-config:schedule/first-weekend-month-day"
  ]
}
```

## Commit

### Why is this needed?

By default, [Renovate detects the commit style of the repo to commit in the same way as previous commits](https://docs.renovatebot.com/semantic-commits/).

If [Semantic Commit messages](https://www.conventionalcommits.org/) are used, the defaults are:

- [Type: `chore`](https://docs.renovatebot.com/configuration-options/#semanticcommittype)
- [Scope: `deps`](https://docs.renovatebot.com/configuration-options/#semanticcommitscope)

This may not be your taste, so offering more options in here

## Usage

### Dependabot

I like how Dependabot creates the commit messages. [Documentation is not very specific about how they are created](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#commit-message--). However, from pragmatic experience, commit messages use:

- Type: `build`
- Scope: `deps` or `dev-deps`

If you prefer this kind of dependabot-like commit messages, you can use them with this preset:

```json
{
  "extends": ["github>davidlj95/renovate-config:commit/dependabot"]
}
```

## Personal

A list of personal and opinionated configurations. Those are very subjective to change and may change at any time.

### Usage

If you find some useful and still want to use them, specify a Git reference (like short commit id) to avoid breaking changes.

```json
{
  "extends": ["github>davidlj95/renovate-config:personal/automerge#d73d806"]
}
```

> [!WARNING]
> I have never used this, so not sure that it will work either.
> [Example configs](https://docs.renovatebot.com/config-presets/#example-configs) never use a ref, just tags. However, another example about preset templates suggests it is a valid use case.

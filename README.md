# Renovate config

A series of presets for [Renovate] dependency updates bot

- [Angular](#angular)
- [Schedule](#schedule)
- [Commit](#commit)
- [Groups and packages](#groups-and-packages)
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

You can restrict Renovate into update dependencies whose versions are compatible with a specific Angular minor version. For instance, for Angular 20.0.x, add the following to your [Renovate config]:

```json
{
  "extends": ["github>davidlj95/renovate-config:angular/v20.0.x"]
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
  "extends": ["github>davidlj95/renovate-config:angular/v20-lts"]
}
```

> [!WARNING]
> This requires a bit of manual good practice by your side. **You should first update Angular to latest minor version, then update their dependencies**. Otherwise, you may update a dependency whose version is not supported for the Angular minor version you're using.
>
> Most of the time nothing will happen as no breaking changes should be introduced in a minor version. But who knows 🎱 The good bit: **no need to update the preset config until upgrading to a major version 🎉**

> [!NOTE]
> The `v20-lts` format is actually the [same npm tag format Angular uses to label the latest package release of a major version release](https://www.npmjs.com/package/@angular/core?activeTab=versions)

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
- **Schedule syntax**: at the moment of writing specified via a `cron` or via a string to be parsed with `@breejs/later` library. `cron` lines are not very straight-forward to parse as humans. With the latter, despite more human, can be prone to error. Library may fail to parse it, and [Renovate will reject it if it fails to parse it](https://github.com/renovatebot/renovate/blob/39.262.1/lib/workers/repository/update/branch/schedule.ts#L63-L68). Also specifying it in this more human-friendly syntax [will be deprecated](https://docs.renovatebot.com/key-concepts/scheduling/#deprecated-breejslater-syntax)

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

Unless you use the [recommended config preset `config:recommended`](https://docs.renovatebot.com/presets-config/#configrecommended) (or any other config that uses it, like `js-app|lib` or `best-practices`). In that case, the [`:semanticPrefixFixDepsChoreOthers` preset](https://docs.renovatebot.com/presets-default/#semanticprefixfixdepschoreothers) is enabled and therefore:

- Type: `fix` for deps. `chore` for others

Those may not be of your taste. So offering more options in here.

### Usage

> [!IMPORTANT]
> If using `config:recommended` (or any config that uses it), add any commit config preset after it. Otherwise, the configuration will be overwritten by the recommended config preset.

#### Dependabot

I like how Dependabot creates the commit messages. [Documentation is not very specific about how they are created](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#commit-message--). However, from pragmatic experience, commit messages use:

- Type: `build`
- Scope: `deps` or `dev-deps`

If you prefer this kind of dependabot-like commit messages, you can use them with this preset:

```json
{
  "extends": ["github>davidlj95/renovate-config:commit/dependabot"]
}
```

## Groups and packages

The [recommended Renovate config groups some dependency updates](https://github.com/renovatebot/renovate/blob/39.262.1/lib/config/presets/internal/config.ts#L33). This way there's less noise, packages from the same monorepository are updated all at once, ...

However, you may want to further reduce the noise by updating dependencies in even bigger groups. For instance, by functional purpose of those packages.

For that reason, the following presets exist:

- [Packages](./packages.json). With subjective groups of packages associated by programming language and functional purpose. Similar to [Renovate's packages presets in `packages.ts`](https://github.com/renovatebot/renovate/blob/39.262.1/lib/config/presets/internal/packages.ts)

- [Group](./group.json). Use the packages grouping in the previous file to group dependency updates. Essentially assigns a name to groups of dependencies to be updated together. Similar to [Renovate's group presets in `group.ts`](https://github.com/renovatebot/renovate/blob/39.262.1/lib/config/presets/internal/group.ts)

### Usage

If you like that kind of grouping, you can use those groups to group your dependency updates.

```json
{
  "extends": ["github>davidlj95/renovate-config:group/release"]
}
```

Or if you want to use all groups defined at once:

```json
{
  "extends": ["github>davidlj95/renovate-config:group/all"]
}
```

> [!IMPORTANT]
> Those groups are experimental and may change at some point in time
> Use a git ref when referencing those to avoid breaking changes
> See the [personal](#personal) section for more info on how to do that

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

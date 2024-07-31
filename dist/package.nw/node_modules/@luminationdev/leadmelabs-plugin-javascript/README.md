# LeadMeLabs Plugin Javascript
A plugin to integrate a javascript app into LeadMe Labs to be controlled as an experience

## Testing locally
Run `npm run build`

Run `npm link` in this repository. Run `npm link leadmelabs-plugin-javascript` in the other repository. You can
then use it like a normal package.

## Publishing
Handled by github actions, published through a private github package.

## Installing
Create or modify a `.npmrc` file in the root directory of your project. Add the following code
```
@luminationdev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxx
```
Replace 'ghp_xxx' with a personal access token with the read:packages permission.

Run `npm install @luminationdev/leadmelabs-plugin-javascript`

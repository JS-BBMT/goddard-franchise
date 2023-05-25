## ASP.NET ZERO - Angular UI

See documentation: https://www.aspnetzero.com/Documents/Getting-Started-Angular

### Getting Started
1. Make sure API is running
2. Run `yarn install`
3. Run `npm run create-dynamic-bundles`
4. Run `npm start`
5. Browse to `http://localhost:4200/account/login?login=native`
6. Login with un/pw admin/123qwe
7. Browse to Administration > Visual Settings, set to theme 7

### Deployment

**Parsus DEV**
1. Build angular code
```
ng build --configuration=dev
```
2. Deploy via [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) VSCode extension

     1. Right-click `dist` folder
     2. Select Deploy to Static Website via Azure Storage
     3. Select Pay-As-You-Go subscription
     4. Select `gsifranchiseeportal`


## Test commit to trigger build again


### Set up SSO

If you get the message: "SSO Token Expired, need to refresh from https://franchiseeportal-dev-useast-app.azurewebsites.net/.auth/me"

You need to navigate to that URL, grab the token from that location (copy the whole text) and paste it into <project>/src/.auth/me

https://franchiseeportal-dev-useast-app.azurewebsites.net/.auth/me

## Troubleshooting

### Azure build failure:
##[error]unauthorized: Invalid clientid or client secret.

Fixed by following:

https://stackoverflow.com/questions/55495223/push-docker-image-task-to-acr-fails-in-azure-unauthorized-authentication-requi

and creating a new service connection with the manual container registry inputs

## Formatting

Formatting is supported on editors with instructions below: 

It is based on a combination of editorconfig and js-beautify: https://www.npmjs.com/package/js-beautify

### VSCode

1. Install and activate the EditorConfig plugin

https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig

2. Make sure that your settings are reading from the shared workspace settings

FranchiseePortal-Website/.vscode/settings.json

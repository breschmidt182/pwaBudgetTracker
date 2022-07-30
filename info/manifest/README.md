# About The *manifest.json* File

The first step to building a PWA is to build a manifest file. This file tells the browser some basic info about the PWA for when it runs in a "standalone" mode. It's typically named *manifest.json* and it's in the root of your public folder.

You'll see that you can specify the name of the app, and some details about how it should look when it runs in standalone mode. 

When your web application is installed on either a desktop or a mobile device as an actual application, it needs to have an icon so it can be displayed on that device. In the manifest file you will see an object referencing different icon graphics files of different sizes. The operating system of whatever device you install on will choose the icon file it needs.

Also, when you install your web app as a standalone app, your web browser is in some ways "merged" with the app itself. You essentially get a dedicated instance of the web browser to act as a container for your app. Because of this, the manifest file lets you specify things like the background and theme color that should be used as the defaults for the app.

The "start_url" property tells the app where to look for the initial application file. In this case it points to the *index.html* file in the public directory. (Remember that "/" is the same as "/index.html" as far as any browser is concerned.)

If you're interested, more info can be found [here](https://web.dev/i18n/en/add-manifest/).
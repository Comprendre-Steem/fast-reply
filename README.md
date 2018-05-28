# Fast-Reply

If like me you are spending multiple hours every day on Steem, creating 
content but also interacting with the community, you might live with the 
impression that you have too many comments to be able to answer them all… 

I love interacting with the Steem community ! But Finding all the comments 
and giving a personal answer is definitely an important part of my day. 
But it takes a lot of time… and I am always afraid to have missed one !

Fast-Reply is a web application capable of :

1. Finding all the recent (< 7 days) un-answered comments made on your 
posts and comments.
2. Providing a simple distraction-less environment to write a response
3. Going around the delay between action currently imposed by the Steem 
blockchain.

## Tool Annoncement

- 0.1: This tool has been [first annonced on Steem on May 21, 2018](https://steemit.com/utopian-io/@roxane/fast-reply-v0-1-never-miss-to-answer-a-comment-again-and-do-it-faster-than-ever).
- 0.2: First update [released on May 28, 2018](https://steemit.com/utopian-io/@roxane/fast-reply-v0-2-never-miss-to-answer-a-comment-again-and-do-it-faster-than-ever)

## Live Demo

A live demo is available: [HERE](http://fast-reply.surge.sh)

## Technical stuff

Version 0.2 is a complete re-write using a new architecture used for 
larger, team-developed projects. More precisely, the code is still written 
using the Vue.js 2 javascript framework but we now:

- Use [npm](https://www.npmjs.com/) & [Webpack](https://webpack.js.org/) to built
- Have a [components-based](https://fr.vuejs.org/v2/guide/components.html) 
source code
- Added the [vue-router](https://router.vuejs.org/) and [vuex](https://vuex.vuejs.org/) plugins. 

Those changes result in a more stable, easier to maintain and to evolve 
piece of software.

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


### Security

Fast-Reply uses SteemConnect to handle authentication.
The posting role is used since the application only interact with the
Steem blockchain for basic features:

- Vote
- Comment
- Un/Follow/Mute user

## Authors

@comprendre-steem is a collective account which purpose is to 
explain Steem and help with the onboarding process of new french users.

For that purpose, a website has been created to gather all the 
important pieces of information in french. All kind of useful information 
are available on that website from markdown tutorial to Steem whitepapers
translation, but also video tutorial on Steem and its tools.

@roxane is one of the french community leaders, she has been teaching
Steem and its ecosystem for almost one year.

@oroger is more focused on the technical understanding and support
regarding the blockchain and development aspects.

## Disclaimer

This application is currently under development.  
Updates are pushed frequently and might provoke instabilities.
This is mainly due to a de-synchronisation of the localstorage.
A button will be provided to clear the localstorage and start with
a new state for those cases.

Also, the interaction with the Steem blockchain rely on the Steem API.
We noticed that sometimes, the API return error but still execute the
requested actions. Safeguards have been put in place to avoid problems
but you could still have cases where a comment or a vote has been sent multiple 
times... 

future versions will allow you to have a better view on what happens...
in the mean time any constructive feedback is welcome.

## License

The software is released under MIT License.
